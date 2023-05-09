/*
 * @Author: hqk
 * @Date: 2023-04-17 17:21:10
 * @LastEditors: hqk
 * @LastEditTime: 2023-04-18 17:53:20
 * @Description:
 */
import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from '@/utils/cache'

import common from './modules/common'
import community from './modules/community'
import info from './modules/info'
import login from './modules/login'
import home from './modules/home'
import chat from './modules/chat'
import tabbar from './modules/tabbar'

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['login', 'tabbar']
}

const myReducers = combineReducers({
  common,
  info,
  login,
  community,
  home,
  chat,
  tabbar
})
type reducers = ReturnType<typeof myReducers>

const myPersistReducer = persistReducer<reducers>(persistConfig, myReducers)
const store = configureStore({
  reducer: myPersistReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const peristor = persistStore(store)
export default store

export * from './modules/common'
export * from './modules/community'
export * from './modules/home'
export * from './modules/login'
export * from './modules/chat'
