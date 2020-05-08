import {NativeModules} from 'react-native'
import Config from '../Config/DebugConfig'
import Immutable from 'seamless-immutable'
import Reactotron from 'reactotron-react-native'
import { reactotronRedux as reduxPlugin } from 'reactotron-redux'
import sagaPlugin from 'reactotron-redux-saga'
import AsyncStorage from '@react-native-community/async-storage'

if (Config.useReactotron) {
  const scriptURL = NativeModules.SourceCode.scriptURL;
  const scriptHostname = scriptURL.split('://')[1].split(':')[0];
  // https://github.com/infinitered/reactotron for more options!
  Reactotron.configure({name: 'Ignite App', host: scriptHostname})
    .setAsyncStorageHandler(AsyncStorage)
    .useReactNative()
    .use(reduxPlugin({ onRestore: Immutable }))
    .use(sagaPlugin())
    .connect();

  // Let's clear Reactotron on every time we load the app
  Reactotron.clear();

  // Totally hacky, but this allows you to not both importing reactotron-react-native
  // on every file.  This is just DEV mode, so no big deal.
  console.tron = Reactotron;
} else {
  const noop = () => undefined;
  const ouroboros = () => console.tron;

  // attach a mock so if things sneaky by our __DEV__ guards, we won't crash.
  console.tron = {
    startTimer: () => noop,
    send: noop,
    apiResponse: noop,
    debug: noop,
    stateActionComplete: noop,
    stateValuesResponse: noop,
    stateKeysResponse: noop,
    stateValuesChange: noop,
    stateBackupResponse: noop,
    repl: noop,
    warn: noop,
    configure: ouroboros,
    connect: ouroboros,
    use: ouroboros,
    useReactNative: ouroboros,
    close: noop,
    clear: noop,
    log: noop,
    logImportant: noop,
    display: noop,
    error: noop,
    image: noop,
    reportError: noop,
    benchmark: (name) => ({step: noop, stop: noop}),
    onCustomCommand: noop,
  };
}
