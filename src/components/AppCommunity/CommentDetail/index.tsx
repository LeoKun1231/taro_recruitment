import AppTitle from '@/components/AppTitle'
import { IComment } from '@/types'
import { Button, Icon, Image } from '@antmjs/vantui'
import { Textarea, View } from '@tarojs/components'
import React, { memo, useContext, useEffect, useMemo } from 'react'
import type { FC, ReactNode } from 'react'
import User from '@/assets/img/user.svg'
import { timeago } from '@/utils/date'
import { useAppDispatch, useAppSelector, useAppShallowEqual } from '@/hooks'
import { useMemoizedFn, useSafeState } from 'ahooks'
import { addCommentAction, getMoreCommentAction } from '@/store'
import { LoadEventContext } from '@/context'
import useLike from '@/hooks/useLike'
import { error } from '@/utils'
import classNames from 'classnames'
import Taro from '@tarojs/taro'

import CommentChildren from '../CommentChildren'
import EditArea from '../EditArea'
import styled from './index.module.scss'

interface IProps {
  children?: ReactNode
  onClose: () => void
  comment: IComment
  onChange: () => void
  loadCommentList: () => void
}

const CommentDetail: FC<IProps> = (props) => {
  const { onClose, comment, onChange, loadCommentList } = props

  const [commentList, setCommentList] = useSafeState<IComment[]>([])
  const [message, setMessage] = useSafeState('')

  const loadEvent = useContext(LoadEventContext)

  const { id } = useAppSelector((state) => {
    return {
      id: state.login.loginUser.id
    }
  }, useAppShallowEqual)

  const { handleLike, isLike, likeCount } = useLike(comment, false, id)
  const dispatch = useAppDispatch()
  const loadData = useMemoizedFn(() => {
    dispatch(getMoreCommentAction({ articleId: comment.articleId, userId: id, rootId: comment.id }))
      .unwrap()
      .then((res) => {
        const arr = res.data.list
        arr.forEach((item) => {
          const iten = arr.find((iten) => iten.id == item.parentId)
          if (iten?.content) {
            item.targetContent = iten.content
          }
        })
        setCommentList(arr)
      })
  })
  useEffect(() => {
    loadData()
  }, [])

  const handleCommentChildrenChange = useMemoizedFn(() => {
    loadData()
    onChange()
  })

  const handleSend = useMemoizedFn(async () => {
    if (message.trim().length == 0) {
      error('评论不能为空')
      return
    }
    const res = await dispatch(
      addCommentAction({
        articleId: comment?.articleId!,
        rootId: comment?.id!,
        content: message,
        parentId: comment?.id!,
        userId: id,
        targetId: comment?.userId
      })
    ).unwrap()
    if (res.code == 200) {
      setMessage('')
      loadCommentList && loadCommentList()
      loadData()
      onChange()
    }
  })

  const onCommentChange = useMemoizedFn((e) => {
    setMessage(e.detail.value)
  })

  const handleLikeMiddleware = useMemoizedFn(async (e) => {
    await handleLike(e, comment)
    loadCommentList && loadCommentList()
  })

  return (
    <View className="w-100vw h-100vh overflow-hidden">
      <AppTitle title="评论详情" noLink onClose={onClose} />
      <View className={styled.content}>
        <View className="px-14px py-16px flex  border-b-1px border-b-solid border-b-#e2e2e2">
          <View className="w-[42px] mb-4px flex  items-start mt-6px mr-6px">
            {comment.avatar && (
              <Image src={comment.avatar} height={36} width={36} round className="border-1px border-solid border-#e2e2e2" />
            )}
            {!comment?.avatar && <Image src={User} height={40} width={40} />}
          </View>
          <View className="flex-1">
            <View className="between">
              <View className="w-[160px] truncate">{comment.nickname}</View>
              <View className="text-#999">{timeago(comment.createTime)}</View>
            </View>
            <View className="w-full break-all">{comment.content}</View>
            <EditArea comment={comment} hidden onChange={onChange} />
          </View>
        </View>
        <View className="px-14px py-6px">
          <View className="flex items-center text-[#999] text-18px">
            <View className="mr-10px">评论({comment.commentCount})</View>
            <View>点赞({comment.likeCount})</View>
          </View>
          <View>
            {commentList.map((item) => {
              return <CommentChildren key={item.id} comment={item} fatherId={comment.id} onChange={handleCommentChildrenChange} />
            })}
          </View>
        </View>
      </View>
      <View className=" bg-white  !w-100vw  border-t-1px border-t-solid border-t-#eee between  py-10px px-10px">
        <View className="flex-1 !bg-#ededed rounded-[12px] overflow-hidden !px-10px">
          <Textarea
            autoHeight
            onInput={onCommentChange}
            value={message}
            className={classNames({ [styled.myInput]: true, ' py-6px ': true })}
            maxlength={300}
            placeholder="请输入内容"
            fixed
          />
        </View>
        <View className="w-[120px] flex items-center">
          <Button type="primary" round className="!h-30px !py-0  !mr-4px !ml-6px " onClick={handleSend}>
            <View>发送</View>
          </Button>
          <View className="flex items-center" onClick={handleLikeMiddleware}>
            <Icon name={isLike ? 'good-job' : 'good-job-o'} size={24} style={{ color: '#007aff' }} />
          </View>
        </View>
      </View>
    </View>
  )
}

export default memo(CommentDetail)
