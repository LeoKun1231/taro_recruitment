import { configureStore } from '@reduxjs/toolkit'
import counter from './modules/counter'

const store = configureStore({
  reducer: {
    counter,
  },
})

export default store


// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
