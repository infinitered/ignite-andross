// @cliDescription  Generates a component, styles, and an optional test.

module.exports = async function (context) {
  // grab some features
  const { parameters, strings, print, ignite } = context
  const { pascalCase, isBlank } = strings
  const config = ignite.loadIgniteConfig()
  const { paths, tests } = config

  // validation
  if (isBlank(parameters.first)) {
    print.info(`${context.runtime.brand} generate component <name>\n`)
    print.info('A name is required.')
    return
  }

  // read some configuration
  const name = pascalCase(parameters.first)
  const props = { name }
  const componentPath = `${paths.app}/${paths.components}`
  console.dir(paths, {colors: true})
  const componentStylesPath = `${componentPath}/Styles`
  const testsPath = `${paths.tests}/${paths.components}`

  const jobs = [
    {
      template: 'component.ejs',
      target: `${componentPath}/${name}.js`
    },
    {
      template: 'component-style.ejs',
      target: `${componentStylesPath}/${name}Style.js`
    },
    tests === 'ava' &&
      {
        template: 'component-test.ejs',
        target: `${testsPath}/${name}Test.js`
      }
  ]

  await ignite.copyBatch(context, jobs, props)
}
