import { Redirect, Route, Switch } from 'react-router'
import { HashRouter } from 'react-router-dom'
import { Page } from './components/base/base'
import { TopBar } from './components/TopBar'
import { GlobalStyle } from './global/GlobalStyle'
import { Balance } from './pages/Balance'

export function App() {
  return (
    <Page>
      <GlobalStyle />
      <HashRouter>
        <TopBar />
        <Switch>
          <Route exact path="/" component={Balance} />
        </Switch>
      </HashRouter>
    </Page>
  )
}
