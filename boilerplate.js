const options = require('./options')
const { mergeDeepRight, pipe, assoc, omit, __ } = require('ramda')
const { getReactNativeVersion } = require('./lib/react-native-version')

/**
 * Is Android installed?
 *
 * $ANDROID_HOME/tools folder has to exist.
 *
 * @param {*} context - The gluegun context.
 * @returns {boolean}
 */
const isAndroidInstalled = function(context) {
  const androidHome = process.env['ANDROID_HOME']
  const hasAndroidEnv = !context.strings.isBlank(androidHome)
  const hasAndroid = hasAndroidEnv && context.filesystem.exists(`${androidHome}/tools`) === 'dir'

  return Boolean(hasAndroid)
}

/**
 * Let's install.
 *
 * @param {any} context - The gluegun context.
 */
async function install(context) {
  const { filesystem, parameters, ignite, reactNative, print, system, prompt, template } = context
  const { colors } = print
  const { red, yellow, bold, gray, blue } = colors

  const perfStart = new Date().getTime()

  const name = parameters.first
  const spinner = print.spin(`using the ${red('Infinite Red')} boilerplate v2 (code name 'Andross')`).succeed()

  // attempt to install React Native or die trying
  const useNpm = !ignite.useYarn
  const rnInstall = await reactNative.install({
    name,
    version: getReactNativeVersion(context),
    useNpm,
  })
  if (rnInstall.exitCode > 0) process.exit(rnInstall.exitCode)

  // remove the __tests__ directory and App.js that come with React Native
  filesystem.remove('__tests__')
  filesystem.remove('App.js')

  // copy our App, Tests & storybook directories
  spinner.text = '▸ copying files'
  spinner.start()
  filesystem.copy(`${__dirname}/boilerplate/App`, `${process.cwd()}/App`, {
    overwrite: true,
    matching: '!*.ejs'
  })
  filesystem.copy(`${__dirname}/boilerplate/Tests`, `${process.cwd()}/Tests`, {
    overwrite: true,
    matching: '!*.ejs'
  })
  filesystem.copy(`${__dirname}/boilerplate/storybook`, `${process.cwd()}/storybook`, {
    overwrite: true,
    matching: '!*.ejs'
  })
  filesystem.dir(`${process.cwd()}/ignite`)
  spinner.stop()

  // --max, --min, interactive
  let answers
  if (parameters.options.max) {
    answers = options.answers.max
  } else if (parameters.options.min) {
    answers = options.answers.min
  } else {
    answers = await prompt.ask(options.questions)
  }

  // generate some templates
  spinner.text = '▸ generating files'
  const templates = [
    { template: 'index.js.ejs', target: 'index.js' },
    { template: 'README.md', target: 'README.md' },
    { template: 'ignite.json.ejs', target: 'ignite/ignite.json' },
    { template: '.editorconfig', target: '.editorconfig' },
    { template: '.babelrc', target: '.babelrc' },
    { template: 'Tests/Setup.js.ejs', target: 'Tests/Setup.js' },
    { template: 'storybook/storybook.ejs', target: 'storybook/storybook.js' },
    { template: '.env.example', target: '.env.example' }
  ]
  const templateProps = {
    name,
    igniteVersion: ignite.version,
    reactNativeVersion: rnInstall.version,
    vectorIcons: answers['vector-icons'],
    animatable: answers['animatable'],
    i18n: answers['i18n']
  }
  await ignite.copyBatch(context, templates, templateProps, {
    quiet: !parameters.options.debug,
    directory: `${ignite.ignitePluginPath()}/boilerplate`
  })

  /**
   * Append to files
   */
  // https://github.com/facebook/react-native/issues/12724
  await filesystem.appendAsync('.gitattributes', '*.bat text eol=crlf')
  filesystem.append('.gitignore', '\n# Misc\n#')
  filesystem.append('.gitignore', '\n.env\n')

  // transform our package.json in case we need to replace variables
  const rawJson = await template.generate({
    directory: `${ignite.ignitePluginPath()}/boilerplate`,
    template: 'package.json.ejs',
    props: templateProps
  })
  const newPackageJson = JSON.parse(rawJson)

  // read in the react-native created package.json
  const currentPackage = filesystem.read('package.json', 'json')

  // deep merge, lol
  const newPackage = pipe(
    assoc('dependencies', mergeDeepRight(currentPackage.dependencies, newPackageJson.dependencies)),
    assoc('devDependencies', mergeDeepRight(currentPackage.devDependencies, newPackageJson.devDependencies)),
    assoc('scripts', mergeDeepRight(currentPackage.scripts, newPackageJson.scripts)),
    mergeDeepRight(__, omit(['dependencies', 'devDependencies', 'scripts'], newPackageJson))
  )(currentPackage)

  // write this out
  filesystem.write('package.json', newPackage, { jsonIndent: 2 })

  spinner.stop()

  // react native link -- must use spawn & stdio: ignore or it hangs!! :(
  spinner.text = `▸ linking native libraries`
  spinner.start()
  await system.spawn('npx react-native link', { stdio: 'ignore' })
  spinner.stop()

  // pass long the debug flag if we're running in that mode
  const debugFlag = parameters.options.debug ? '--debug' : ''

  // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  // NOTE(steve): I'm re-adding this here because boilerplates now hold permanent files
  // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  try {
    // boilerplate adds itself to get plugin.js/generators etc
    // Could be directory, npm@version, or just npm name.  Default to passed in values
    const boilerplate = parameters.options.b || parameters.options.boilerplate || 'ignite-andross'

    await system.spawn(`npx ignite-cli add ${boilerplate} ${debugFlag}`, { stdio: 'inherit' })

    // now run install of Ignite Plugins
    await ignite.addModule('react-navigation', { version: '3.11.0' })
    await ignite.addModule('react-native-gesture-handler', { version: '1.3.0', link: true })

    ignite.patchInFile(`${process.cwd()}/android/app/src/main/java/com/${name.toLowerCase()}/MainActivity.java`, {
      after: 'import com.facebook.react.ReactActivity;',
      insert: `
      import com.facebook.react.ReactActivityDelegate;
      import com.facebook.react.ReactRootView;
      import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;`
    })

    ignite.patchInFile(`${process.cwd()}/android/app/src/main/java/com/${name.toLowerCase()}/MainActivity.java`, {
      after: `public class MainActivity extends ReactActivity {`,
      insert:
        '\n  @Override\n' +
        '  protected ReactActivityDelegate createReactActivityDelegate() {\n' +
        '    return new ReactActivityDelegate(this, getMainComponentName()) {\n' +
        '      @Override\n' +
        '      protected ReactRootView createRootView() {\n' +
        '       return new RNGestureHandlerEnabledRootView(MainActivity.this);\n' +
        '      }\n' +
        '    };\n' +
        '  }'
    })
    if (answers['vector-icons'] === 'react-native-vector-icons') {
      await system.spawn(`npx ignite-cli add vector-icons@1.1.1 ${debugFlag}`, {
        stdio: 'inherit'
      })
    }

    if (answers['i18n'] === 'react-native-i18n') {
      await system.spawn(`npx ignite-cli add i18n@1.2.0 ${debugFlag}`, { stdio: 'inherit' })
    }

    if (answers['animatable'] === 'react-native-animatable') {
      await system.spawn(`npx ignite-cli add animatable@1.0.2 ${debugFlag}`, {
        stdio: 'inherit'
      })
    }

    // dev-screens be installed after vector-icons and animatable so that it can
    // conditionally patch its PluginExamplesScreen
    if (answers['dev-screens'] === 'Yes') {
      await system.spawn(`npx ignite-cli add dev-screens@"2.4.5" ${debugFlag}`, {
        stdio: 'inherit'
      })
    }

    if (answers['redux-persist'] === 'Yes') {
      await system.spawn(`npx ignite-cli add redux-persist@1.1.2 ${debugFlag}`, {
        stdio: 'inherit'
      })
    }

    if (parameters.options.lint !== false) {
      await system.spawn(`npx ignite-cli add standard@1.0.0 ${debugFlag}`, {
        stdio: 'inherit'
      })
    }
  } catch (e) {
    ignite.log(e)
    throw e
  }

  // git configuration
  const gitExists = await filesystem.exists('./.git')
  if (!gitExists && !parameters.options['skip-git'] && system.which('git')) {
    // initial git
    const spinner = print.spin('configuring git')

    // TODO: Make husky hooks optional
    const huskyCmd = '' // `&& node node_modules/husky/bin/install .`
    await system.run(`git init . && git add . && git commit -m "Initial commit." ${huskyCmd}`)

    spinner.succeed(`configured git`)
  }

  const perfDuration = parseInt((new Date().getTime() - perfStart) / 10) / 100
  spinner.succeed(`ignited ${yellow(name)} in ${perfDuration}s`)

  const androidInfo = isAndroidInstalled(context)
    ? ''
    : `\n\nTo run in Android, make sure you've followed the latest react-native setup instructions at https://facebook.github.io/react-native/docs/getting-started.html before using ignite.\nYou won't be able to run ${bold(
        'react-native run-android'
      )} successfully until you have.`

  const successMessage = `
    ${red('Ignite CLI')} ignited ${yellow(name)} in ${gray(`${perfDuration}s`)}

    To get started:

      cd ${name}
      npx react-native run-ios
      npx react-native run-android${androidInfo}
      npx ignite-cli --help

    ${gray(
      'Read the walkthrough at https://github.com/infinitered/ignite-andross/blob/master/readme.md#boilerplate-walkthrough'
    )}

    ${blue('Need additional help? Join our Slack community at http://community.infinite.red.')}

    ${bold('Now get cooking! 🍽')}
  `

  print.info(successMessage)
}

module.exports = {
  install
}
