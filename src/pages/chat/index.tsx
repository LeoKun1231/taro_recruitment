/*
 * @Author: hqk
 * @Date: 2023-04-17 20:18:46
 * @LastEditors: hqk
 * @LastEditTime: 2023-04-21 15:18:54
 * @Description:
 */
import React, { memo, useContext, useEffect } from 'react'
import type { FC, ReactNode } from 'react'
import { View } from '@tarojs/components'
import { TimContext } from '@/context'
import { useAppDispatch, useAppSelector, useAppShallowEqual } from '@/hooks'
import { useMemoizedFn, useSafeState } from 'ahooks'
import ChatItem from '@/components/AppChat/ChatItem'
import { SwipeCell, Button, Popup, Empty } from '@antmjs/vantui'
import Taro, { useDidShow } from '@tarojs/taro'
import { changeMessageAction } from '@/store'
import { changeSelectedAction } from '@/store/modules/tabbar'

import styled from './index.module.scss'

interface IProps {
  children?: ReactNode
}

const Chat: FC<IProps> = () => {
  const tim = useContext(TimContext)
  const { id, conversationList } = useAppSelector((state) => {
    return {
      id: state.login.loginUser.id,
      conversationList: state.chat.conversationList
    }
  }, useAppShallowEqual)
  useEffect(() => {}, [])

  const dispatch = useAppDispatch()

  useDidShow(() => {
    dispatch(changeMessageAction([]))
  })

  const deleteChatItem = useMemoizedFn((id: string) => {
    let promise = tim.deleteConversation(id)
    Taro.showLoading({
      title: '删除中...'
    })
    promise
      .then(() => {
        Taro.hideLoading()
      })
      .catch(() => {
        Taro.hideLoading() // 删除会话失败的相关信息
      })
  })

  const handleChatClick = useMemoizedFn((id: string) => {
    Taro.navigateTo({
      url: '/pages/chat-room/index?id=' + id
    })
  })
  useDidShow(() => {
    dispatch(changeSelectedAction(2))
  })
  return (
    <View>
      {conversationList.map((item) => {
        return (
          <SwipeCell
            rightWidth={75}
            renderRight={
              <View className="h-full center">
                <Button type="warning" onClick={() => deleteChatItem(item.id)}>
                  删除
                </Button>
              </View>
            }
            key={item.id}
          >
            <View className="active:bg-#eee px-16px" onClick={() => handleChatClick(item.id)}>
              <ChatItem item={item} />
            </View>
          </SwipeCell>
        )
      })}
      {conversationList.length == 0 && (
        <View className="h-[calc(100vh-50px)] overflow-hidden">
          <Empty description="暂无聊天信息" className="h-full" />
        </View>
      )}
    </View>
  )
}

export default memo(Chat)
