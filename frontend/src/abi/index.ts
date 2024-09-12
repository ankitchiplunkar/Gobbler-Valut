import { Interface } from '@ethersproject/abi'
import ERC20 from './ERC20.json'
import ArtGobblers from './ArtGobblers.json'
import MultiplyGobblerVault from './MultiplyGobblerVault.json'

const ERC20Interface = new Interface(ERC20.abi)

export { ERC20, ERC20Interface }

const ArtGobblersInterface = new Interface(ArtGobblers.abi)

export { ArtGobblers, ArtGobblersInterface }

const MultiplyGobblerVaultInterface = new Interface(MultiplyGobblerVault.abi)

export { MultiplyGobblerVault, MultiplyGobblerVaultInterface }