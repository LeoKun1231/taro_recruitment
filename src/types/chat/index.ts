export interface IConversationList {
  id: string
  message: string
  unread: number
  time: number
  name: string
  avatar: string
  userId: string | number
}

export interface IMessage {
  conversationID: string
  id: string
  flow: 'in' | 'out' //是否进来的
  text: string
  avatar: string
  nick: string
  userId: string
}
