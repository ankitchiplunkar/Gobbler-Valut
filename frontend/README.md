# LFei frontend

Website deployed at: https://ankitchiplunkar.com/lfei-frontend
Smart contract code at: https://github.com/ankitchiplunkar/lfei-core 

### Contract Flow
1. [depositFei(uint256 amountFeiIn)](https://github.com/ankitchiplunkar/lfei-core/blob/master/contracts/LFeiPair.sol#L54): Deposit `amountFeiIn` Fei into the contract and receive an equivalent amount of LFei tokens (used by **Fei holders**) . [Deposit transaction](https://etherscan.io/tx/0x04b4b74dfdf97bf611afc2e9b5961edfa532532f3d020fcbcab56fc47f5a7580)
2. [withdrawFei(uint256 amountFeiOut) ](https://github.com/ankitchiplunkar/lfei-core/blob/master/contracts/LFeiPair.sol#L71): Can withdraw `amountFeiOut` Fei by returning `amountFeiOut` LFei tokens (used by **Fei holders**). [Withdraw Fei transaction](https://etherscan.io/tx/0x2fa51c1f73c33b3660a442baa44e5cad5dc795d3887f069654fe815bf5941749)
3. [swap(uint256 amountFeiOut, address to, bytes calldata data)](https://github.com/ankitchiplunkar/lfei-core/blob/master/contracts/LFeiPair.sol#L114): Can flash loan `amountFeiOut` Fei tokens from the contract but has to return atleast `conversionRate*amountFeiOut` USDC tokens + 0.3% in fees. Any extra USDC can be claimed by the arbitrageur, the marketplace will give 0.3% of USDC tokens to the contract creator for each USDC withdrawal.(used by **Arbitrageurs**). [Arbitrage transaction](https://etherscan.io/tx/0xfaed5d83a23f5bed18e62a65c56354252e6c6e764cf8307695984fc625ada974)
4. [withdrawUSDC(uint256 amountUSDCOut)](https://github.com/ankitchiplunkar/lfei-core/blob/master/contracts/LFeiPair.sol#L89): Can withdraw USDC by returning LFei tokens, will burn `amountUSDCOut/conversionRate` lFei tokens from the user and will return `amountUSDCOut` USDC tokens. (used by **Fei holders**) [Withdraw USDC transaction](https://etherscan.io/tx/0x803a7e86fe025bddcbc90bf055048663e11e718dbe74123df85460a662dd2a87)

## Contracts

### Mainnet:
1. `ConversionRate = 1FEI<>1USDC`: [0x4a7f7106d485BeAaaD798658fc99ab7E7d690e15](https://etherscan.io/address/0x4a7f7106d485BeAaaD798658fc99ab7E7d690e15)
2. `ConversionRate = 0.9FEI<>1USDC`: [0x7a3b15ee0d0884804f6e846f1f597175ea4631a8](https://etherscan.io/address/0x7a3b15ee0d0884804f6e846f1f597175ea4631a8)

### Ropsten:
1. `ConversionRate = 1FEI<>1USDC`: [0xE95b5622410e56ea876fFed00C3f63c6EF3D56A6](https://ropsten.etherscan.io/address/0xE95b5622410e56ea876fFed00C3f63c6EF3D56A6)
2. `ConversionRate = 0.95FEI<>1USDC`: [0xfECB7F0e191Feefabd85361F91E830e88f304D2F](https://ropsten.etherscan.io/address/0xfECB7F0e191Feefabd85361F91E830e88f304D2F)
3. `ConversionRate = 0.9FEI<>1USDC`: [0xAfc6CC6ec62E0E76b03B763E36E27b055F273cdb](https://ropsten.etherscan.io/address/0xAfc6CC6ec62E0E76b03B763E36E27b055F273cdb)
4. `ConversionRate = 0.85FEI<>1USDC`: [0x26Ba4e093122e0327971EC34811c24aF3B4b7AC5](https://ropsten.etherscan.io/address/0x26Ba4e093122e0327971EC34811c24aF3B4b7AC5)
5. `ConversionRate = 0.8FEI<>USDC`: [0xC8551200257aD83bbC01fE82984c815908B0Fe8C](https://ropsten.etherscan.io/address/0xC8551200257aD83bbC01fE82984c815908B0Fe8C)
6. `ConversionRate = 0.75FEI<>USDC`: [0xB2D62330ed55E23e517f6e2d48989dE8d1d1e3b2](https://ropsten.etherscan.io/address/0xB2D62330ed55E23e517f6e2d48989dE8d1d1e3b2)

Built using https://usedapp.io/