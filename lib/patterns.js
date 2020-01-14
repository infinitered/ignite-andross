const constants = {
  PATTERN_IMPORTS: 'imports',
  PATTERN_ROUTES: 'routes'
}
//  [constants.PATTERN_IMPORTS]: `import[\\s\\S]*from\\s+'react-navigation';?`,

module.exports = {
  constants,

  [constants.PATTERN_IMPORTS]: `import { createAppContainer } from 'react-navigation'`,
  [constants.PATTERN_ROUTES]: 'const PrimaryNav'
}
