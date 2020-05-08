import { Text, TextInput } from 'react-native'
import AppConfig from './AppConfig'

const applyFontProps = (TextComp, maxFontSizeMultiplier = 2) => {
  if (!TextComp.defaultProps) {
    TextComp.defaultProps = {}
  }
  TextComp.defaultProps.allowFontScaling = AppConfig.allowTextFontScaling
  // TextComp.defaultProps.maxFontSizeMultiplier = maxFontSizeMultiplier // unncommnet to apply max font size scaling
}

applyFontProps(Text)
applyFontProps(TextInput, 1.5)
