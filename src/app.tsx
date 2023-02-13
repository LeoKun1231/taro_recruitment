/*
 * @Author: hqk
 * @Date: 2023-02-13 11:06:53
 * @LastEditors: hqk
 * @LastEditTime: 2023-02-13 12:24:47
 * @Description:
 */
import React, { memo } from 'react'
import type { FC, ReactNode } from 'react'
import { Provider } from 'react-redux'
import 'uno.css'
import store from './store'

interface IProps {
  children?: ReactNode
}

const App: FC<IProps> = (props) => {
  return <Provider store={store}>{props.children}</Provider>
}

export default memo(App)
