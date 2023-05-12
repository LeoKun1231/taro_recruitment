import AppTitle from '@/components/AppTitle'
import { MessageEventContext, TimContext } from '@/context'
import { IMessage } from '@/types'
import { Button, Field, Image, PowerScrollView } from '@antmjs/vantui'
import { ScrollView, Text, View } from '@tarojs/components'
import Taro, { useDidShow, useLoad, usePullDownRefresh, useRouter } from '@tarojs/taro'
import { useEventEmitter, useMemoizedFn, useSafeState } from 'ahooks'
import React, { memo, useContext, useEffect, useState } from 'react'
import type { FC, ReactNode } from 'react'
import User from '@/assets/img/user.png'
import classNames from 'classnames'
import { changeConversationListAction, changeMessageAction, changeRouterIdAction } from '@/store/modules/chat'
import { useAppDispatch, useAppSelector, useAppShallowEqual } from '@/hooks'
import TIM from 'tim-wx-sdk'
import { error } from '@/utils'
import { cloneDeep, debounce } from 'lodash'
import PullToRefresh from '@/components/PullToRefresh'

import styled from './index.module.scss'

interface IProps {
  children?: ReactNode
}

const ChatRoom: FC<IProps> = () => {
  const router = useRouter()
  const tim = useContext(TimContext)
  const [title, setTitle] = useSafeState('')
  const [message, setMessage] = useSafeState('')
  const [userId, setUserId] = useSafeState('')
  const [nextId, setNextId] = useSafeState('')
  const [isFinish, setIsFinish] = useSafeState(false)
  const [scrollTop, setTop] = useSafeState(0)
  const [isFirst, setIsFirst] = useSafeState(true)

  const onscroll = useMemoizedFn((e) => setTop(e.detail?.scrollTop))

  const dispatch = useAppDispatch()

  const { messageList, conversationList } = useAppSelector((state) => {
    return {
      messageList: state.chat.messageList,
      conversationList: state.chat.conversationList
    }
  }, useAppShallowEqual)

  const messageEvent = useContext(MessageEventContext)
  /**
   * 监听消息，收到消息回到底部
   */
  messageEvent?.useSubscription(() => {
    Taro.nextTick(() => {
      if (Taro.getEnv() == Taro.ENV_TYPE.WEB) {
        document.querySelector('.taro-scroll-view__scroll-y')?.scrollTo({
          behavior: 'smooth',
          top: document.querySelector('.taro-scroll-view__scroll-y')?.scrollHeight!
        })
      } else if (Taro.getEnv() == Taro.ENV_TYPE.WEAPP) {
        Taro.createSelectorQuery()
          .select('.scrollView')
          .node()
          .exec((res) => {
            if (res && res.length > 0) {
              res[0]?.node?.scrollTo({ top: 10000 })
            }
          })
      }
    })
  })

  /**
   * 获取消息列表
   */
  const getMessageList = useMemoizedFn(() => {
    const id = router.params.id
    let promise = tim?.getMessageList({ conversationID: id })
    promise.then(function (imResponse) {
      const messageList = imResponse.data.messageList // 消息列表。
      const nextReqMessageID = imResponse.data.nextReqMessageID // 用于续拉，分页续拉时需传入该字段。
      const isCompleted = imResponse.data.isCompleted // 表示是否已经拉完所有消息。
      setIsFinish(isCompleted)
      if (isCompleted) {
        setNextId('')
      } else {
        setNextId(nextReqMessageID)
      }
      const items = messageList.map((item) => {
        return {
          conversationID: item.conversationID,
          id: item.ID,
          flow: item.flow,
          text: item.payload.text,
          avatar: item.avatar,
          nick: item.nick,
          userId: item.from
        }
      }) as IMessage[]
      dispatch(changeMessageAction(items))
    })
  })

  useEffect(() => {
    if (!tim) return
    getMessageList()
    // 将某会话下所有未读消息已读上报
    tim.setMessageRead({ conversationID: router.params.id })
    tim.getConversationProfile(router.params.id).then((res) => {
      const { userProfile } = res.data.conversation
      setUserId(userProfile.userID)
      setTitle(userProfile.nick)

      const list = cloneDeep(conversationList)
      list.forEach((item) => {
        if (item.id == router.params.id) {
          item.name = userProfile.nick
          //将未读消息置空
          item.unread = 0
        }
      })
      dispatch(changeConversationListAction(list))
    })
  }, [tim, router.params.id])

  useEffect(() => {
    if (title) {
      Taro.setNavigationBarTitle({
        title
      })
    }
  }, [title])

  useEffect(() => {
    tim?.setMessageRead({ conversationID: router.params.id })
  }, [messageList])

  const onMessageChange = useMemoizedFn((e) => {
    setMessage(e.detail)
  })

  /**
   * 发送信息
   */
  const onSendMessage = useMemoizedFn(async () => {
    if (message == '') {
      return
    }
    // 发送文本消息，Web 端与小程序端相同
    // 1. 创建消息实例，接口返回的实例可以上屏
    const messageText = tim.createTextMessage({
      to: userId,
      conversationType: TIM.TYPES.CONV_C2C,
      // 消息优先级，用于群聊（v2.4.2起支持）。如果某个群的消息超过了频率限制，后台会优先下发高优先级的消息，详细请参考：https://cloud.tencent.com/document/product/269/3663#.E6.B6.88.E6.81.AF.E4.BC.98.E5.85.88.E7.BA.A7.E4.B8.8E.E9.A2.91.E7.8E.87.E6.8E.A7.E5.88.B6)
      // 支持的枚举值：TIM.TYPES.MSG_PRIORITY_HIGH, TIM.TYPES.MSG_PRIORITY_NORMAL（默认）, TIM.TYPES.MSG_PRIORITY_LOW, TIM.TYPES.MSG_PRIORITY_LOWEST
      // priority: TIM.TYPES.MSG_PRIORITY_NORMAL,
      payload: {
        text: message
      }
    })
    // 2. 发送消息
    let promise = tim.sendMessage(messageText)
    promise
      .then(function (imResponse) {
        // 发送成功
        setMessage('')
        getMessageList()
        Taro.nextTick(() => {
          if (Taro.getEnv() == Taro.ENV_TYPE.WEB) {
            document.querySelector('.taro-scroll-view__scroll-y')?.scrollTo({
              behavior: 'smooth',
              top: document.querySelector('.taro-scroll-view__scroll-y')?.scrollHeight!
            })
          } else if (Taro.getEnv() == Taro.ENV_TYPE.WEAPP) {
            Taro.createSelectorQuery()
              .select('.scrollView')
              .node()
              .exec((res) => {
                if (res && res.length > 0) {
                  res[0]?.node?.scrollTo({ top: 10000 })
                }
              })
          }
        })
      })
      .catch(function (imError) {
        error('发送失败')
      })
  })

  useEffect(() => {
    if (isFirst) {
      if (messageList.length <= 6) return
      Taro.nextTick(() => {
        if (Taro.getEnv() == Taro.ENV_TYPE.WEB) {
          document.querySelector('.taro-scroll-view__scroll-y')?.scrollTo({
            behavior: 'smooth',
            top: document.querySelector('.taro-scroll-view__scroll-y')?.scrollHeight!
          })
        } else if (Taro.getEnv() == Taro.ENV_TYPE.WEAPP) {
          Taro.createSelectorQuery()
            .select('.scrollView')
            .node()
            .exec((res) => {
              if (res && res.length > 0) {
                res[0]?.node?.scrollTo({ top: 10000 })
              }
            })
        }
        setIsFirst(false)
      })
    }
  }, [messageList])

  const basicsLoadMore = useMemoizedFn(async () => {
    if (nextId == '') return
    const id = router.params.id
    const res = await tim?.getMessageList({ conversationID: id, nextReqMessageID: nextId })
    const messages = res.data.messageList // 消息列表。
    const isCompleted = res.data.isCompleted // 表示是否已经拉完所有消息。
    setIsFinish(isCompleted)
    const nextReqMessageID = res.data.nextReqMessageID // 用于续拉，分页续拉时需传入该字段。
    if (isCompleted) {
      setNextId('')
    } else {
      setNextId(nextReqMessageID)
    }
    const items = messages.map((item) => {
      return {
        conversationID: item.conversationID,
        id: item.ID,
        flow: item.flow,
        text: item.payload.text,
        avatar: item.avatar,
        nick: item.nick,
        userId: item.from
      }
    }) as IMessage[]
    dispatch(changeMessageAction([...items, ...messageList]))
  })

  useEffect(() => {
    return () => {
      setTitle('')
      setMessage('')
      setUserId('')
      setNextId('')
      setIsFinish(false)
      setIsFirst(true)
    }
  }, [])

  return (
    <View className="h-100vh overflow-hidden">
      <AppTitle title={title} />
      <ScrollView
        onScroll={onscroll}
        scrollY
        scrollWithAnimation
        enhanced
        className={classNames([Taro.getEnv() == Taro.ENV_TYPE.WEB ? styled.chatScrollViewH5 : styled.chatScrollViewWeapp, 'scrollView'])}
        upperThreshold={100}
        lowerThreshold={100}
        onScrollToUpper={basicsLoadMore}
      >
        <View className={classNames({ chatRoom: true, [styled.chat]: true, 'p-10px': true })} style={{ background: '#efefef' }}>
          {messageList.map((item, index) => {
            return (
              <View key={item.id}>
                {item.flow == 'in' && messageList.length != index + 1 && (
                  <View key={item.id} className="flex py-14px ">
                    {item.avatar == '' ? (
                      <Image src={User} renderLoading height={36} width={36} />
                    ) : (
                      <Image src={item.avatar} renderLoading height={36} width={36} />
                    )}
                    <View className="bubble   px-12px py-8px max-w-220px break-words rounded-[8px]">{item.text}</View>
                  </View>
                )}
                {item.flow == 'in' && messageList.length == index + 1 && (
                  <View key={item.id} className="flex py-14px ">
                    {item.avatar == '' ? (
                      <Image src={User} renderLoading height={36} width={36} />
                    ) : (
                      <Image src={item.avatar} renderLoading height={36} width={36} />
                    )}
                    <View className="bubble   px-12px py-8px max-w-220px break-words rounded-[8px]">{item.text}</View>
                  </View>
                )}
                {item.flow == 'out' && messageList.length == index + 1 && (
                  <View key={item.id} className="flex justify-end pt-14px pb-14px">
                    <View className="flex ">
                      <View className="bubbleLeft  bg-blue px-12px py-8px max-w-220px break-words rounded-[8px]">{item.text}</View>
                      {item.avatar == '' ? (
                        <Image src={User} renderLoading height={36} width={36} />
                      ) : (
                        <Image src={item.avatar} renderLoading height={36} width={36} />
                      )}
                    </View>
                  </View>
                )}
                {item.flow == 'out' && messageList.length != index + 1 && (
                  <View key={item.id} className="flex justify-end py-14px">
                    <View className="flex ">
                      <View className="bubbleLeft  bg-blue px-12px py-8px max-w-220px break-words rounded-[8px]">{item.text}</View>
                      {item.avatar == '' ? (
                        <Image src={User} renderLoading height={36} width={36} />
                      ) : (
                        <Image src={item.avatar} renderLoading height={36} width={36} />
                      )}
                    </View>
                  </View>
                )}
              </View>
            )
          })}
        </View>
      </ScrollView>
      <View className="fixed bottom-0 left-0 right-0 border-t-1 border-t-solid border-t-#eee">
        <Field
          type="textarea"
          placeholder="请输入内容"
          value={message}
          onChange={onMessageChange}
          autosize={{ minHeight: '20px', maxHeight: '80px' }}
          border={false}
          className={styled.myInput}
          renderButton={<Button onClick={onSendMessage}>发送</Button>}
        />
      </View>
    </View>
  )
}

export default memo(ChatRoom)
