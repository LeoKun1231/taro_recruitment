/*
 * @Author: hqk
 * @Date: 2023-02-12 18:37:16
 * @LastEditors: hqk
 * @LastEditTime: 2023-02-13 11:55:33
 * @Description:
 */
import React, { memo, useEffect } from 'react'
import { View } from '@tarojs/components'
import type { FC, ReactNode } from 'react'
import Taro, { eventCenter } from '@tarojs/taro'

import { useAppDispatch } from '@/hooks/useAppStore'
import { incrementCount } from '@/store/modules/counter'
import { Button } from '@nutui/nutui-react-taro'
import './index.scss'

interface IProps {
  children?: ReactNode
}

const Demo: FC<IProps> = () => {
  function goToHomePage() {
    Taro.navigateTo({
      url: '/pages/home/index?name=123&age=18',
    })
  }

  useEffect(() => {
    function handleBack(data) {
      console.log(data)
    }

    eventCenter.on('back', handleBack)
    return () => {
      console.log('我被卸载了')
      eventCenter.off('back', handleBack)
    }
  })

  const dispatch = useAppDispatch()

  function onCounterIncrement() {
    dispatch(incrementCount(6))
  }

  return (
    <View>
      <View className="flex">
        <View className="text-8">1</View>
        <View className="test">2</View>
        <View>3</View>
        <View></View>
        <View onClick={onCounterIncrement}>+6</View>
      </View>
      <Button type="primary" onClick={goToHomePage}>
        去首页
      </Button>
    </View>
  )
}

export default memo(Demo)
