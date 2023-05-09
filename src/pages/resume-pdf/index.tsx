/*
 * @Author: hqk
 * @Date: 2023-04-20 10:46:24
 * @LastEditors: hqk
 * @LastEditTime: 2023-05-09 11:39:21
 * @Description:
 */
import { View } from '@tarojs/components'
import React, { memo, useEffect, useState } from 'react'
import type { FC, ReactNode } from 'react'
import AppTitle from '@/components/AppTitle'
import { useAppSelector, useAppShallowEqual } from '@/hooks'
import Taro from '@tarojs/taro'

import './index.scss'

interface IProps {
  children?: ReactNode
  file: string
}

interface IProps {
  children?: ReactNode
}

const ResumePdf: FC<IProps> = () => {
  const { resumeURL } = useAppSelector((state) => {
    return {
      resumeURL: state.info.resumeURL
    }
  }, useAppShallowEqual)

  useEffect(() => {
    if (resumeURL != '') {
      if (process.env.TARO_ENV === 'h5') {
        // 因为小程序引入报错，所以按需加载 npm i pdfh5
        let Pdfh5 = require('pdfh5')
        //实例化
        new Pdfh5('#Pdf', {
          pdfurl: resumeURL
        })
      }
    }
  }, [resumeURL])

  return (
    <View className="h-100vh overflow-hidden pdf">
      <AppTitle title="简历" />
    </View>
  )
}

export default memo(ResumePdf)
