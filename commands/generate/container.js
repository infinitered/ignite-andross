const patterns = require('../../lib/patterns')

module.exports = {
  description: 'Generates a redux smart component.',
  run: async function(toolbox) {
    // grab some features
    const { parameters, strings, print, ignite, filesystem } = toolbox
    const { pascalCase, isBlank } = strings
    const config = ignite.loadIgniteConfig()

    // validation
    if (isBlank(parameters.first)) {
      print.info(`${toolbox.runtime.brand} generate container <name>\n`)
      print.info('A name is required.')
      return
    }

    const name = pascalCase(parameters.first)
    const props = { name }

    const jobs = [
      {
        template: 'container.ejs',
        target: `App/Containers/${name}.js`
      },
      {
        template: 'container-style.ejs',
        target: `App/Containers/Styles/${name}Style.js`
      }
    ]

    await ignite.copyBatch(toolbox, jobs, props)

    // if using `react-navigation` go the extra step
    // and insert the container into the nav router
    if (config.navigation === 'react-navigation') {
      const containerName = name
      const appNavFilePath = `${process.cwd()}/App/Navigation/AppNavigation.js`
      const importToAdd = `import ${containerName} from '../Containers/${containerName}'`
      const routeToAdd = `  ${containerName}: { screen: ${containerName} },`

      if (!filesystem.exists(appNavFilePath)) {
        const msg = `No '${appNavFilePath}' file found.  Can't insert container.`
        print.error(msg)
        process.exit(1)
      }

      // insert container import
      ignite.patchInFile(appNavFilePath, {
        after: patterns[patterns.constants.PATTERN_IMPORTS],
        insert: importToAdd
      })

      // insert container route
      ignite.patchInFile(appNavFilePath, {
        after: patterns[patterns.constants.PATTERN_ROUTES],
        insert: routeToAdd
      })
    } else {
      print.info('Container created, manually add it to your navigation')
    }
  }
}
