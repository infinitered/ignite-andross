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
    print.info('Container created, manually add it to your navigation')
  }
}
