import type { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'
import type { Web3Provider } from '@ethersproject/providers'
import { formatEther } from '@ethersproject/units'
import { useContractCall, useContractFunction, useTokenAllowance } from '@usedapp/core'
import { utils } from 'ethers'
import { useState } from 'react'
import styled from 'styled-components'
import { TextBold } from '../../typography/Text'
import { SectionRow } from '../base/base'
import { Button } from '../base/Button'

import { ArtGobblersInterface } from '../../abi'
import { ART_GOBBLER_ADDRESS } from '../Constants'

interface InteractProps {
  poolAddress: string
  account: string
  library: Web3Provider
}


export const ApproveGobblers = ({ poolAddress, account, library }: InteractProps) => {
  const contract = new Contract(ART_GOBBLER_ADDRESS, ArtGobblersInterface, library.getSigner())
  const { send } = useContractFunction(contract, 'setApprovalForAll')
  const [value, setValue] = useState('0')
  return (
    <SectionRow>
      <label>Approve Gobblers (approve the transfer of gobblers to vault)</label>
      <SmallButton
        onClick={(e) => {
          send(poolAddress, true)
          setValue('0')
        }}
      >
        Approve
        </SmallButton>
    </SectionRow>
  )
}

export const ApproveGobblersComponent = ({ poolAddress, account, library }: InteractProps) => {
  const contract = new Contract(ART_GOBBLER_ADDRESS, ArtGobblersInterface, library.getSigner()) as any

  const { state, send } = useContractFunction(contract, 'setApprovalForAll')
  const { status } = state

  const approveGobblers = () => {
    void send(poolAddress, true)
  }

  return (
    <div>
      <button onClick={() => approveGobblers()}>Approve Gobblers</button>
      <p>Status: {status}</p>
    </div>
  )
}

/*
export const DepositFei = ({ poolAddress, account, library }: InteractFeiProps) => {
  const contract = new Contract(poolAddress, lFeiInterface, library.getSigner())
  const { send } = useContractFunction(contract, 'depositFei')
  const [value, setValue] = useState('0')
  const tokenAllowance = useTokenAllowance(feiAddress, account, poolAddress)
  return (
    <SectionRow>
      {tokenAllowance && <label>Deposit Fei in Pool (can deposit {formatEther(tokenAllowance)})</label>}
      <Input type="number" step="1" value={value} onChange={(e) => setValue(e.currentTarget.value)} />
      <SmallButton
        onClick={(e) => {
          send(utils.parseEther(value))
          setValue('0')
        }}
      >
        Deposit
        </SmallButton>
    </SectionRow>
  )
}

export const WithdrawFei = ({ poolAddress, account, library }: InteractFeiProps) => {
  const contract = new Contract(poolAddress, lFeiInterface, library.getSigner())
  const { send } = useContractFunction(contract, 'withdrawFei')
  const [value, setValue] = useState('0')
  const [withdrawableFei] = useContractCall({
    abi: lFeiInterface,
    address: poolAddress,
    method: "withdrawableFei",
    args: [account]
  }) ?? []
  return (
    <SectionRow>
      {withdrawableFei && <label>Withdraw Fei from Pool (can withdraw {formatEther(withdrawableFei)})</label>}
      <Input type="number" step="1" value={value} onChange={(e) => setValue(e.currentTarget.value)} />
      <SmallButton
        onClick={(e) => {
          send(utils.parseEther(value))
          setValue('0')
        }}
      >
        Withdraw
        </SmallButton>
    </SectionRow>
  )
}
*/
const SmallButton = styled(Button)`
  min-width: unset;
  height: unset;
  padding: 5px 20px;
`

const Input = styled.input`
  margin-left: 10px;
  padding: 4px;
`

const CellTitle = styled(TextBold)`
  font-size: 20px;
  margin-bottom: 10px;
`
