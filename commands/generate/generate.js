module.exports = {
  name: 'generate',
  alias: ['g'],
  run: async toolbox => {
    toolbox.print.printHelp(toolbox)
  }
}
