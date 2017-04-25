// @cliDescription  Generates a action/creator/reducer set for Redux.

module.exports = async function (context) {
  // grab some features
  const { parameters, ignite, strings, print } = context
  const { isBlank, pascalCase } = strings
  const { tests, paths } = ignite.loadIgniteConfig()

  // validation
  if (isBlank(parameters.first)) {
    print.info(`${context.runtime.brand} generate redux <name>\n`)
    print.info('A name is required.')
    return
  }

  const name = pascalCase(parameters.first)
  const props = { name }

  const jobs = [{ template: `redux.ejs`, target: `${paths.app}/${paths.redux || 'Redux'}/${name}Redux.js` }]
  if (tests) {
    jobs.push({
      template: `redux-test-${tests}.ejs`,
      target: `${paths.app}/${paths.redux || 'Redux'}/${name}ReduxTest.js`
    })
  }

  await ignite.copyBatch(context, jobs, props)
}
