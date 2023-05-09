/*
 * @Author: hqk
 * @Date: 2023-04-17 20:18:59
 * @LastEditors: hqk
 * @LastEditTime: 2023-05-08 23:47:22
 * @Description:
 */
import React, { ElementRef, memo, useEffect, useRef } from 'react'
import type { FC, ReactNode } from 'react'
import { ScrollView, View } from '@tarojs/components'
import { Divider, Icon, Popup, Search, Sticky, Tab, Tabs } from '@antmjs/vantui'
import { useCreation, useDebounceFn, useMemoizedFn, useSafeState, useScroll } from 'ahooks'
import Taro, { useDidShow, useReachBottom, useReady } from '@tarojs/taro'
import { useAppDispatch, useAppSelector, useAppShallowEqual } from '@/hooks'
import { clearHomeAction, getArtcleListAction } from '@/store'
import { IArticle } from '@/types'
import AppArtilce from '@/components/AppCommunity/AppArtilce'
import { changeSelectedAction } from '@/store/modules/tabbar'

import styled from './index.module.scss'

interface IProps {
  children?: ReactNode
}

const types = ['全部', '最热', '最新', '最多评论', '最多点赞']
const Community: FC<IProps> = () => {
  const [type, setType] = useSafeState(0)
  const [currentPage, setCurrentPage] = useSafeState(1)
  const [pageSize, setPageSize] = useSafeState(6)
  const [count, setCount] = useSafeState(0)
  const [data, setData] = useSafeState<IArticle[]>([])

  const { id } = useAppSelector((state) => {
    return {
      id: state.login.loginUser.id
    }
  }, useAppShallowEqual)

  const handleGoToSearch = useMemoizedFn(() => {
    Taro.navigateTo({
      url: '/pages/search/index?type=' + '2'
    })
  })

  const dispatch = useAppDispatch()

  const loadData = useMemoizedFn(async (current: number, isPageChange: boolean, typedId: number) => {
    const res = await dispatch(getArtcleListAction({ typedId, currentPage: current, pageSize, userId: id })).unwrap()
    if (res.code == 200) {
      if (isPageChange) {
        setData(res.data.records)
        setCount(res.data.totalCount)
      } else {
        setData((c) => [...c, ...res.data.records])
      }
      setCount(res.data.totalCount)
    }
  })
  useDidShow(() => {
    setData([])
    setCurrentPage(1)
    setCount(0)
    loadData(1, true, type)
  })

  const handleTabChange = useMemoizedFn((e) => {
    setCurrentPage(1)
    setCount(0)
    setData([])
    loadData(1, true, e.detail.index)
    setType(e.detail.index)
  })

  const handlePublish = useMemoizedFn(() => {
    Taro.navigateTo({
      url: '/pages/publish-article/index'
    })
  })

  useDidShow(() => {
    dispatch(changeSelectedAction(1))
  })

  const { run: handleScrollToBottom } = useDebounceFn(
    () => {
      if (count != data.length) {
        loadData(currentPage + 1, false, type)
        setCurrentPage(currentPage + 1)
      }
    },
    {
      wait: 500
    }
  )

  return (
    <View className={styled.community}>
      <Search
        shape="round"
        readonly
        onClickInput={handleGoToSearch}
        placeholder="请输入文章名"
        className="border"
        renderAction={
          <View className="w-[60px] center" onClick={handlePublish}>
            <Icon name="plus" size={16} className="mr-4px active:bg-#eee" /> 发布
          </View>
        }
      />
      <Tabs color="#007aff" onChange={handleTabChange}>
        {types.map((item, index) => {
          return (
            <Tab title={item} key={item}>
              <ScrollView scrollY scrollWithAnimation lowerThreshold={100} onScrollToLower={handleScrollToBottom} className="h-100%">
                {data.map((article) => {
                  return <AppArtilce key={article.id} item={article} />
                })}
                {data.length == count && count != 0 && (
                  <Divider contentPosition="center" className="!pb-30px">
                    暂无更多数据
                  </Divider>
                )}
              </ScrollView>
            </Tab>
          )
        })}
      </Tabs>
    </View>
  )
}

export default memo(Community)
