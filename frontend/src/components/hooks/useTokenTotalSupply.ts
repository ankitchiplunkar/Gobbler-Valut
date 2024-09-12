import type { BigNumber } from '@ethersproject/bignumber'
import { ERC20Interface } from '../../abi'
import type { Falsy } from '../Constants'
import { useContractCall } from '@usedapp/core'

export function useTokenTotalSupply(tokenAddress: string | Falsy): BigNumber | undefined {
  const [totalSupply] =
    useContractCall(
      tokenAddress &&
      {
          abi: ERC20Interface,
          address: tokenAddress,
          method: 'totalSupply',
          args: [],
        }
    ) ?? []
  return totalSupply
}
