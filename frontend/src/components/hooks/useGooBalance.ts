import type { BigNumber } from '@ethersproject/bignumber'
import { ArtGobblersInterface } from '../../abi'
import type { Falsy } from '../Constants'
import { useContractCall } from '@usedapp/core'
import {ART_GOBBLER_ADDRESS } from '../Constants'

export function useGooBalance(address: string | Falsy): BigNumber | undefined {
  const [gooBalance] =
    useContractCall(
      address &&{
          abi: ArtGobblersInterface,
          address: ART_GOBBLER_ADDRESS,
          method: 'gooBalance',
          args: [address],
        }
    ) ?? []
  return gooBalance
}
