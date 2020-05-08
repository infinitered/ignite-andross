import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import {PrimaryNavigator} from './PrimaryNavigator';

const Stack = createStackNavigator();

const RootStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        headerMode: 'screen',
        stackPresentation: 'modal',
      }}>
      <Stack.Screen
        name="primaryStack"
        component={PrimaryNavigator}
        options={{
          headerShown: false,
          gestureEnabled: true,
        }}
      />
    </Stack.Navigator>
  );
};

export const RootNavigator = React.forwardRef((props, ref) => {
  return (
    <NavigationContainer {...props} ref={ref}>
      <RootStack />
    </NavigationContainer>
  );
});

RootNavigator.displayName = 'RootNavigator';
