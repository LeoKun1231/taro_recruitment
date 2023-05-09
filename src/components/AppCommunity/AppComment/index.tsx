/*
 * @Author: hqk
 * @Date: 2023-04-24 15:07:18
 * @LastEditors: hqk
 * @LastEditTime: 2023-04-25 17:54:22
 * @Description:
 */
import { useAppDispatch, useAppSelector, useAppShallowEqual } from '@/hooks'
import { getCommentListAction } from '@/store'
import { IArticle, IArticleDetail, IComment } from '@/types'
import { View } from '@tarojs/components'
import { useMemoizedFn, useSafeState } from 'ahooks'
import React, { forwardRef, memo, useContext, useEffect, useImperativeHandle } from 'react'
import type { FC, ReactNode } from 'react'
import { useReachBottom } from '@tarojs/taro'
import CommentItem from '../CommentItem'

interface IProps {
  children?: ReactNode
  articleId: number
  onComment: (comment: IComment) => void
  onDetailShow: (value: boolean) => void
  onAddComment: () => void
}

interface IHandler {
  load: () => void
}

const AppComment = forwardRef<IHandler, IProps>((props, ref) => {
  const { articleId, onComment, onDetailShow, onAddComment } = props

  const [currentPage, setCurrentPage] = useSafeState(1)
  const [pageSize, setPageSize] = useSafeState(5)
  const [count, setCount] = useSafeState(0)
  const [commentList, setCommentList] = useSafeState<IComment[]>([])

  const dispatch = useAppDispatch()
  const { id } = useAppSelector((state) => {
    return {
      id: state.login.loginUser.id
    }
  }, useAppShallowEqual)

  const loadData = useMemoizedFn(async (current: number, isPageChange: boolean, size: number) => {
    const res = await dispatch(getCommentListAction({ currentPage: current, articleId, pageSize: size, userId: id })).unwrap()
    if (res.code == 200) {
      setCount(res.data.totalCount)
      if (isPageChange) {
        setCommentList(res.data.list)
      } else {
        setCommentList((c) => [...c, ...res.data.list])
      }
    }
  })

  useEffect(() => {
    loadData(1, false, 5)
  }, [])

  const onChange = useMemoizedFn(() => {
    loadData(1, true, pageSize * currentPage)
  })
  useReachBottom(() => {
    if (count != commentList.length) {
      setCurrentPage(currentPage + 1)
      loadData(currentPage + 1, false, 5)
    }
  })

  const loadCommentList = useMemoizedFn(async () => {
    await loadData(1, true, pageSize * currentPage)
    onAddComment && onAddComment()
  })

  useImperativeHandle(
    ref,
    () => {
      return {
        load() {
          loadData(1, true, pageSize * currentPage)
        }
      }
    },
    [currentPage, pageSize]
  )

  return (
    <View className="py-10px">
      {commentList.map((item) => {
        return (
          <CommentItem
            key={item.id}
            item={item}
            onChange={onChange}
            onComment={onComment}
            onDetailShow={onDetailShow}
            loadCommentList={loadCommentList}
          />
        )
      })}
    </View>
  )
})
export default memo(AppComment)
