/*
 * @Author: hqk
 * @Date: 2023-02-04 11:54:17
 * @LastEditors: hqk
 * @LastEditTime: 2023-02-04 13:37:27
 * @Description:
 */
import { IConversationList, IMessage } from '@/types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface IState {
  conversationList: IConversationList[]
  messageList: IMessage[]
  routerId: string
}

const initialState = {
  conversationList: [],
  messageList: [],
  routerId: ''
} as IState

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    changeConversationListAction(state, { payload }: PayloadAction<IConversationList[]>) {
      state.conversationList = payload
    },
    changeMessageAction(state, { payload }: PayloadAction<IMessage[]>) {
      state.messageList = payload
    },
    changeRouterIdAction(state, { payload }: PayloadAction<string>) {
      state.routerId = payload
    },
    clearChatAction(state) {
      state.conversationList = []
      state.messageList = []
      state.routerId = ''
    }
  }
})

export default chatSlice.reducer
export const { changeConversationListAction, clearChatAction, changeMessageAction, changeRouterIdAction } = chatSlice.actions
