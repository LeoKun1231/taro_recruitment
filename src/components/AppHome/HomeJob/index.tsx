/*
 * @Author: hqk
 * @Date: 2023-04-21 22:20:46
 * @LastEditors: hqk
 * @LastEditTime: 2023-04-22 09:36:29
 * @Description:
 */
import { View } from '@tarojs/components'
import React, { memo, useEffect } from 'react'
import type { FC, ReactNode } from 'react'
import { useMemoizedFn, useSafeState } from 'ahooks'
import { IHomeJobList } from '@/types'
import { useAppDispatch } from '@/hooks'
import { getHomeJobListAction, getHotJobListAction } from '@/store'
import { useReachBottom } from '@tarojs/taro'
import { Divider } from '@antmjs/vantui'

import styled from './index.module.scss'
import JobCard from '../JobCard'

interface IProps {
  children?: ReactNode
  type?: string
  tab: 'company' | 'job'
}

const HomeJob: FC<IProps> = (props) => {
  const { type, tab } = props

  const [currentPage, setCurrentPage] = useSafeState(1)
  const [pageSize, setPageSize] = useSafeState(6)
  const [count, setCount] = useSafeState(0)
  const [dataList, setDataList] = useSafeState<IHomeJobList[]>([])

  const dispatch = useAppDispatch()

  const loadHotCompanyList = useMemoizedFn(async (current: number) => {
    const res = await dispatch(getHotJobListAction({ currentPage: current, pageSize })).unwrap()
    if (res.code == 200) {
      setDataList((c) => [...c, ...res.data.records])
      setCount(res.data.totalCount)
    }
    setCurrentPage(currentPage + 1)
  })

  const loadCategoryCompanyList = useMemoizedFn(async (current: number) => {
    const res = await dispatch(getHomeJobListAction({ currentPage: current, pageSize, type: type! })).unwrap()
    if (res.code == 200) {
      setDataList((c) => [...c, ...res.data.records])
      setCount(res.data.totalCount)
    }
    setCurrentPage(currentPage + 1)
  })

  useEffect(() => {
    setCount(0)
    setCurrentPage(1)
    setDataList([])
    if (type == '热门') {
      loadHotCompanyList(1)
    } else {
      loadCategoryCompanyList(1)
    }
  }, [type])

  useReachBottom(() => {
    if (dataList.length != count && tab == 'job') {
      if (type == '热门') {
        loadHotCompanyList(currentPage)
      }
    }
  })

  return (
    <View className={styled.homeJob}>
      {dataList.map((item) => {
        return <JobCard key={item.jobId} item={item} />
      })}
      {dataList.length == count && count != 0 && <Divider contentPosition="center">暂无更多数据</Divider>}
    </View>
  )
}

export default memo(HomeJob)
