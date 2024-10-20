import { NativeModules } from 'react-native'
import { FitbitProvider, useFitbit } from './Fitbit';
import * as fitbitProps from './types'
import { useFitbitVitals } from './useFitbitVitals';

export {
  FitbitProvider,
  fitbitProps,
  useFitbit,
  useFitbitVitals
}

export default NativeModules.ReactNativeFitbitWebviewModule
