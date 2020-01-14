<p align="center"><img src="http://ir_public.s3.amazonaws.com/projects/ignite/ignite-andross-launch-screen.png" alt="logo" width="414px"></p>

# Ignite "Andross" Boilerplate

NOTE: This repo has been renamed from ignite-ir-boilerplate-andross to ignite-andross. Although web traffic and git operations for the previous name will be redirected, we recommend you update any links and git urls for this repo.

[![CircleCI](https://circleci.com/gh/infinitered/ignite-andross.svg?style=svg)](https://circleci.com/gh/infinitered/ignite-andross)

## The original tried and true boilerplate for [Infinite Red](https://infinite.red)'s React Native apps

Currently includes:

* React Native 0.59.9
* React Navigation 3.11.0
* Redux
* Redux Sagas
* And more!

## Quick Start

When you've installed the [Ignite CLI](https://github.com/infinitered/ignite), you can get started with this boilerplate like this:

```sh
npx ignite-cli new MyLatestCreation
```

By default we'll ask you to choose which boilerplate you'd like. If you just want to use this one you can specify it with `--boilerplate` or `-b`:

```sh
npx ignite-cli new MyLatestCreation --boilerplate andross
```

You can also change the React Native version; just keep in mind, we may not have tested this just yet.

```sh
npx ignite-cli new MyLatestCreation --react-native-version 0.99.0-rc.2
```

By default we'll ask you some questions during install as to which features you'd like.  If you just want them all, you can skip the questions:

```sh
npx ignite-cli new MyLatestCreation --max
```

If you want very few of these extras:

```sh
npx ignite-cli new MyLatestCreation --min
```

## Boilerplate walkthrough

Your `App` folder is where most of the goodies are found in an Ignite Next app. Let's walk through them in more detail. Start with `Containers/App.js` (described below) and work your way down the walkthrough in order.

### Containers

Containers are (mostly) full screens, although they can be sections of screens or application containers.

* `App.js` - your main application. We create a Redux store and configure it here
* `RootContainer.js` - main view of your application. Contains your status bar and navigation component
* `LaunchScreen.js` - this is the first screen shown in your application. It's loaded into the Navigation component
* `Styles` - styling for each of the above containers and screens

To generate a new Container or Screen you can use the following generator commands:

* `npx ignite-cli g container New` - Will create a `New.js` and also a `Styles/NewStyle.js`.
* `npx ignite-cli g list New` - The same as the `container` command, but it will give you a walkthrough to generate a ListView screen. Allowing you to even pick `FlatList` or not, grid, and some other options.
* `npx ignite-cli g screen New` - Will create a `NewScreen.js` and also a `Styles/NewScreenStyle.js`. Important to mention that the `screen` generator will add the `Screen` on the file/class name to make easier to identify.

Those commands will also add the new container to the navigations file.

### Navigation

Your primary and other navigation components reside here.

* `AppNavigation.js` - loads in your initial screen and creates your menu(s) in a StackNavigation
* `Styles` - styling for the navigation
* `ReduxNavigation.js` - This file contains the core navigation of your application. If you ever change your launch screen, make sure to change it also at `if (nav.routes.length === 1 && (nav.routes[0].routeName === 'LaunchScreen')) {`, otherwise you may encounter navigation problems with the Android back button!

### Components

React components go here...pretty self-explanatory. We won't go through each in detail -- open each file to read the comments and view the code.

To generate a new Component you can use the following generator commands:

* `npx ignite-cli g component New` - Will create a `New.js` and also a `Styles/NewStyle.js`.
* `npx ignite-cli g component path/New` - The same as above, but will use a relative path
* `npx ignite-cli g component --folder path` - An alternative to `npx ignite-cli g component path/index`
* `npx ignite-cli g component --folder path new ` - An alternative to `npx ignite-cli g component relativePath/New`

### Storybook

[Storybook](https://storybook.js.org/) has been setup to show off components in the different states. Storybook is a great way to develop and test components outside of use in your app. Simply run `npm run storybook` to get started. All stores are contained in the `*.story.js` files along side the components.

### Themes

Styling themes used throughout your app styles.

* `ApplicationStyles.js` - app-wide styles
* `Colors.js` - defined colors for your app
* `Fonts.js` - defined fonts for your app
* `Images.js` - loads and caches images used in your app
* `Metrics.js` - useful measurements of things like navBarHeight

### Config

Initialize and configure things here.

* `AppConfig.js` - simple React Native configuration here
* `DebugConfig.js` - define how you want your debug environment to act
* `ReactotronConfig.js` - configures [Reactotron](https://github.com/infinitered/reactotron) in your project (Note: this [will be extracted](https://github.com/infinitered/ignite/issues/779) into a plugin in the future)
* `ReduxPersist.js` - configures Redux Persist (Note: this [will be extracted](https://github.com/infinitered/ignite/issues/780) into a plugin in the future)

### Fixtures

Contains json files that mimic API responses for quicker development. These are used by the `Services/FixtureApi.js` object to mock API responses.

### Redux, Sagas

Contains a preconfigured Redux and Redux-Sagas setup. Review each file carefully to see how Redux interacts with your application.

Here again we have generators to help you out. You just have to use one of the following:

* `npx ignite-cli g redux Amazing` - Will generate and link the redux for `Amazing`.
* `npx ignite-cli g saga Amazing` - The same as above, but for the Sagas

You can read more about Redux and Redux Sagas in these blog posts:

* [Using redux-saga To Simplify Your Growing React Native Codebase](https://shift.infinite.red/using-redux-saga-to-simplify-your-growing-react-native-codebase-2b8036f650de)
* [A Tour of React Native — Part 2: Redux & Friends](https://shift.infinite.red/a-tour-of-react-native-part-2-redux-friends-4fed022aaa1e)

### Services

Contains your API service and other important utilities for your application.

* `Api.js` - main API service, giving you an interface to communicate with your back end
* `ExamplesRegistry.js` - lets you view component and Ignite plugin examples in your app
* `FixtureApi.js` - mocks your API service, making it faster to develop early on in your app
* `ImmutablePersistenceTransform.js` - part of the redux-persist implementation (will be removed)
* `RehydrationServices.js` - part of the redux-persist implementation (will be removed)

### Lib

We recommend using this folder for modules that can be extracted into their own NPM packages at some point.

### Images

Contains actual images (usually png) used in your application.

### Transforms

Helpers for transforming data between API and your application and vice versa. An example is provided that you can look at to see how it works.

### Tests

This folder (located as a sibling to `App`) contains sample Jest snapshot and unit tests for your application.

If you would like to have the `npx ignite-cli generate` command include the generation of tests when available, add
`"tests": "jest"` or `"tests": "ava"` to `./ignite/ignite.json`, depending on the test runner you are using.

**Previous Boilerplates**

* [2016 aka Ignite 1.0](https://github.com/infinitered/ignite-ir-boilerplate-2016)


## Premium Support

[Ignite CLI](https://infinite.red/ignite) and [Ignite Andross](https://github.com/infinitered/ignite-andross), as open source projects, are free to use and always will be. [Infinite Red](https://infinite.red/) offers premium Ignite CLI support and general mobile app design/development services. Email us at [hello@infinite.red](mailto:hello@infinite.red) to get in touch with us for more details.
