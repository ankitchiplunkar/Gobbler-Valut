import type { BigNumber } from '@ethersproject/bignumber'
import { ArtGobblersInterface } from '../../abi'
import type { Falsy } from '../Constants'
import { useContractCall } from '@usedapp/core'
import {ART_GOBBLER_ADDRESS } from '../Constants'

export function useUserEmissionMultiple(address: string | Falsy): BigNumber | undefined {
  const [emissionMultiple] =
    useContractCall(
      address &&
      {
          abi: ArtGobblersInterface,
          address: ART_GOBBLER_ADDRESS,
          method: 'getUserEmissionMultiple',
          args: [address],
        }
    ) ?? []
  return emissionMultiple
}
