import { Provider } from 'mobx-react'
import { MainStore } from 'stores'
import { Main } from 'components'

export default class Root extends React.Component {
  
  render() {
    return (
      <Provider mainStore={MainStore}>
        <Main main />
      </Provider>
    )
  }

}