// @cliDescription  Generates an opinionated container.

const patterns = require('../lib/patterns');

module.exports = async function (context) {
  // grab some features
  const { parameters, print, strings, ignite, filesystem } = context
  const { pascalCase, isBlank } = strings
  const { navigation, paths } = ignite.loadIgniteConfig()

  // validation
  if (isBlank(parameters.first)) {
    print.info(`${context.runtime.brand} generate screen <name>\n`)
    print.info('A name is required.')
    return
  }

  const name = pascalCase(parameters.first)
  const props = { name }
  const containerPath = `${paths.app}/${paths.container}`
  const containerStylesPath = `${containerPath}/Styles`

  const jobs = [
    {
      template: `screen.ejs`,
      target: `${containerPath}/${name}Screen.js`
    },
    {
      template: `screen-style.ejs`,
      target: `${containerStylesPath}/${name}ScreenStyle.js`
    }
  ]

  // make the templates
  await ignite.copyBatch(context, jobs, props)

  // if using `react-navigation` go the extra step
  // and insert the screen into the nav router
  if (navigation === 'react-navigation') {
    const screenName = `${name}Screen`
    const appNavFilePath = `${process.cwd()}/${paths.app}/Navigation/AppNavigation.js`
    const importToAdd = `import ${screenName} from '../${paths.containers}/${screenName}'`
    const routeToAdd = `  ${screenName}: { screen: ${screenName} },`

    if (!filesystem.exists(appNavFilePath)) {
      const msg = `No '${appNavFilePath}' file found.  Can't insert screen.`
      print.error(msg)
      process.exit(1)
    }

    // insert screen import
    ignite.patchInFile(appNavFilePath, {
      after: patterns[patterns.constants.PATTERN_IMPORTS],
      insert: importToAdd
    })

    // insert screen route
    ignite.patchInFile(appNavFilePath, {
      after: patterns[patterns.constants.PATTERN_ROUTES],
      insert: routeToAdd
    })
  } else {
    print.log('Screen created, manually add it to your navigation')
  }
}
