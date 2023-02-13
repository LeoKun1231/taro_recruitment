/*
 * @Author: hqk
 * @Date: 2023-02-11 16:40:05
 * @LastEditors: hqk
 * @LastEditTime: 2023-02-12 11:58:31
 * @Description:
 */
import React, { memo, useEffect } from 'react'
import type { FC, ReactNode } from 'react'
import { Button, View } from '@tarojs/components'
import Taro, { eventCenter, useRouter } from '@tarojs/taro'
import appRequest from '@/services'
import { useAppSelector } from '@/hooks/useAppStore'

interface IProps {
  children?: ReactNode
}

const Home: FC<IProps> = () => {
  const router = useRouter()
  useEffect(() => {
    console.log(router.params)
    appRequest
      .get({
        url: '/home/multidata',
      })
      .then((res) => {
        console.log(res)
      })
  }, [])

  const { count } = useAppSelector((state) => {
    return {
      count: state.counter.count,
    }
  })

  function onBack() {
    Taro.navigateBack({
      success: () => {
        eventCenter.trigger('back', '我是返回得参数')
      },
    })
  }

  return (
    <View>
      <Button onClick={onBack}>跳转回index{count}</Button>
      Home
    </View>
  )
}

export default memo(Home)
