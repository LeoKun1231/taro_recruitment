import AppTitle from '@/components/AppTitle'
import { Textarea, View, Text } from '@tarojs/components'
import { useMemoizedFn, useSafeState } from 'ahooks'
import classNames from 'classnames'
import React, { memo, useEffect } from 'react'
import type { FC, ReactNode } from 'react'
import { Button, Field, Icon, Picker, Popup } from '@antmjs/vantui'

import { useAppDispatch, useAppSelector, useAppShallowEqual } from '@/hooks'
import { getTopicListAction, publishArticleAction } from '@/store'
import { ITopic } from '@/types'
import { error } from '@/utils'
import Taro, { pxTransform } from '@tarojs/taro'

import styled from './index.module.scss'

interface IProps {
  children?: ReactNode
}
const types = ['闲聊', '提问题', '提建议']

const PublishArticle: FC<IProps> = () => {
  const [currentIndex, setCurrentIndex] = useSafeState(0)
  const [content, setContent] = useSafeState('')
  const [topicList, setTopicList] = useSafeState<ITopic[]>([])
  const [onPickerShow, setOnPickerShow] = useSafeState(false)
  const [currentTopic, setCurrentTopic] = useSafeState(0)
  const [currentTopicText, setCurrentTopicText] = useSafeState('全部')
  const [pickerList, setPickerList] = useSafeState<string[]>([])
  const [title, setTitle] = useSafeState('')

  const dispatch = useAppDispatch()

  const { userId, majorId } = useAppSelector((state) => {
    return {
      userId: state.login.loginUser.id,
      majorId: state.login.loginUser.majorId
    }
  }, useAppShallowEqual)

  const handleTypeChange = useMemoizedFn((_: any, index: number) => {
    setCurrentIndex(index)
  })

  const onContentChange = useMemoizedFn((e) => {
    setContent(e.detail.value)
  })

  const handleTitleChange = useMemoizedFn((e) => {
    setTitle(e.detail)
  })

  const handleSend = useMemoizedFn(() => {
    if (title.trim().length < 5) {
      error('标题不能少于五个字')
      return
    }
    if (content.trim().length < 10) {
      error('内容不能少于十个字')
      return
    }

    dispatch(publishArticleAction({ content, userId, majorId, title, topicId: currentTopic, typeId: currentIndex + 1 }))
      .unwrap()
      .then(() => {
        Taro.navigateBack()
      })
  })

  const loadTopicData = useMemoizedFn(async () => {
    const res = await dispatch(getTopicListAction({ currentPage: 1, pageSize: 10000 })).unwrap()
    if (res.code == 200) {
      setPickerList(['全部', ...res.data.records.map((item) => item.content)])
      setTopicList([{ id: 0, content: '全部', count: 0, createTime: new Date().toString() }, ...res.data.records])
    }
  })

  useEffect(() => {
    loadTopicData()
  }, [])

  const handleShowPick = useMemoizedFn(() => {
    setOnPickerShow(true)
  })

  const handlePickerClose = useMemoizedFn(() => {
    setOnPickerShow(false)
  })

  const handlePickerConfirm = useMemoizedFn((e) => {
    const topic = topicList.find((item) => item.content == e.detail.value)
    setCurrentTopic(topic?.id!)
    setCurrentTopicText(topic?.content!)
    setOnPickerShow(false)
  })

  const handlePickerCancel = useMemoizedFn(() => {
    setOnPickerShow(false)
  })

  return (
    <View className="w-100vw h-100vh overflow-hidden">
      <AppTitle title="发布文章" />
      <View className={Taro.getEnv() == Taro.ENV_TYPE.WEB ? styled.contentWEB : styled.contentWEAPP}>
        <View className="flex items-center py-20px">
          <View className="text-18px font-600 mr-6px">类型 : </View>
          {types.map((item, index) => {
            return (
              <View
                className={classNames({ [styled.typeItem]: true, [styled.active]: currentIndex == index })}
                key={item}
                onClick={(e) => handleTypeChange(e, index)}
              >
                {item}
              </View>
            )
          })}
        </View>
        <View className="flex items-center py-10px">
          <View className="text-18px font-600 mr-2px">标题 :</View>
          <Field clearable placeholder="请输入标题" maxlength={50} value={title} onChange={handleTitleChange} />
        </View>
        <Textarea
          autoHeight
          value={content}
          className={classNames({ [styled.myInput]: true, 'py-6px w-full': true })}
          onInput={onContentChange}
          maxlength={2000}
          placeholder="请输入内容"
        />
        <View className="fixed bg-white left-0 bottom-0 right-0   border-t-1px border-t-solid border-t-#eee z-1011  w-full py-10px">
          <View className="px-20px flex items-center">
            <View className="flex-1">
              <View onClick={handleShowPick} className="w-fit text-[#007aff]">
                <Icon name="link-o" size={16} className="mr-4px" />
                <Text>{currentTopicText}</Text>
              </View>
            </View>
            <Button type="primary" round className="w-[100px] !h-30px !py-0 !mr-0 !ml-6px center" onClick={handleSend}>
              <View className="w-[50px]">发送</View>
            </Button>
          </View>
        </View>
      </View>
      <Popup position="bottom" show={onPickerShow} onClose={handlePickerClose} zIndex={3000}>
        <Picker columns={pickerList} onConfirm={handlePickerConfirm} onCancel={handlePickerCancel} />
      </Popup>
    </View>
  )
}

export default memo(PublishArticle)
