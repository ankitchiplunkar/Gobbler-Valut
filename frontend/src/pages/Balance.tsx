import { formatEther, formatUnits } from '@ethersproject/units'
import { useEtherBalance, useEthers } from '@usedapp/core'
import { Container, ContentBlock, ContentRow, MainContent, Section, SectionRow } from '../components/base/base'
import { Button } from '../components/base/Button'
import { Label } from '../typography/Label'
import { TextInline } from '../typography/Text'
import { Title } from '../typography/Title'
import { useGooBalance, useUserEmissionMultiple, useTokenTotalSupply } from '../components/hooks'
import { ApproveGobblersComponent } from '../components/Notifications/Forms'
import { MULTIPLY_GOBBLER_ADDRESS } from '../components/Constants'

export function Balance() {
  const { activateBrowserWallet, deactivate, account, library } = useEthers()
  const userVirtualGooBalance = useGooBalance(account)
  const userEmissionMultiple = useUserEmissionMultiple(account)
  const vaultVirtualGooBalance = useGooBalance(MULTIPLY_GOBBLER_ADDRESS)
  const vaultEmissionMultiple = useUserEmissionMultiple(MULTIPLY_GOBBLER_ADDRESS)
  const vaultTotalSupply = useTokenTotalSupply(MULTIPLY_GOBBLER_ADDRESS)

  return (
    <MainContent>
      <Container>
        <Section>
          <SectionRow>
            <Title>User Balances</Title>
            {account ? (
              <Button onClick={() => deactivate()}>Disconnect</Button>
            ) : (
                <Button onClick={() => activateBrowserWallet()}>Connect</Button>
              )}
          </SectionRow>
          <ContentBlock>
            {account && (
              <ContentRow>
                <Label>Account:</Label> <TextInline>{account}</TextInline>
              </ContentRow>
            )}
            {userVirtualGooBalance && (
              <ContentRow>
                <Label>Virtual Goo balance:</Label> <TextInline>{formatEther(userVirtualGooBalance)}</TextInline> <Label>GOO</Label>
              </ContentRow>            
            )}
            {userEmissionMultiple && (
              <ContentRow>
                <Label>Emission multiple:</Label> <TextInline>{formatUnits(userEmissionMultiple, 0)}</TextInline> 
              </ContentRow>            
            )}
          </ContentBlock>

          <SectionRow>
          </SectionRow>
          <Title>Pool Data</Title>
          
          <SectionRow>
          <ContentBlock>
            {vaultVirtualGooBalance && (
              <ContentRow>
                <Label>Virtual Goo balance:</Label> <TextInline>{formatEther(vaultVirtualGooBalance)}</TextInline> <Label>GOO</Label>
              </ContentRow>            
            )}
            {vaultEmissionMultiple && (
              <ContentRow>
                <Label>Emission multiple:</Label> <TextInline>{formatUnits(vaultEmissionMultiple, 0)}</TextInline> 
              </ContentRow>            
            )}
            {vaultTotalSupply && (
              <ContentRow>
                <Label>Total Supply:</Label> <TextInline>{formatEther(vaultTotalSupply)}</TextInline> <Label>mGOB</Label>
              </ContentRow>            
            )}
            </ContentBlock>
          </SectionRow>


          <SectionRow>
            <Title>Pool Actions</Title>
          </SectionRow>

          <ContentBlock>
                {account && library && <ApproveGobblersComponent poolAddress={MULTIPLY_GOBBLER_ADDRESS} account={account} library={library} />}
          </ContentBlock>
        </Section>
      </Container>
    </MainContent>
  )
}
