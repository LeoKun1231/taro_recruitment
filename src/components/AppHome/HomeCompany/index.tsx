/*
 * @Author: hqk
 * @Date: 2023-04-21 18:36:18
 * @LastEditors: hqk
 * @LastEditTime: 2023-04-22 17:15:05
 * @Description:
 */
import { useAppDispatch } from '@/hooks'
import { getHomeCompanyListAction, getHotCompanyListAction } from '@/store'
import { IHomeCompanyList } from '@/types'
import { View } from '@tarojs/components'
import { useLatest, useMemoizedFn, useSafeState } from 'ahooks'
import React, { memo, useEffect } from 'react'
import type { FC, ReactNode } from 'react'
import { PowerScrollView, Divider } from '@antmjs/vantui'
import { useDidHide, useReachBottom } from '@tarojs/taro'
import CompanyCard from '../CompanyCard'

import styled from './index.module.scss'

interface IProps {
  children?: ReactNode
  type?: string
  tab: 'company' | 'job'
}

const HomeCompany: FC<IProps> = (props) => {
  const { type, tab } = props

  const [currentPage, setCurrentPage] = useSafeState(1)

  const currentPageLastest = useLatest(currentPage)

  const [pageSize, setPageSize] = useSafeState(6)
  const [count, setCount] = useSafeState(0)
  const [dataList, setDataList] = useSafeState<IHomeCompanyList[]>([])

  const dispatch = useAppDispatch()

  const loadHotCompanyList = useMemoizedFn(async (current: number) => {
    const res = await dispatch(getHotCompanyListAction({ currentPage: current, pageSize })).unwrap()
    if (res.code == 200) {
      setDataList((c) => [...c, ...res.data.records])
      setCount(res.data.totalCount)
    }
    setCurrentPage(currentPageLastest.current + 1)
  })

  const loadCategoryCompanyList = useMemoizedFn(async (current: number) => {
    const res = await dispatch(getHomeCompanyListAction({ currentPage: current, pageSize, category: type! })).unwrap()
    if (res.code == 200) {
      setDataList((c) => [...c, ...res.data.records])
      setCount(res.data.totalCount)
    }
    setCurrentPage(currentPageLastest.current + 1)
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
    if (dataList.length != count && tab == 'company') {
      if (type == '热门') {
        loadHotCompanyList(currentPageLastest.current)
      } else {
        loadCategoryCompanyList(currentPageLastest.current)
      }
    }
  })

  return (
    <View className={styled.homeCompany}>
      {dataList.map((item) => {
        return <CompanyCard item={item} key={item.companyId} />
      })}
      {dataList.length == count && count != 0 && <Divider contentPosition="center">暂无更多数据</Divider>}
    </View>
  )
}

export default memo(HomeCompany)
