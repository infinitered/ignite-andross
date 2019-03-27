/**
 * The questions to ask during the install process.
 */
const questions = [
  {
    name: 'dev-screens',
    message: 'Would you like Ignite Development Screens?',
    type: 'list',
    choices: ['No', 'Yes']
  },
  {
    name: 'vector-icons',
    message: 'What vector icon library will you use?',
    type: 'list',
    choices: ['none', 'react-native-vector-icons']
  },
  {
    name: 'languages',
    message: 'What internationalization library will you use?',
    type: 'list',
    choices: ['none', 'react-native-languages']
  },
  {
    name: 'animatable',
    message: 'What animation library will you use?',
    type: 'list',
    choices: ['none', 'react-native-animatable']
  },
  {
    name: 'redux-persist',
    message: 'Would you like to include redux-persist?',
    type: 'list',
    choices: ['No', 'Yes']
  }
]

/**
 * The max preset.
 */
const max = {
  'dev-screens': 'Yes',
  'vector-icons': 'react-native-vector-icons',
  languages: 'react-native-languages',
  animatable: 'react-native-animatable',
  'redux-persist': 'Yes'
}

/**
 * The min preset.
 */
const min = {
  'dev-screens': 'No',
  'vector-icons': 'none',
  languages: 'none',
  animatable: 'none',
  'redux-persist': 'No'
}

module.exports = {
  questions,
  answers: { min, max }
}
