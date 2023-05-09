import AppArtilce from '@/components/AppCommunity/AppArtilce'
import AppTitle from '@/components/AppTitle'
import { useAppDispatch } from '@/hooks'
import { getChattingJobListAction, getMineArtilceByIdAction } from '@/store/modules/info'
import { Empty } from '@antmjs/vantui'
import { View } from '@tarojs/components'
import Taro, { useReachBottom } from '@tarojs/taro'
import { useMemoizedFn, useSafeState } from 'ahooks'
import React, { memo, useEffect } from 'react'
import type { FC, ReactNode } from 'react'

import styled from './index.module.scss'

interface IProps {
  children?: ReactNode
  onClose: () => void
}

const PublishArticle: FC<IProps> = (props) => {
  const { onClose } = props
  const [currentPage, setCurrentPage] = useSafeState(1)
  const [pageSize, setPageSize] = useSafeState(1000)
  const [totalCount, setTotalCount] = useSafeState(0)
  const dispatch = useAppDispatch()
  const [data, setData] = useSafeState<any[]>([])

  const loadData = useMemoizedFn(async (current: number) => {
    dispatch(getMineArtilceByIdAction({ pageSize, currentPage: current }))
      .unwrap()
      .then((res) => {
        setData([...data, ...res.data.records])
        setTotalCount(res.data.totalCount)
      })
  })

  useEffect(() => {
    loadData(1)
  }, [])

  return (
    <View className="w-100vw h-100vh overflow-hidden">
      <AppTitle noLink onClose={onClose} title="我发表的文章" />
      <View className={styled.content}>
        <View className="my-20px">
          {data.map((item) => {
            return <AppArtilce key={item.id} item={item} />
          })}
          {data.length == 0 && <Empty description="暂无数据" />}
        </View>
      </View>
    </View>
  )
}

export default memo(PublishArticle)
