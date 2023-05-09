/*
 * @Author: hqk
 * @Date: 2023-04-24 17:29:04
 * @LastEditors: hqk
 * @LastEditTime: 2023-04-25 14:10:42
 * @Description:
 */
import { IComment } from '@/types'
import { Field, Icon, Image, Button, Overlay, Popup } from '@antmjs/vantui'
import { Text, Textarea, View } from '@tarojs/components'
import React, { memo } from 'react'
import type { FC, ReactNode } from 'react'
import User from '@/assets/img/user.svg'
import { timeago } from '@/utils/date'
import { useMemoizedFn, useSafeState } from 'ahooks'
import classNames from 'classnames'

import styled from './index.module.scss'
import CommentDetail from '../CommentDetail'
import EditArea from '../EditArea'

interface IProps {
  children?: ReactNode
  item: IComment
  onChange: () => void
  loadCommentList: () => void
  onComment: (comment: IComment) => void
  onDetailShow: (show: boolean) => void
}

const Demo: FC<IProps> = (props) => {
  const { item, onChange, onComment, onDetailShow, loadCommentList } = props

  const [commentDetailShow, setCommentDetailShow] = useSafeState(false)

  const onCommentDetailShow = useMemoizedFn(() => {
    onComment && onComment(item)
    onDetailShow && onDetailShow(true)
    setCommentDetailShow(true)
  })

  const onCommentDetailClose = useMemoizedFn(() => {
    setCommentDetailShow(false)
    onDetailShow && onDetailShow(false)
  })

  return (
    <View className="flex mb-10px">
      <View className="w-50px  text-center pt-6px">
        {item.avatar && <Image src={item.avatar} height={36} width={36} round className="border-1px border-solid border-#e2e2e2" />}
        {!item?.avatar && <Image src={User} height={40} width={40} />}
      </View>
      <View className="flex-1">
        <View className=" border">
          <View>
            <View className="w-[96%] truncate">{item.nickname}</View>
            <View className="text-[#999]">
              <View>{timeago(item.createTime)}</View>
            </View>
          </View>
          <View className="break-all">{item.content}</View>
          <EditArea comment={item} onChange={onChange} />
        </View>
        <View className="mt-4px break-all ">
          {item.children && item.children?.length > 0 && (
            <View className="py-8px w-full bg-#f2f3f5" onClick={onCommentDetailShow}>
              {item.children.map((iten) => {
                return (
                  <View key={iten.id} className={classNames({ [styled.message]: true, 'break-all px-4px ': true })}>
                    <Text className=" text-#2f71c7">{iten.nickname.length > 12 ? iten.nickname.slice(0, 12) + '...' : iten.nickname}</Text>
                    <Text className=" mx-4px">回复</Text>
                    <Text className=" text-#2f71c7">{iten.target.length > 12 ? iten.target.slice(0, 12) + '...' : iten.target}</Text>
                    <Text className="mx-4px ">:</Text>
                    <Text>{iten.content}</Text>
                  </View>
                )
              })}
              {item.commentCount > 0 && (
                <View className="text-#2f71c7 mt-4px ml-4px">
                  查看全部评论 ({item.commentCount}) {'>'}
                </View>
              )}
            </View>
          )}
        </View>
      </View>

      <Popup show={commentDetailShow} onClose={onCommentDetailClose} position="right">
        <CommentDetail onClose={onCommentDetailClose} comment={item} onChange={onChange} loadCommentList={loadCommentList} />
      </Popup>
    </View>
  )
}

export default memo(Demo)
