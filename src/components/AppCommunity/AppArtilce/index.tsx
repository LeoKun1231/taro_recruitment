/*
 * @Author: hqk
 * @Date: 2023-04-23 21:22:56
 * @LastEditors: hqk
 * @LastEditTime: 2023-04-24 10:14:51
 * @Description:
 */
import { IArticle } from '@/types'
import { timeago } from '@/utils/date'
import { View } from '@tarojs/components'
import React, { MouseEvent, memo, useEffect } from 'react'
import type { FC, ReactNode } from 'react'
import classNames from 'classnames'
import { Icon, Image, Tag } from '@antmjs/vantui'
import { useMemoizedFn, useSafeState } from 'ahooks'
import { useAppDispatch, useAppSelector, useAppShallowEqual } from '@/hooks'
import useLike from '@/hooks/useLike'
import { formatNumber2KW } from '@/utils'
import Taro from '@tarojs/taro'
import styled from './index.module.scss'

interface IProps {
  children?: ReactNode
  item: IArticle
}

const AppArticle: FC<IProps> = (props) => {
  const { item } = props

  const { id } = useAppSelector((state) => {
    return {
      id: state.login.loginUser?.id
    }
  }, useAppShallowEqual)

  const { handleLike, isLike, likeCount } = useLike(item, true, id)

  const handleGoToArticleDetail = useMemoizedFn(() => {
    Taro.navigateTo({
      url: '/pages/article-detail/index?id=' + item.id
    })
  })

  const handleGoToTopicArticle = useMemoizedFn((e) => {
    e.stopPropagation()
    Taro.navigateTo({
      url: '/pages/topic-article/index?id=' + item.topicId
    })
  })

  return (
    <View className={classNames({ 'bg-white px-10px py-14px border': true, [styled.article]: true })} onClick={handleGoToArticleDetail}>
      <View className="between">
        <View className="text-18px font-600 truncate w-[74%]">{item.title}</View>
        <View className="text-[#999]">{timeago(item.createTime)}</View>
      </View>
      <View className="flex text-[#999]">
        <View className="item max-w-100px truncate">{item.nickname}</View>
        <View className="mx-6px">|</View>
        {item.majorName != '全部' && item.majorName && (
          <View className="flex items-center">
            <View className="max-w-120px truncate">{item.majorName}</View>
            <View className="mx-6px">|</View>
          </View>
        )}
        <View className="ml-4px">
          <Tag plain={true} type="success">
            {item.type}
          </Tag>
        </View>
      </View>
      <View className={classNames({ [styled.content]: true, 'text-coolgray': true })}>{item.contentPreview}</View>
      <View className="between py-4px">
        <View className="flex items-center text-#999">
          <View className="flex items-center" onClick={(e) => handleLike(e, item)}>
            <Icon name={isLike ? 'good-job' : 'good-job-o'} size={16} />
            <View className="ml-4px">{formatNumber2KW(likeCount)}</View>
          </View>
          <View className="flex items-center ml-4px">
            <Icon name="eye-o" size={16} />
            <View className="ml-4px">{formatNumber2KW(item.watchCount)}</View>
          </View>
          <View className="flex items-center ml-4px">
            <Icon name="comment-o" size={16} />
            <View className="ml-4px">{formatNumber2KW(item.commentCount)}</View>
          </View>
        </View>
        {item.topicContent != '全部' && (
          <View className="px-6px bg-#f2f2f2 text-#999 text-12px" onClick={handleGoToTopicArticle}>
            {item.topicContent}
          </View>
        )}
      </View>
    </View>
  )
}

export default memo(AppArticle)
