/*
 * @Author: hqk
 * @Date: 2023-04-24 11:31:28
 * @LastEditors: hqk
 * @LastEditTime: 2023-05-01 18:24:42
 * @Description:
 */
import AppTitle from '@/components/AppTitle'
import { useAppDispatch, useAppSelector, useAppShallowEqual } from '@/hooks'
import { addCommentAction, deleteArticleByIdAction, getArticleDetailAction, getArticleRelationAction, reportByIdAction } from '@/store'
import { IArticleDetail, IArticleRelation, IComment } from '@/types'
import { ActionSheet, Button, Dialog, Field, Icon, Image, Tag } from '@antmjs/vantui'
import { Textarea, RichText, View } from '@tarojs/components'
import Taro, { useLoad, useRouter } from '@tarojs/taro'
import { useCreation, useEventEmitter, useMemoizedFn, useSafeState } from 'ahooks'
import React, { ElementRef, memo, useContext, useEffect, useRef } from 'react'
import type { FC, ReactNode } from 'react'
import User from '@/assets/img/user.svg'
import { timeago } from '@/utils/date'
import { error, formatNumber2KW } from '@/utils'
import Prism from 'prismjs'
import AppComment from '@/components/AppCommunity/AppComment'
import { DeleteEventContext, LoadEventContext } from '@/context'
import classNames from 'classnames'
import useLike from '@/hooks/useLike'
import { ROLECODE } from '@/constant'

import styled from './index.module.scss'

interface IProps {
  children?: ReactNode
}

const ArticleDetail: FC<IProps> = () => {
  const router = useRouter()
  const [actionShow, setActionShow] = useSafeState(false)
  const [data, setData] = useSafeState<IArticleDetail>()
  const [message, setMessage] = useSafeState('')
  const [relationList, setRelationList] = useSafeState<IArticleRelation[]>([])
  const [detailComment, setDetailComment] = useSafeState<IComment>()
  const [detailShow, setDetailShow] = useSafeState(false)
  const [isLoad, setIsLoad] = useSafeState(false)
  const [confirmDialogShow, setConfirmDialogShow] = useSafeState(false)
  const [reportShow, setReportShow] = useSafeState(false)
  const [report, setReport] = useSafeState('')

  const appCommentRef = useRef<ElementRef<typeof AppComment>>(null)

  const event = useEventEmitter()
  const loadEvent = useEventEmitter()

  const { id, roleId } = useAppSelector((state) => {
    return {
      id: state.login.loginUser.id,
      roleId: state.login.loginUser.roleId
    }
  }, useAppShallowEqual)

  useEffect(() => {
    if (Taro.getEnv() == Taro.ENV_TYPE.WEAPP) {
      // require('@tarojs/taro/')
    }
  }, [])

  const dispatch = useAppDispatch()
  const { handleLike, isLike, likeCount } = useLike(data!, true, id)

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
    if (roleId == ROLECODE.ADMIN || id == data?.userId) {
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
  }, [roleId, data])

  const loadData = useMemoizedFn(async () => {
    const articleId = router.params.id!
    /**
     * 获取文章详情
     */
    const res = await dispatch(getArticleDetailAction(articleId)).unwrap()
    if (res.code == 200) {
      setData(res.data.data)
    }
    /**
     * 获取相关文章
     */
    const relationRes = await dispatch(getArticleRelationAction(articleId)).unwrap()
    if (relationRes.code == 200) {
      setRelationList(relationRes.data.list)
    }
  })

  useEffect(() => {
    loadData()
    //dispatch(addWatchCountAction(router.params.id!))
  }, [])

  useEffect(() => {
    //开启代码高亮
    setTimeout(() => {
      Prism.highlightAll()
    }, 3000)
  }, [])

  const handleGoToArticleDetail = useMemoizedFn((id: number) => {
    Taro.redirectTo({
      url: '/pages/article-detail/index?id=' + id
    })
  })

  event.useSubscription((count: any) => {
    setData({ ...data, commentCount: data?.commentCount! - count } as any)
  })

  const onCommentChange = useMemoizedFn((e) => {
    setMessage(e.detail.value)
  })

  const handleSend = useMemoizedFn(async () => {
    if (message.trim().length == 0) {
      error('评论不能为空')
      return
    }
    const res = await dispatch(addCommentAction({ rootId: 0, articleId: data?.id!, content: message, parentId: 0, userId: id })).unwrap()
    if (res.code == 200) {
      appCommentRef.current?.load()
      setData({ ...data, commentCount: data?.commentCount! + 1 } as any)
      setMessage('')
    }
  })

  const onComment = useMemoizedFn((value) => {
    setDetailComment(value)
  })

  const onDetailShow = useMemoizedFn((value) => {
    setDetailShow(value)
  })

  useLoad(() => {
    setTimeout(() => setIsLoad(true), 300)
  })

  const handleDeleteConfirm = useMemoizedFn(async () => {
    const res = await dispatch(deleteArticleByIdAction(router.params.id!)).unwrap()
    if (res.code == 200) {
      Taro.navigateBack()
    }
  })

  const handleDeleteCancel = useMemoizedFn(() => setConfirmDialogShow(false))

  const handleReportClose = useMemoizedFn(() => {
    setReportShow(false)
  })

  const handleReportConfirm = useMemoizedFn(() => {
    dispatch(reportByIdAction({ data: { articleId: router.params.id!, reason: report }, page: 'article' }))
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

  const onAddComment = useMemoizedFn(() => {
    setData({ ...data, commentCount: data?.commentCount! + 1 } as any)
  })

  const handleGoToTopicArticle = useMemoizedFn((e) => {
    e.stopPropagation()
    Taro.navigateTo({
      url: '/pages/topic-article/index?id=' + data?.topicId
    })
  })

  return (
    <View className="overflow-hidden">
      <AppTitle title="文章详情" renderRight={<Icon name="ellipsis" size={28} onClick={onActionShow} />} />
      <View className={Taro.getEnv() == Taro.ENV_TYPE.WEB ? styled.contentWEB : styled.contentWeapp}>
        <View className="mx-16px">
          <View className="py-12px text-20px font-600">{data?.title}</View>
          <View className="flex items-center  bg-#fefefd rounded-[8px] py-8px">
            <View className="mr-10px center">
              {data?.avatar && <Image src={data?.avatar!} className="border-1px border-solid border-#e2e2e2" height={44} width={44} />}
              {!data?.avatar && <Image src={User} height={44} width={44} />}
            </View>
            <View className="flex flex-col justify-between">
              <View className="text-[#666] truncate w-[94%]">{data?.nickname}</View>
              <View className="flex items-center text-[#999]">
                <View className="mr-4px">{timeago(data?.createTime)}</View>
                <View className="mr-4px">阅读 {formatNumber2KW(data?.watchCount!)}</View>
                <View className="mr-4px">评论 {formatNumber2KW(data?.commentCount! + 1)}</View>
                <View>点赞 {formatNumber2KW(data?.likeCount!)}</View>
              </View>
            </View>
          </View>
          <View className="py-4px border">
            <View dangerouslySetInnerHTML={{ __html: data?.content! }} className={styled.articleDetail}></View>
          </View>
          <View className="flex items-center mt-[20px] pb-20px">
            <View className="mr-[4px]">话题：</View>
            <Tag color="#169fe6" className="!px-[8px] !py-[6px] !text-[14px]" mark={true} onClick={handleGoToTopicArticle}>
              {data?.topicContent}
            </Tag>
          </View>
        </View>
        <View className="h-6px w-full bg-#f8f8f8"></View>
        <View className="mx-16px">
          <View className="mt-10px text-20px font-600">相关文章</View>
          <View>
            {relationList.map((item) => {
              return (
                <View key={item.id} className="px-4px pb-6px border" onClick={() => handleGoToArticleDetail(item.id)}>
                  <View className="text-18px py-6px truncate w-[98%]">{item.title}</View>
                  <View className="flex items-center text-[#999]">
                    <View className="mr-4px">阅读 {formatNumber2KW(item?.watchCount!)}</View>
                    <View className="mr-4px">评论 {formatNumber2KW(item?.commentCount!)}</View>
                  </View>
                </View>
              )
            })}
          </View>
        </View>

        {(data?.commentCount as any) > 0 && (
          <>
            <View className="h-6px w-full bg-#f8f8f8"></View>
            <View className="mx-16px">
              <View className="mt-10px text-20px font-600">全部评论({data?.commentCount})</View>
              <LoadEventContext.Provider value={loadEvent}>
                <DeleteEventContext.Provider value={event}>
                  <AppComment
                    articleId={router.params.id! as any}
                    onComment={onComment}
                    onDetailShow={onDetailShow}
                    ref={appCommentRef}
                    onAddComment={onAddComment}
                  />
                </DeleteEventContext.Provider>
              </LoadEventContext.Provider>
            </View>
          </>
        )}
        {isLoad && (
          <View className="fixed bg-white left-0 bottom-0 right-0  !w-100vw  border-t-1px border-t-solid border-t-#eee between  py-10px px-10px">
            <View className="flex-1 !bg-#eee rounded-[12px] overflow-hidden !px-10px">
              <Textarea
                autoHeight
                autoFocus={false}
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
              <View className=" flex items-center" onClick={(e) => handleLike(e, data)}>
                <Icon name={isLike ? 'good-job' : 'good-job-o'} size={24} className="text-[#007aff]" />
              </View>
            </View>
          </View>
        )}
        <ActionSheet
          style={{ zIndex: '3000' }}
          show={actionShow}
          actions={actions}
          cancelText="取消"
          onClose={onActionClose}
          onSelect={onActionSelect}
        />
        <Dialog
          showCancelButton
          title="删除提醒"
          message="删除后不可恢复"
          zIndex={3001}
          show={confirmDialogShow}
          id="vanDialog3"
          onConfirm={handleDeleteConfirm}
          onClose={handleDeleteCancel}
        />
        <Dialog
          showCancelButton
          title="举报"
          zIndex={3001}
          show={reportShow}
          id="vanDialog5"
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
      </View>
    </View>
  )
}

export default memo(ArticleDetail)
