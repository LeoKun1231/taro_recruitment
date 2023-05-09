import { useAppDispatch, useAppSelector, useAppShallowEqual } from '@/hooks'
import useLike from '@/hooks/useLike'
import { IComment, IFakeComment } from '@/types'
import { error, formatNumber2KW } from '@/utils'
import { ActionSheet, Button, Dialog, Field, Icon, Overlay } from '@antmjs/vantui'
import { RootPortal, Textarea, View } from '@tarojs/components'
import { useCreation, useMemoizedFn, useSafeState } from 'ahooks'
import classNames from 'classnames'
import React, { memo, useContext } from 'react'
import type { FC, ReactNode } from 'react'
import { addCommentAction, deleteCommentByIdAction, reportByIdAction } from '@/store'
import { DeleteEventContext } from '@/context'
import { ROLECODE } from '@/constant'

import styled from './index.module.scss'

interface IProps {
  children?: ReactNode
  comment: IComment
  hidden?: boolean
  isDetail?: boolean
  fatherId?: number
  onChange: () => void
}

const EditArea: FC<IProps> = (props) => {
  const { comment, hidden, isDetail, fatherId, onChange } = props
  const [data, setData] = useSafeState('')
  const [isShowInput, setIsShowInput] = useSafeState(false)
  const [actionShow, setActionShow] = useSafeState(false)
  const [confirmDialogShow, setConfirmDialogShow] = useSafeState(false)
  const [reportShow, setReportShow] = useSafeState(false)
  const [report, setReport] = useSafeState('')

  const deleteEvent = useContext(DeleteEventContext)

  const { id, roleId } = useAppSelector((state) => {
    return {
      id: state.login.loginUser.id,
      roleId: state.login.loginUser.roleId
    }
  }, useAppShallowEqual)

  const dispatch = useAppDispatch()

  const { handleLike, isLike, likeCount } = useLike(comment, false, id)

  const handleShowInput = useMemoizedFn(() => {
    setIsShowInput(true)
  })

  const onCloseInput = useMemoizedFn((e) => {
    setIsShowInput(false)
  })

  const onCommentChange = useMemoizedFn((e) => {
    setData(e.detail.value)
  })

  const onActionClose = useMemoizedFn(() => {
    setActionShow(false)
  })

  const onActionShow = useMemoizedFn(() => {
    setActionShow(true)
  })

  const onActionSelect = useMemoizedFn((e) => {
    const type = e.detail.name
    if (type == '举报') {
      setReportShow(true)
    } else if (type == '删除') {
      setConfirmDialogShow(true)
    }
  })

  const actions = useCreation(() => {
    if (roleId == ROLECODE.ADMIN || id == comment?.userId) {
      return [
        {
          name: '删除'
        }
      ]
    } else {
      return [
        {
          name: '举报'
        }
      ]
    }
  }, [roleId, comment])

  const handleSend = useMemoizedFn(async () => {
    if (data.trim().length == 0) {
      error('评论不能为空')
      return
    }
    if (isDetail) {
      const res = await dispatch(
        addCommentAction({
          articleId: comment.articleId,
          rootId: fatherId!,
          content: data,
          parentId: comment.id,
          userId: id,
          targetId: comment.userId
        })
      ).unwrap()
      if (res.code == 200) {
        setData('')
        onChange && onChange()
        setIsShowInput(false)
      }
    } else {
      const res = await dispatch(
        addCommentAction({
          articleId: comment.articleId,
          rootId: comment.id,
          content: data,
          parentId: comment.id,
          userId: id,
          targetId: comment.userId
        })
      ).unwrap()
      if (res.code == 200) {
        setData('')
        onChange && onChange()
        setIsShowInput(false)
      }
    }
  })

  const handleDeleteConfirm = useMemoizedFn(async () => {
    const res = await dispatch(deleteCommentByIdAction(comment.id)).unwrap()
    if (res.code == 200) {
      onChange && onChange()
      deleteEvent.emit(comment.commentCount + 1)
    }
  })

  const handleDeleteCancel = useMemoizedFn(() => {
    setConfirmDialogShow(false)
  })

  const handleReportClose = useMemoizedFn(() => {
    setReportShow(false)
  })

  const handleReportConfirm = useMemoizedFn(() => {
    dispatch(reportByIdAction({ data: { commentId: comment.id, reason: report }, page: 'comment' }))
      .unwrap()
      .then((res) => {
        if (res.code == 200) {
          setReport('')
        }
      })
  })

  const handleReportChange = useMemoizedFn((e) => {
    setReport(e.detail)
  })

  return (
    <>
      {!hidden && (
        <View className="between  text-#999 pb-10px">
          <View className="flex items-center">
            <View className="flex items-center" onClick={(e) => handleLike(e, comment)}>
              <Icon name={isLike ? 'good-job' : 'good-job-o'} size={16} />
              <View className="ml-4px">{formatNumber2KW(likeCount)}</View>
            </View>
            <View className="flex items-center ml-8px" onClick={handleShowInput}>
              <Icon name="comment-o" size={16} />
              <View className="ml-4px">{formatNumber2KW(comment.commentCount)}</View>
            </View>
          </View>
          <View className="flex items-center" onClick={onActionShow}>
            <Icon name="ellipsis" size={16} />
          </View>
        </View>
      )}
      {hidden && (
        <View className="flex justify-end text-#999 pb-10px">
          <View className="flex items-center" onClick={onActionShow}>
            <Icon name="ellipsis" size={16} />
          </View>
        </View>
      )}
      <Overlay show={isShowInput} onClick={onCloseInput}></Overlay>
      {isShowInput && (
        <View className="fixed  left-0 bottom-0 right-0  bg-white border-t-1px border-t-solid border-t-#eee z-1011 center w-full py-10px ">
          <View className="!w-[80%] !bg-#eee rounded-[12px] overflow-hidden !px-10px">
            <Textarea
              autoHeight
              onInput={onCommentChange}
              autoFocus={false}
              className={classNames({ [styled.myInput]: true, ' py-6px ': true })}
              maxlength={300}
              placeholder="请输入内容"
              fixed
            />
          </View>
          <Button type="primary" round className=" !h-30px !py-0 !mr-0 !ml-6px center" onClick={handleSend}>
            <View className="w-[50px]">发送</View>
          </Button>
        </View>
      )}
      <ActionSheet
        show={actionShow}
        actions={actions}
        cancelText="取消"
        style={{ zIndex: '3000' }}
        onClose={onActionClose}
        onCancel={onActionClose}
        onSelect={onActionSelect}
      />
      <Dialog
        showCancelButton
        title="删除提醒"
        zIndex={3001}
        message="删除后不可恢复"
        show={confirmDialogShow}
        id="vanDialog2"
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
      />
      <Dialog
        showCancelButton
        title="举报"
        zIndex={3001}
        show={reportShow}
        id="vanDialog4"
        onClose={handleReportClose}
        onConfirm={handleReportConfirm}
      >
        <Field
          placeholder="请输入内容"
          type="textarea"
          autosize={{ minHeight: '30px', maxHeight: '80px' }}
          maxlength={50}
          value={report}
          onChange={handleReportChange}
        />
      </Dialog>
    </>
  )
}

export default memo(EditArea)
