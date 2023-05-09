/*
 * @Author: hqk
 * @Date: 2023-04-22 17:23:34
 * @LastEditors: hqk
 * @LastEditTime: 2023-05-01 17:03:13
 * @Description:
 */
import AppMap from '@/components/AppMap'
import AppTitle from '@/components/AppTitle'
import { useAppDispatch, useAppSelector, useAppShallowEqual } from '@/hooks'
import {
  addCompanyAndJobWatchCountAction,
  addResumeToJobAction,
  checkIsChatAction,
  getHomeJobDetailAction,
  getJobRelationListAction,
  saveChatRecordAction
} from '@/store'
import { IHomeJobDetail, IJobRelationList } from '@/types'
import { error } from '@/utils'
import { Button, Icon, Image } from '@antmjs/vantui'
import { RichText, Text, View } from '@tarojs/components'
import Taro, { useDidHide, useDidShow, useRouter } from '@tarojs/taro'
import { useMemoizedFn, useSafeState } from 'ahooks'
import React, { ElementRef, memo, useContext, useEffect, useRef } from 'react'
import type { FC, ReactNode } from 'react'
import TIM from 'tim-wx-sdk'
import { TimContext } from '@/context'
import { ROLECODE } from '@/constant'

import styled from './index.module.scss'

interface IProps {
  children?: ReactNode
}

const JobDetail: FC<IProps> = () => {
  const router = useRouter()
  const [data, setData] = useSafeState<IHomeJobDetail>()
  const [isSend, setIsSend] = useSafeState(false)
  const [jobType, setJobType] = useSafeState<string[]>([])
  const [isShowMore, setIsShowMore] = useSafeState(true)
  const [isExpend, setIsExpend] = useSafeState(true)
  const [jobList, setJobList] = useSafeState<IJobRelationList[]>([])
  const [isMapShow, setIsMapShow] = useSafeState(false)
  const [address, setAddress] = useSafeState<any[]>([])

  const appMapRef = useRef<ElementRef<typeof AppMap>>(null)
  const textRef = useRef()

  const tim = useContext(TimContext)

  const dispatch = useAppDispatch()

  const { id, conversationList, roleId } = useAppSelector((state) => {
    return {
      id: state.login.loginUser.id,
      conversationList: state.chat.conversationList,
      roleId: state.login.loginUser.roleId
    }
  }, useAppShallowEqual)

  const loadData = useMemoizedFn(async () => {
    if (router.params.id) {
      const res = await dispatch(getHomeJobDetailAction(router.params.id)).unwrap()
      if (res.code == 200) {
        setData(res.data.data)
        const address = res.data.data.address
        setIsSend(res.data.data.isSend)
        setJobType(res.data.data.jobType)
        if (address) {
          setAddress(address)
          setTimeout(() => {
            appMapRef.current?.setAddress({ latitude: address[1], longitude: address[0] })
          }, 1000)
        }
        const jobType = res.data.data.jobType

        //查询其他岗位
        const res2 = await dispatch(
          getJobRelationListAction({
            firstLabel: jobType[0],
            secondLabel: jobType[1],
            thirdLabel: jobType[2],
            isThird: true,
            jobId: router.params.id
          })
        ).unwrap()
        if (res2.code == 200) {
          setJobList(res2.data)
        }
      }
      dispatch(addCompanyAndJobWatchCountAction({ type: 2, id: router.params.id }))
    }
  })

  useEffect(() => {
    loadData()
  }, [router.params.id])

  useEffect(() => {
    let conDOm = textRef.current as any
    if (conDOm) {
      setTimeout(() => {
        const offsetH = conDOm?.offsetHeight
        const srollH = conDOm?.scrollHeight
        // 会有2px的偏差
        if (srollH - 2 > offsetH) {
          setIsExpend(true)
          setIsShowMore(true)
        } else {
          setIsExpend(false)
          setIsShowMore(false)
        }
      }, 1000)
    }
  }, [])

  const handleResume = useMemoizedFn(async () => {
    const res = await dispatch(addResumeToJobAction({ jobId: router.params.id!, userId: id })).unwrap()
    if (res.code != 200) {
      error('请先上传简历')
    } else {
      setIsSend(true)
    }
  })

  const sendMessage = useMemoizedFn(() => {
    const message = tim?.createTextMessage({
      to: data?.hrId + '',
      conversationType: TIM.TYPES.CONV_C2C,
      // 消息优先级，用于群聊（v2.4.2起支持）。如果某个群的消息超过了频率限制，后台会优先下发高优先级的消息，详细请参考：https://cloud.tencent.com/document/product/269/3663#.E6.B6.88.E6.81.AF.E4.BC.98.E5.85.88.E7.BA.A7.E4.B8.8E.E9.A2.91.E7.8E.87.E6.8E.A7.E5.88.B6)
      // 支持的枚举值：TIM.TYPES.MSG_PRIORITY_HIGH, TIM.TYPES.MSG_PRIORITY_NORMAL（默认）, TIM.TYPES.MSG_PRIORITY_LOW, TIM.TYPES.MSG_PRIORITY_LOWEST
      // priority: TIM.TYPES.MSG_PRIORITY_NORMAL,
      payload: {
        text: '您好，我对你发布的' + data?.jobName + '非常感兴趣,希望能加入贵公司'
      }
      // v2.20.0起支持C2C消息已读回执功能，如果您发消息需要已读回执，需购买旗舰版套餐，并且创建消息时将 needReadReceipt 设置为 true
      // needReadReceipt: true
      // 消息自定义数据（云端保存，会发送到对端，程序卸载重装后还能拉取到，v2.10.2起支持）
      // cloudCustomData: 'your cloud custom data'
    })
    // 2. 发送消息
    tim?.sendMessage(message!).then((res) => {
      let conversationId = res.data.message.conversationID
      Taro.navigateTo({
        url: '/pages/chat-room/index?id=' + conversationId
      })
    })
  })

  const handleChat = useMemoizedFn(async () => {
    const res = await dispatch(checkIsChatAction({ userId: id!, jobId: data?.id! })).unwrap()
    if (res.code != 200) {
      const item = conversationList.find((item) => item.userId == data?.hrId)
      if (item) {
        Taro.navigateTo({
          url: '/pages/chat-room/index?id=' + item?.id
        })
      } else {
        sendMessage()
      }
      return
    }
    sendMessage()
    dispatch(saveChatRecordAction({ userId: id!, jobId: data?.id! }))
  })

  const handleIsShowMore = useMemoizedFn(() => {
    setIsShowMore(!isShowMore)
  })

  useDidShow(() => {
    setIsMapShow(true)
    if (address.length > 0) {
      setTimeout(() => {
        appMapRef.current?.setAddress({ latitude: address[1], longitude: address[0] })
      }, 1000)
    }
  })

  useDidHide(() => {
    setIsMapShow(false)
  })

  const handleGoToJobDetail = useMemoizedFn((id: string) => {
    Taro.navigateTo({
      url: '/pages/job-detail/index?id=' + id
    })
  })

  return (
    <View className="overflow-hidden">
      <AppTitle title="职位详情" />
      <View className={Taro.getEnv() == Taro.ENV_TYPE.WEB ? styled.contentWEB : styled.contentWeapp}>
        <View className="px-16px py-16px">
          <View className="between">
            <View className="text-20px font-600 w-200px">{data?.jobName}</View>
            <View className="text-18px text-[#007aff]">
              {data?.startMoney}K~{data?.endMoney}K·{data?.moneyMonth}薪
            </View>
          </View>
          <View className="flex items-center text-16px text-#6c6c6c py-6px">
            <View className="mr-12px">
              <Icon name="location-o" />
              <Text className="ml-6px">
                {data?.city[0]}·{data?.city[1]}
              </Text>
            </View>
            <View>
              <Icon name="sign" />
              <Text className="ml-6px">{data?.jobRequire}</Text>
            </View>
          </View>
          <View>
            <View className="text-#6c6c6c">
              <Icon name="completed" className="mr-6px" />
              <Text>{data?.jobType.join('/')}</Text>
            </View>
          </View>
        </View>
        <View className="h-6px w-full bg-#f8f8f8"></View>
        <View className="px-16px py-10px">
          <View className="text-18px font-600">职位描述</View>
          <View className="flex flex-wrap">
            {data?.tag.map((item) => {
              return (
                <View key={item} className="my-4px px-8px py-[2px] bg-[#f2f2f2] text-[#666] rounded-[4px] mr-[8px]">
                  {item}
                </View>
              )
            })}
          </View>
          <View>
            <RichText
              nodes={data?.jobDesc!}
              style={isShowMore ? { overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 8 } : ''}
            ></RichText>
            {isExpend && (
              <View onClick={handleIsShowMore} className="center w-full text-#008fff">
                {isShowMore ? (
                  <View>
                    <Icon name="arrow-down" className="mr-4px" />
                    展开
                  </View>
                ) : (
                  <View>
                    <Icon name="arrow-up" className="mr-4px" />
                    收起
                  </View>
                )}
              </View>
            )}
          </View>
        </View>
        <View className="h-6px w-full bg-#f8f8f8"></View>
        <View className="px-16px py-10px">
          <View className="text-18px font-600">工作地点</View>
          <View className="text-#6c6c6c text-18px mb-4px">{data?.addressName}</View>
          {isMapShow && <AppMap ref={appMapRef}></AppMap>}
        </View>
        <View className="h-6px w-full bg-#f8f8f8"></View>
        <View className="px-16px py-10px">
          <View className="text-18px font-600">工作福利</View>
          <View className="between flex-wrap py-10px">
            {data?.weal.map((item) => {
              return (
                <View key={item} className="my-4px px-8px w-[44%] py-[4px] text-center bg-[#f2f2f2] text-[#666] rounded-[4px]">
                  {item}
                </View>
              )
            })}
          </View>
        </View>
        <View className="h-6px w-full bg-#f8f8f8"></View>
        <View className="px-16px py-10px">
          <View className="text-18px font-600">其他岗位</View>
          <View>
            {jobList.map((item) => {
              return (
                <View key={item.jobId} className="px-[6px] py-12px  border " onClick={() => handleGoToJobDetail(item.jobId)}>
                  <View className="between text-[16px] ">
                    <View className="truncate w-[200px]">{item.jobName}</View>
                    <View className=" text-[#ff6666]">
                      {item.startMoney}K~{item.endMoney}K·{item.moneyMonth}薪
                    </View>
                  </View>
                  <View className="between mt-10px">
                    <View className="flex items-center">
                      <Image className="border" src={item.avatar} height={25} width={25} />
                      <View className="ml-10px w-[200px] truncate">{item.companyName}</View>
                    </View>
                    <View className="item text-[#999]">{item.city[1]}</View>
                  </View>
                </View>
              )
            })}
          </View>
        </View>
      </View>
      {ROLECODE.STUDENT == roleId && (
        <View className="fixed left-0 right-0 bottom-0 h-60px z-1000  bg-white between border-t-1px border-t-solid border-t-#eee">
          <View className="between px-10px py-5px  w-full">
            <Button round type="info" icon="envelop-o" className="!px-30px" onClick={handleChat}>
              立即沟通
            </Button>
            <Button round type="primary" icon="chat-o" className="!px-30px" onClick={handleResume} disabled={isSend}>
              投递简历
            </Button>
          </View>
        </View>
      )}
    </View>
  )
}

export default memo(JobDetail)
