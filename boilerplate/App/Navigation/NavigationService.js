import React from 'react';
import {
  PartialState,
  NavigationState,
  NavigationContainerRef,
} from '@react-navigation/native';

// Gets the current screen from navigation state
export function getActiveRouteName(
  state: NavigationState | PartialState<NavigationState>,
) {
  const route = state.routes[state.index];

  if (route.state) {
    // Dive into nested navigators
    return getActiveRouteName(route.state);
  }

  return route.name;
}

export const RootNavigation = {
  navigate(name: string) {
    name;
  },
  goBack() {},
  resetRoot(state?: PartialState<NavigationState> | NavigationState) {},
  getRootState(): NavigationState {
    return {};
  },
};

export const setRootNavigation = (
  ref: React.RefObject<NavigationContainerRef>,
) => {
  for (const method in RootNavigation) {
    RootNavigation[method] = (...args: any) => {
      if (ref.current) {
        return ref.current[method](...args);
      }
    };
  }
};
