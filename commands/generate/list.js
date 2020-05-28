module.exports = {
  alias: ['ls', 'listview'],
  description: 'Generates a screen with a Flatlist/SectionList + walkthrough.',
  run: async function(toolbox) {
    const patterns = require('../../lib/patterns')
    // grab some features
    const { print, parameters, strings, ignite, filesystem } = toolbox
    const { pascalCase, isBlank } = strings
    const config = ignite.loadIgniteConfig()

    // validation
    if (isBlank(parameters.first)) {
      print.info(`${toolbox.runtime.brand} generate list <name>\n`)
      print.info('A name is required.')
      return
    }

    const name = pascalCase(parameters.first)
    const props = { name }

    // which type of layout?
    const typeMessage = 'What kind of List would you like to generate?'
    const typeChoices = ['Row', 'Grid']

    // Sections or no?
    const typeDataMessage = 'How will your data be presented on this list?'
    const typeDataChoices = ['Single', 'Sectioned']

    // Check for parameters to bypass questions
    let typeCode = 'flatlist'
    let type = parameters.options.type
    let dataType = parameters.options.dataType

    if (!type) {
      // ask question 2
      const answers = await toolbox.prompt.ask({
        name: 'type',
        type: 'list',
        message: typeMessage,
        choices: typeChoices
      })

      type = answers.type[0] === typeDataChoices[0] ? 'row' : 'grid'

    }

    if (!dataType) {
      // ask question 3
      const dataAnswers = await toolbox.prompt.ask({
        name: 'type',
        type: 'list',
        message: typeDataMessage,
        choices: typeDataChoices
      })
      dataType = dataAnswers.type[0] === typeDataChoices[0] ? 'single' : 'sectioned'
    }

    // Sorry the following is so confusing, but so are React Native lists
    // There are 3 options and therefore 8 possible combinations
    let componentTemplate =
      dataType.toLowerCase() === 'sectioned' ? typeCode + '-sections' : typeCode
    let styleTemplate = ''
    if (type.toLowerCase() === 'grid' && dataType.toLowerCase() === 'sectioned') {
      // grid + section means we need wrap
      styleTemplate = 'listview-grid-style'
    } else if (type.toLowerCase() === 'grid') {
      componentTemplate = componentTemplate + '-grid'
      // grid + single = no wrap, use columns
      styleTemplate = 'flatlist-grid-style'
    } else {
      // no grids, flatlist basic
      styleTemplate = 'listview-style'
    }

    const jobs = [
      {
        template: `${componentTemplate}.ejs`,
        target: `App/Containers/${name}.js`
      },
      {
        template: `${styleTemplate}.ejs`,
        target: `App/Containers/Styles/${name}Style.js`
      }
    ]

    await ignite.copyBatch(toolbox, jobs, props)
    print.info('List screen created, manually add it to your navigation')
  }
}
