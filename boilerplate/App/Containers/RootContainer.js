import React, {useEffect, useRef} from 'react';
import {
  SafeAreaProvider,
  initialWindowSafeAreaInsets,
} from 'react-native-safe-area-context';
import {useDispatch} from 'react-redux';
import StartupActions from '../Redux/StartupRedux';
import {enableScreens} from 'react-native-screens';

import {
  RootNavigator,
  exitRoutes,
  setRootNavigation,
  getActiveRouteName,
} from '../Navigation';
import {useBackButtonHandler} from '../Navigation/BackBtnHandler';

// This puts screens in a native ViewController or Activity. If you want fully native
// stack navigation, use `createNativeStackNavigator` in place of `createStackNavigator`:
// https://github.com/kmagiera/react-native-screens#using-native-stack-navigator
enableScreens();
import {includes} from 'ramda';

const canExit = (routeName: string) => includes(routeName, exitRoutes);

const RootContainer = () => {
  const dispatch = useDispatch();
  const navigationRef = useRef();
  // const [initialNavigationState, setInitialNavigationState] = useState();

  useEffect(() => {
    dispatch(StartupActions.startup());
  });

  setRootNavigation(navigationRef);
  useBackButtonHandler(navigationRef, canExit);

  /**
   * Keep track of state changes
   * Track Screens
   * Persist State
   */
  const routeNameRef = useRef();
  const onNavigationStateChange = (state) => {
    const previousRouteName = routeNameRef.current;
    const currentRouteName = getActiveRouteName(state);

    if (previousRouteName !== currentRouteName) {
      // track screens.
      __DEV__ && console.log(currentRouteName);
    }

    // Save the current route name for later comparision
    routeNameRef.current = currentRouteName;

    // Persist state to storage
    // storage.save(NAVIGATION_PERSISTENCE_KEY, state)
  };

  // otherwise, we're ready to render the app
  return (
    <SafeAreaProvider initialSafeAreaInsets={initialWindowSafeAreaInsets}>
      <RootNavigator
        ref={navigationRef}
        // initialState={initialNavigationState}
        onStateChange={onNavigationStateChange}
      />
    </SafeAreaProvider>
  );
};

export default RootContainer;
