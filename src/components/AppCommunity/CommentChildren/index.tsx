import { IComment } from '@/types'
import { Icon, Image } from '@antmjs/vantui'
import { View, Text } from '@tarojs/components'
import React, { memo } from 'react'
import type { FC, ReactNode } from 'react'
import User from '@/assets/img/user.svg'
import { timeago } from '@/utils/date'
import EditArea from '../EditArea'

interface IProps {
  children?: ReactNode
  comment: IComment
  fatherId: number
  onChange: () => void
}

const CommentChildren: FC<IProps> = (props) => {
  const { comment, fatherId, onChange } = props

  return (
    <View className="flex py-10px border h-fit">
      <View className="w-[42px] h-full mt-6px mr-6px">
        {comment.avatar && <Image src={comment.avatar} height={36} width={36} round className="border-1px border-solid border-#e2e2e2" />}
        {!comment?.avatar && <Image src={User} height={44} width={44} />}
      </View>
      <View className="flex-1">
        <View className="between">
          <View className="w-[140px] truncate text-[#2f71c7]">{comment.nickname}</View>
          <View className="text-#999">{timeago(comment.createTime)}</View>
        </View>
        <View className="break-all mb-6px">
          <Text className="w-[40px] mr-4px">回复</Text>
          <Text className="text-[#2f71c7] font-500">
            {comment.target.length > 18 ? comment.target.slice(0, 18) + '...' : comment.target}
          </Text>
          <Text className="mx-4px">:</Text>
          <Text className="break-all">{comment.content}</Text>
        </View>
        <EditArea comment={comment} fatherId={fatherId} isDetail onChange={onChange} />
      </View>
    </View>
  )
}

export default memo(CommentChildren)
