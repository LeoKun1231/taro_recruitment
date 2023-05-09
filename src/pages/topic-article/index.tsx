/*
 * @Author: hqk
 * @Date: 2023-04-25 21:27:49
 * @LastEditors: hqk
 * @LastEditTime: 2023-04-25 22:01:49
 * @Description:
 */
import AppArtilce from '@/components/AppCommunity/AppArtilce'
import AppTitle from '@/components/AppTitle'
import { useAppDispatch, useAppSelector, useAppShallowEqual } from '@/hooks'
import { getArtcleListAction, getTopicDetailAction } from '@/store'
import { IArticle, ITopicDetail } from '@/types'
import { Icon } from '@antmjs/vantui'
import { View } from '@tarojs/components'
import Taro, { useReachBottom, useRouter } from '@tarojs/taro'
import { useMemoizedFn, useSafeState } from 'ahooks'
import React, { memo, useEffect } from 'react'
import type { FC, ReactNode } from 'react'

import styled from './index.module.scss'

interface IProps {
  children?: ReactNode
}

const TopicArticle: FC<IProps> = () => {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useSafeState(1)
  const [pageSize, setPageSize] = useSafeState(4)
  const [count, setCount] = useSafeState(0)
  const [data, setData] = useSafeState<IArticle[]>([])
  const [detail, setDetail] = useSafeState<ITopicDetail>()

  const [topicId, setTopicId] = useSafeState(() => {
    return parseInt(router.params.id!)
  })

  const { id } = useAppSelector((state) => {
    return {
      id: state.login.loginUser.id
    }
  }, useAppShallowEqual)

  const dispatch = useAppDispatch()

  const loadData = useMemoizedFn((current: number) => {
    dispatch(getArtcleListAction({ userId: id, currentPage: current, pageSize, topicId, typedId: 0 }))
      .unwrap()
      .then((res) => {
        if (res.code == 200) {
          setData((c) => [...c, ...res.data.records])
          setCount(res.data.totalCount)
        }
      })
  })

  useEffect(() => {
    if (topicId) {
      loadData(1)
      dispatch(getTopicDetailAction(topicId))
        .unwrap()
        .then((res) => {
          if (res.code == 200) {
            setDetail(res.data)
          }
        })
    }
  }, [topicId])

  useReachBottom(() => {
    if (count != data.length) {
      loadData(currentPage + 1)
      setCurrentPage(currentPage + 1)
    }
  })

  return (
    <View className="overflow-hidden bg-#f8f8f8 h-100vh">
      <AppTitle title="话题相关文章" />
      <View className={Taro.getEnv() == Taro.ENV_TYPE.WEB ? styled.content : ''}>
        <View className="mx-16px my-10px px-16px py-10px bg-white rounded-[12px]">
          <View className="flex">
            <View className="mr-8px  text-18px">话题 :</View>
            <View className="w-[250px] truncate text-#333 text-18px font-700">{detail?.name}</View>
          </View>
          <View className="flex items-center text-16px py-10px">
            <View className="mr-2px text-#999">阅读量</View>
            <Icon name="eye-o" size={20} className="text-#999" />
            <View className="mx-4px text-#999">:</View>
            <View className="mr-20px text-#666">{detail?.watchCount}</View>
            <View className="mr-2px text-#999">引用量</View>
            <Icon name="miniprogram-o" size={20} className="text-#999" />
            <View className="mx-4px text-#999">:</View>
            <View className="text-#666">{detail?.relationCount}</View>
          </View>
        </View>
        <View className="mx-16px my-20px">
          {data.map((article) => {
            return <AppArtilce key={article.id} item={article} />
          })}
        </View>
      </View>
    </View>
  )
}

export default memo(TopicArticle)
