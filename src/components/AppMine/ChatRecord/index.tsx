import JobCard from '@/components/AppHome/JobCard'
import AppTitle from '@/components/AppTitle'
import { useAppDispatch } from '@/hooks'
import { getChattingJobListAction } from '@/store/modules/info'
import { IDetailJobList } from '@/types'
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

const ChatRecord: FC<IProps> = (props) => {
  const { onClose } = props
  const [currentPage, setCurrentPage] = useSafeState(1)
  const [pageSize, setPageSize] = useSafeState(1000)
  const [totalCount, setTotalCount] = useSafeState(0)
  const dispatch = useAppDispatch()
  const [data, setData] = useSafeState<IDetailJobList[]>([])

  const loadData = useMemoizedFn(async (current: number) => {
    dispatch(getChattingJobListAction({ pageSize, currentPage: current }))
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
    <View className="w-100vw h-100vh">
      <AppTitle noLink onClose={onClose} title="沟通列表" />
      <View className={styled.content}>
        {data.map((item) => {
          return <JobCard key={item.jobId} item={item} />
        })}
        {data.length == 0 && <Empty description="暂无数据" />}
      </View>
    </View>
  )
}

export default memo(ChatRecord)
