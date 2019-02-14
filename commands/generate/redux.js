module.exports = {
  description: ' Generates a action/creator/reducer set for Redux.',
  run: async function(toolbox) {
    // grab some features
    const { parameters, ignite, strings, print } = toolbox
    const { isBlank, pascalCase } = strings
    const config = ignite.loadIgniteConfig()

    // validation
    if (isBlank(parameters.first)) {
      print.info(`${toolbox.runtime.brand} generate redux <name>\n`)
      print.info('A name is required.')
      return
    }

    const name = pascalCase(parameters.first)
    const props = { name }

    const jobs = [{ template: `redux.ejs`, target: `App/Redux/${name}Redux.js` }]
    if (config.tests) {
      jobs.push({
        template: `redux-test-${config.tests}.ejs`,
        target: `Tests/Redux/${name}ReduxTest.js`
      })
    }

    await ignite.copyBatch(toolbox, jobs, props)
  }
}
