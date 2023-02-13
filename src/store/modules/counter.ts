import { createSlice } from '@reduxjs/toolkit'

const counterSlice = createSlice({
  name: 'couter',
  initialState: {
    count: 0,
  },
  reducers: {
    incrementCount(state, { payload }) {
      state.count += payload
    },
  },
})

export default counterSlice.reducer
export const { incrementCount } = counterSlice.actions
