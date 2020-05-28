import 'react-native-gesture-handler'
import './App/Config/ReactotronConfig'
import { AppRegistry } from 'react-native'
import App from './App/Containers/App'
import {name as appName} from './app.json'
// require('react-native').unstable_enableLogBox()

AppRegistry.registerComponent(appName, () => App)
