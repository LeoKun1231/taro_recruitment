import Taro from '@tarojs/taro'
import { CoverView, CoverImage } from '@tarojs/components'
import React, { memo } from 'react'
import type { FC, ReactNode } from 'react'
import { useMemoizedFn, useSafeState } from 'ahooks'
import { useAppDispatch, useAppSelector, useAppShallowEqual } from '@/hooks'
import { changeSelectedAction } from '@/store/modules/tabbar'

import './index.scss'

interface IProps {
  children?: ReactNode
}

const CustomBarTbr: FC<IProps> = () => {
  const [color, setColor] = useSafeState('#646566')
  const [selectedColor, setSelectedColor] = useSafeState('#007aff')
  const [backgroundColor, setBackgroundColor] = useSafeState('#ffffff')

  const dispatch = useAppDispatch()

  const { selected } = useAppSelector((state) => {
    return {
      selected: state.tabbar.selected
    }
  }, useAppShallowEqual)

  const [list, setList] = useSafeState([
    {
      pagePath: '/pages/home/index',
      selectedIconPath: '../assets/img/home_active.png',
      iconPath: '../assets/img/home.png',
      text: '首页1'
    },
    {
      pagePath: '/pages/community/index',
      selectedIconPath: '../assets/img/community_active.png',
      iconPath: '../assets/img/community.png',
      text: '社区1'
    },
    {
      pagePath: '/pages/chat/index',
      selectedIconPath: '../assets/img/chat_active.png',
      iconPath: '../assets/img/chat.png',
      text: '聊天1'
    },
    {
      pagePath: '/pages/mine/index',
      selectedIconPath: '../assets/img/mine_active.png',
      iconPath: '../assets/img/mine.png',
      text: '我的1'
    }
  ])

  const handleClick = useMemoizedFn((url: string, index: number) => {
    Taro.switchTab({ url })
    dispatch(changeSelectedAction(index))
  })

  return (
    <CoverView className="tab-bar">
      <CoverView className="tab-bar-border"></CoverView>
      {list.map((item, index) => {
        return (
          <CoverView key={index} className="tab-bar-item" onClick={() => handleClick(item.pagePath, index)}>
            <CoverImage src={selected === index ? item.selectedIconPath : item.iconPath} />
            <CoverView className="mt-2px" style={{ color: selected === index ? selectedColor : color }}>
              {item.text}
            </CoverView>
          </CoverView>
        )
      })}
    </CoverView>
  )
}

export default memo(CustomBarTbr)
