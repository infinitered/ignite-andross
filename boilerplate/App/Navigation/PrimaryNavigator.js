import React from 'react';
import {
  createStackNavigator,
  HeaderStyleInterpolators,
} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {getTabBarIcon} from '../Components/TabIcon';
import LaunchScreen from '../Containers/LaunchScreen';
import TabScreen from '../Containers/LaunchScreen';
import {Colors} from '../Themes';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator tabBarOptions={{activeTintColor: Colors.themeColor}}>
      <Tab.Screen
        name="Home"
        options={{tabBarIcon: getTabBarIcon('md-home')}}
        component={TabScreen}
      />
      <Tab.Screen
        name="More"
        options={{tabBarIcon: getTabBarIcon('md-menu')}}
        component={TabScreen}
      />
    </Tab.Navigator>
  );
}

export function PrimaryNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        gestureEnabled: true,
        headerStyle: {
          backgroundColor: Colors.themeColor,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerStyleInterpolator: HeaderStyleInterpolators.forUIKit,
      }}>
      <Stack.Screen
        name="LaunchScreen"
        options={{title: 'Home'}}
        component={LaunchScreen}
      />
      <Stack.Screen
        name="TabScreen"
        options={{title: 'Tab Screen'}}
        component={MyTabs}
      />
    </Stack.Navigator>
  );
}

/**
 * A list of routes from which we're allowed to leave the app when
 * the user presses the back button on Android.
 *
 * Anything not on this list will be a standard `back` action in
 * react-navigation.
 */
export const exitRoutes: string[] = ['welcome'];
