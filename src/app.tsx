/*
 * @Author: hqk
 * @Date: 2023-02-13 11:06:53
 * @LastEditors: hqk
 * @LastEditTime: 2023-05-09 10:53:36
 * @Description:
 */
import React, { memo, useEffect } from 'react'
import type { FC, ReactNode } from 'react'
import { Provider } from 'react-redux'
import 'uno.css'
import TIM from 'tim-wx-sdk'
import { genTestUserSig } from '@/utils/chat/GenerateTestUserSig'
import { useEventEmitter, useMemoizedFn, useSafeState } from 'ahooks'
import Taro, { useRouter } from '@tarojs/taro'
import { Dialog } from '@antmjs/vantui'

import './app.scss'
import { MessageEventContext, TimContext } from './context'
import store, { changeConversationListAction, changeMessageAction } from './store'
import { IConversationList } from './types'

if (process.env.TARO_ENV !== 'h5') {
  require('@tarojs/taro/html5.css')
}

interface IProps {
  children?: ReactNode
}

const init = async () => {
  return new Promise((resolve, reject) => {
    const tim = TIM.create({ SDKAppID: 1400805337 })
    const onReady = () => {
      resolve(tim)
    }
    tim.setLogLevel(4)
    tim.on(TIM.EVENT.SDK_READY, onReady)
    tim.login({
      userID: store.getState().login.loginUser.id + '',
      userSig: genTestUserSig(store.getState().login.loginUser.id + '').userSig
    })
  })
}
let timer: any = null
const App: FC<IProps> = (props) => {
  const [myTim, setTim] = useSafeState()

  const router = useRouter()

  const messageEvent = useEventEmitter()

  const loadData = useMemoizedFn(async () => {
    const res: any = await init()
    res?.on(TIM.EVENT.CONVERSATION_LIST_UPDATED, async function (event) {
      const list: IConversationList[] = []
      const conversationList = event.data // 全量的会话列表，用该列表覆盖原有的会话列表
      conversationList.forEach((item) => {
        list.push({
          id: item?.conversationID,
          message: item?.lastMessage?.messageForShow,
          time: item?.lastMessage.lastTime,
          name: item?.userProfile?.nick,
          avatar: item?.userProfile?.avatar,
          unread: item?.unreadCount,
          userId: item?.userProfile?.userID
        })
      })
      store.dispatch(changeConversationListAction(list))
    })
    let onMessageReceived = function (event) {
      const text = res?.getTotalUnreadMessageCount().toString()
      if (text == '0') {
        Taro.hideTabBarRedDot({
          index: 2
        })
      } else {
        Taro.setTabBarBadge({
          index: 2,
          text: text as any
        })
      }

      // event.data - 存储 Message 对象的数组 - [Message]
      const messageList = event.data
      messageEvent.emit()
      messageList.forEach((message) => {
        if (message.type === TIM.TYPES.MSG_TEXT) {
          const list = store.getState().chat.messageList
          if (router.params.id != message.conversationID) return
          store.dispatch(
            changeMessageAction([
              ...list,
              {
                id: message.ID,
                flow: message.flow,
                text: message.payload.text,
                avatar: message.avatar,
                nick: message.nick,
                userId: message.from
              }
            ])
          )
        }
      })
    }
    if (timer) clearInterval(timer)
    timer = setInterval(() => {
      if (router.path == '/pages/login/index') {
        clearInterval(timer)
        return
      }
      //获取未读
      const pages = Taro.getCurrentPages()
      const currentPage = pages[pages.length - 1]
      if (
        currentPage.route == 'pages/home/index' ||
        currentPage.route == 'pages/community/index' ||
        currentPage.route == 'pages/chat/index' ||
        currentPage.route == 'pages/mine/index'
      ) {
        const text = res.getTotalUnreadMessageCount().toString() as string
        if (text != '0') {
          Taro.setTabBarBadge({
            index: 2,
            text: text as any
          })
        } else {
          Taro.hideTabBarRedDot({
            index: 2
          })
        }
      }
    }, 1000)
    const promise = res.getMyProfile()
    promise.then(function (imResponse) {
      const { nick } = imResponse.data
      // 修改个人标配资料
      res.updateMyProfile({
        nick: store.getState().login.loginUser.userName
          ? store.getState().login.loginUser.userName
          : store.getState().login.loginUser.nickName
      })
    })
    res.on(TIM.EVENT.MESSAGE_RECEIVED, onMessageReceived)
    setTim(res)
  })

  useEffect(() => {
    // new Vconsole()
    if (store.getState()?.login?.loginUser?.id) {
      loadData()
    }
  }, [store.getState()?.login?.loginUser?.id])

  return (
    <Provider store={store}>
      <TimContext.Provider value={myTim}>
        <MessageEventContext.Provider value={messageEvent}>{props.children}</MessageEventContext.Provider>
        <Dialog id="logout" zIndex={3000} />
      </TimContext.Provider>
    </Provider>
  )
}

export default memo(App)
