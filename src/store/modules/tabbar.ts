import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface IState {
  selected: number
}

const initialState = {
  selected: 0
} as IState

const tabBarSlice = createSlice({
  name: 'tabbar',
  initialState,
  reducers: {
    changeSelectedAction(state, { payload }: PayloadAction<number>) {
      state.selected = payload
    },
    clearTabBarAction(state) {
      state.selected = 0
    }
  }
})

export default tabBarSlice.reducer
export const { changeSelectedAction, clearTabBarAction } = tabBarSlice.actions
