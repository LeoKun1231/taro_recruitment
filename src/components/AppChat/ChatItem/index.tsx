/*
 * @Author: hqk
 * @Date: 2023-04-20 16:38:04
 * @LastEditors: hqk
 * @LastEditTime: 2023-04-21 13:02:10
 * @Description:
 */
import { IConversationList } from '@/types'
import { Icon, Image } from '@antmjs/vantui'
import { View } from '@tarojs/components'
import React, { memo } from 'react'
import type { FC, ReactNode } from 'react'
import User from '@/assets/img/user.png'
import { timeago } from '@/utils/date'

interface IProps {
  children?: ReactNode
  item: IConversationList
}

const ChatItem: FC<IProps> = (props) => {
  const { item } = props
  return (
    <View className="py-8px flex border-b-1 border-b-solid border-[#eee]">
      <View className="mr-12px center">
        {item.avatar ? (
          <Icon size={30} name={item.avatar} info={item.unread == 0 ? '' : item.unread > 99 ? '99+' : item.unread}></Icon>
        ) : (
          <Icon
            size={30}
            name="https://hqk10.oss-cn-hangzhou.aliyuncs.com/user.png"
            info={item.unread == 0 ? '' : item.unread > 99 ? '99+' : item.unread}
          ></Icon>
        )}
      </View>
      <View className="flex-1 flex items-center justify-between">
        <View className="h-full flex flex-col justify-between">
          <View className="w-[180px] truncate">{item.name}</View>
          <View className="w-[180px] truncate text-[#999] text-[12px]">{item.message}</View>
        </View>
        <View className="h-full flex items-start">
          <View className="text-gray">{timeago(item.time * 1000)}</View>
        </View>
      </View>
    </View>
  )
}

export default memo(ChatItem)
