const patterns = require('../../lib/patterns')

module.exports = {
  description: 'Generates an opinionated container.',
  run: async function(toolbox) {
    // grab some features
    const { parameters, print, strings, ignite, filesystem } = toolbox
    const { pascalCase, isBlank } = strings
    const config = ignite.loadIgniteConfig()

    // validation
    if (isBlank(parameters.first)) {
      print.info(`${toolbox.runtime.brand} generate screen <name>\n`)
      print.info('A name is required.')
      return
    }

    const name = pascalCase(parameters.first)
    const screenName = name.endsWith('Screen') ? name : `${name}Screen`
    const props = { name: screenName }

    const jobs = [
      {
        template: `screen.ejs`,
        target: `App/Containers/${screenName}.js`
      },
      {
        template: `screen-style.ejs`,
        target: `App/Containers/Styles/${screenName}Style.js`
      }
    ]

    // make the templates
    await ignite.copyBatch(toolbox, jobs, props)
    print.info(`Screen ${screenName} created, manually add it to your navigation`)
  }
}
