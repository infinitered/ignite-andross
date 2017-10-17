import { createActions } from 'reduxsauce'
import { REHYDRATE } from 'redux-persist/constants'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  startup: null
})

export const StartupTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  rehydrated: false
})

/* ------------- Reducers ------------- */

export const rehydrating = (state, { type }) => 
  state.merge({rehydrated: type === REHYDRATE})
  
  /* ------------- Hookup Reducers To Types ------------- */
  
  export const reducer = createReducer(INITIAL_STATE, {
    [REHYDRATE]: rehydrating
  })