// SPDX-License-Identifier: MIT
pragma solidity >=0.8.4;

import { IArtGobbler } from "./IArtGobbler.sol";
import { ERC20 } from "solmate/src/tokens/ERC20.sol";
import { ERC721TokenReceiver } from "solmate/src/tokens/ERC721.sol";
import { Owned } from "solmate/src/auth/Owned.sol";
import { LibGOO } from "./LibGOO.sol";
import { toDaysWadUnsafe } from "solmate/src/utils/SignedWadMath.sol";

contract MultiplyGobblerVault is ERC20, ERC721TokenReceiver, Owned {
    IArtGobbler public immutable artGobbler;
    uint256 public lastMintEmissionMultiple;
    uint256 public lastMintGooBalance;
    uint256 public lastMintTimestamp;
    uint256 public totalMinted = 0;
    uint256 public totalLaggedMultiple = 0;
    uint256 public constant PRECISION = 1e6;
    uint256 public constant TAX_RATE = 5000;
    uint256 public constant DEPOSIT_TAX_START_AFTER = 2;
    mapping(address => mapping(uint256 => uint256)) public laggingDeposit;

    // TODO: add error messages
    error GooDepositFailed();
    error TotalMintedIsZero();
    error ClaimingInLowerMintWindow();

    // TODO: add events

    constructor(address _artGobbler) ERC20("Multiply Gobbler", "mGOB", 18) Owned(msg.sender) {
        artGobbler = IArtGobbler(_artGobbler);
    }

    // View functions
    // Vault will keep on buying more Gobblers
    // this means that the conversion rate cannot remain 10**18
    function getConversionRate() public view returns (uint256) {
        if (totalSupply > 0) {
            uint256 vaultMultiple = artGobbler.getUserEmissionMultiple(address(this));
            return totalSupply / (vaultMultiple - totalLaggedMultiple / PRECISION);
        }
        return 10**18;
    }

    // Used to calculate Goo to be deposited with a Gobbler
    // getGooDeposit is the extra Goo produced by a Gobbler from last mint to block.timestamp
    function getGooDeposit(uint256 multiplier) public view returns (uint256) {
        // Do not take any goo deposit till the first mint
        // this will expose the vault for MEV etc in the first mint
        // intention is to test teh vault till the first mint anyways
        // second option is to update the lastMint values at the first deposit
        if (totalMinted == 0) return 0;
        return
            LibGOO.computeGOOBalance(
                lastMintEmissionMultiple + multiplier,
                lastMintGooBalance,
                uint256(toDaysWadUnsafe(block.timestamp - lastMintTimestamp))
            ) -
            LibGOO.computeGOOBalance(
                lastMintEmissionMultiple,
                lastMintGooBalance,
                uint256(toDaysWadUnsafe(block.timestamp - lastMintTimestamp))
            );
    }

    // Implements the strategy which will be used to buy Gobblers from virtual GOO
    // Currently implements the MAX BIDDING strategy!
    function gobblerStrategy() public view returns (uint256) {
        return artGobbler.gooBalance(address(this));
    }

    // State changing functions
    // Deposit Gobbler into the vault and get mGOB tokens proportional to multiplier of the Gobbler
    // This requires an approve before the deposit
    function deposit(uint256 id) public {
        // multiplier of to be deposited gobbler
        uint256 multiplier = artGobbler.getGobblerEmissionMultiple(id);
        // transfer art gobbler into the vault
        artGobbler.safeTransferFrom(msg.sender, address(this), id);
        // transfer go debt into the vault
        uint256 gooDeposit = getGooDeposit(multiplier);
        if (gooDeposit > 0) {
            bool success = artGobbler.transferGooFrom(msg.sender, address(this), gooDeposit);
            if (!success) revert GooDepositFailed();
        }
        // mint the mGOB tokens to depositor
        uint256 conversionRate = getConversionRate();
        if (totalMinted > DEPOSIT_TAX_START_AFTER) {
            uint256 depositTax = (multiplier * conversionRate * TAX_RATE) / PRECISION;
            _mint(owner, depositTax);
            _mint(msg.sender, multiplier * conversionRate - depositTax);
        } else {
            _mint(msg.sender, multiplier * conversionRate);
        }
    }

    // Withdraw a Gobbler from the vault
    function withdraw(uint256 id) public {
        // multiplier of to be withdrawn gobbler
        uint256 multiplier = artGobbler.getGobblerEmissionMultiple(id);
        // burn the mGOB tokens to depositor
        _burn(msg.sender, multiplier * getConversionRate());
        // transfer art gobbler to the withdrawer
        artGobbler.safeTransferFrom(address(this), msg.sender, id);
    }

    // enables depositing inbetween mints without submitting goo
    function depositWithLag(uint256 id) public {
        if (totalMinted == 0) revert TotalMintedIsZero();
        // multiplier of to be deposited gobbler
        uint256 multiplier = artGobbler.getGobblerEmissionMultiple(id);
        // transfer art gobbler into the vault
        artGobbler.safeTransferFrom(msg.sender, address(this), id);
        if (totalMinted > DEPOSIT_TAX_START_AFTER) {
            uint256 depositTax = multiplier * TAX_RATE;
            laggingDeposit[owner][totalMinted] += depositTax;
            laggingDeposit[msg.sender][totalMinted] += multiplier * PRECISION - depositTax;
        } else {
            laggingDeposit[msg.sender][totalMinted] += multiplier * PRECISION;
        }
    }

    // enables withdraw lagged deposits
    // can only withdraw from current mint prep
    function withdrawLagged(uint256 id) public {
        // multiplier of to be withdrawn gobbler
        uint256 multiplier = artGobbler.getGobblerEmissionMultiple(id);
        // burn the mGOB tokens to depositor
        laggingDeposit[msg.sender][totalMinted] -= multiplier * PRECISION;
        totalLaggedMultiple -= multiplier * PRECISION;
        // transfer art gobbler to the withdrawer
        artGobbler.safeTransferFrom(address(this), msg.sender, id);
    }

    // enables claiming mGOB tokens after the next mint
    function claimLagged(uint256[] calldata whenMinted) public {
        uint256 conversionRate = getConversionRate(); // caching for gas
        for (uint256 i = 0; i < whenMinted.length; i++) {
            // cannot claim deposit if the next token has not been minted
            if (totalMinted <= whenMinted[i]) revert ClaimingInLowerMintWindow();
            uint256 oldDeposit = laggingDeposit[msg.sender][whenMinted[i]];
            laggingDeposit[msg.sender][whenMinted[i]] = 0;
            totalLaggedMultiple -= oldDeposit;
            _mint(msg.sender, (oldDeposit / PRECISION) * conversionRate);
        }
    }

    // Any address can call this function and mint a Gobbler
    // Strategy should return Goo > GobblerPrice() for the transaction to succeed
    // Also stores emissionMultiple, GooBalance and Timestamp at time of mint
    // If someone withdraws Gobblers before calling this function (in expectation of paying less Goo balance on Deposit)
    // They will lose out on minted multiplier rewards by the time they deposit
    function mintGobbler() public {
        artGobbler.mintFromGoo(gobblerStrategy(), true);
        lastMintEmissionMultiple = artGobbler.getUserEmissionMultiple(address(this));
        lastMintGooBalance = artGobbler.gooBalance(address(this));
        lastMintTimestamp = block.timestamp;
        totalMinted += 1;
    }

    // Any address can call this function and mint a Legendary Gobbler
    // If there are enough virtual Goo in then the vault can mint a Gobbler
    // TODO: add reentrancy guard here
    function mintLegendaryGobbler(uint256[] calldata gobblerIds) public {
        artGobbler.mintLegendaryGobbler(gobblerIds);
    }
}
