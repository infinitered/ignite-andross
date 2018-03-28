import React from 'react'
<<<<<<< HEAD
import * as ReactNavigation from 'react-navigation'
=======
import { BackHandler, Platform } from 'react-native'
import { addNavigationHelpers } from 'react-navigation'
>>>>>>> 28be859dbb140c4696781fc120df40d39fd985cc
import { createReduxBoundAddListener } from 'react-navigation-redux-helpers'
import { connect } from 'react-redux'
import AppNavigation from './AppNavigation'

<<<<<<< HEAD
// here is our redux-aware smart component
function ReduxNavigation (props) {
  const { dispatch, nav } = props
  const navigation = ReactNavigation.addNavigationHelpers({
    dispatch,
    state: nav,
    addListener: createReduxBoundAddListener('root')
  })
=======
class ReduxNavigation extends React.Component {
  componentWillMount () {
    if (Platform.OS === 'ios') return
    BackHandler.addEventListener('hardwareBackPress', () => {
      const { dispatch, nav } = this.props
      // change to whatever is your first screen, otherwise unpredictable results may occur
      if (nav.routes.length === 1 && (nav.routes[0].routeName === 'LaunchScreen')) {
        return false
      }
      // if (shouldCloseApp(nav)) return false
      dispatch({ type: 'Navigation/BACK' })
      return true
    })
  }
>>>>>>> 28be859dbb140c4696781fc120df40d39fd985cc

  componentWillUnmount () {
    if (Platform.OS === 'ios') return
    BackHandler.removeEventListener('hardwareBackPress')
  }

  render () {
    return <AppNavigation navigation={addNavigationHelpers({ dispatch: this.props.dispatch, state: this.props.nav, addListener: createReduxBoundAddListener('root') })} />
  }
}

const mapStateToProps = state => ({ nav: state.nav })
export default connect(mapStateToProps)(ReduxNavigation)
