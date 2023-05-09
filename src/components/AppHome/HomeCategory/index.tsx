import { View } from '@tarojs/components'
import React, { memo, useEffect, useState } from 'react'
import type { FC, ReactNode } from 'react'
import classNames from 'classnames'
import { Button, TreeSelect } from '@antmjs/vantui'
import { useMemoizedFn, useSafeState } from 'ahooks'
import { useAppDispatch } from '@/hooks'
import { getCompanyCategoryAction, getPhoneJobTypeListAction } from '@/store'

import styled from './index.module.scss'

interface IProps {
  children?: ReactNode
  onClose: () => void
  type: 'company' | 'job'
  onConfirm: (type: string) => void
}

const HomeCategory: FC<IProps> = (props) => {
  const { type, onClose, onConfirm } = props

  const [active, setActive] = useSafeState(0)
  const [activeId, setActiveId] = useSafeState('')

  const [items, setItems] = useSafeState<any[]>([])

  const dispatch = useAppDispatch()

  useEffect(() => {
    if (type == 'company') {
      dispatch(getCompanyCategoryAction())
        .unwrap()
        .then((res) => {
          if (res.code == 200) {
            const category = res.data.map((item) => ({ text: item, id: item }))
            const list = [
              {
                text: '按排序',
                children: [{ text: '热门', id: '热门' }]
              },
              {
                text: '按类别',
                children: category
              }
            ]
            setActiveId('热门')
            setItems(list)
          }
        })
    } else if (type == 'job') {
      // dispatch(g)
      dispatch(getPhoneJobTypeListAction())
        .unwrap()
        .then((res) => {
          if (res.code == 200) {
            const list = [
              {
                text: '按排序',
                children: [{ text: '热门', id: '热门' }]
              },
              ...res.data
            ]
            setActiveId('热门')
            setItems(list)
          }
        })
    }
  }, [])

  const onClickNav = useMemoizedFn((e) => {
    setActive(e.detail.index)
  })
  const onClickItem = useMemoizedFn((e) => {
    setActiveId(e.detail.id)
  })

  const handleConfirm = useMemoizedFn(() => {
    onConfirm && onConfirm(activeId)
  })

  const handleReset = useMemoizedFn(() => {
    setActive(0)
    setActiveId('热门')
  })

  return (
    <View className={classNames({ 'h-100vh overflow-y-auto': true, [styled.homeCategory]: true })}>
      <TreeSelect items={items} mainActiveIndex={active} activeId={activeId} onClickNav={onClickNav} onClickItem={onClickItem} />
      <View className="h-[calc(8vh-1px)] center border-t-1px border-t-solid border-t-#eee fixed left-0 right-0 bottom-0 bg-white">
        <Button type="primary" icon="replay" className="w-34vw" onClick={handleReset}>
          重 置
        </Button>
        <Button type="info" className="w-34vw" onClick={handleConfirm}>
          确 定
        </Button>
      </View>
    </View>
  )
}

export default memo(HomeCategory)
