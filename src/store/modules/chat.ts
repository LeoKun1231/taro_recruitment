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
}

const initialState = {
  conversationList: [],
  messageList: []
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
    clearChatAction(state) {
      state.conversationList = []
      state.messageList = []
    }
  }
})

export default chatSlice.reducer
export const { changeConversationListAction, clearChatAction, changeMessageAction } = chatSlice.actions
