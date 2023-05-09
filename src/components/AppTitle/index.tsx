import React, { memo } from 'react'
import type { FC, ReactNode } from 'react'
import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { NavBar } from '@antmjs/vantui'
import { useMemoizedFn } from 'ahooks'
import styled from './index.module.scss'

interface IProps {
  children?: ReactNode
  title?: string
  renderRight?: ReactNode
  noLink?: boolean
  onClose?: () => void
}

const AppTitle: FC<IProps> = (props) => {
  const { title, renderRight, noLink, onClose } = props

  const handleBack = useMemoizedFn(() => {
    {
      !noLink &&
        Taro.navigateBack({
          delta: 1
        })
    }
    onClose && onClose()
  })

  return (
    <View className={styled.appTitle}>
      {(Taro.getEnv() == Taro.ENV_TYPE.WEB || noLink) && (
        <NavBar className="!pt-0 " title={title} leftText="返回" leftArrow onClickLeft={handleBack} renderRight={renderRight} />
      )}
    </View>
  )
}

export default memo(AppTitle)
