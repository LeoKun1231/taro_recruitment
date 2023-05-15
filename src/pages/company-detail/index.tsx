import { Text, View } from '@tarojs/components'
import React, { ElementRef, memo, useEffect, useRef } from 'react'
import type { FC, ReactNode } from 'react'
import Taro, { nextTick, useDidHide, useDidShow, useReachBottom, useRouter } from '@tarojs/taro'
import AppTitle from '@/components/AppTitle'
import { useMemoizedFn, useSafeState } from 'ahooks'
import { IDetailJobList, IHomeCompanyDetail } from '@/types'
import { useAppDispatch } from '@/hooks'
import {
  getCompanyDetailTypeAction,
  getHomeCompanyDetailByIdAction,
  getCompanyDetailJobListAction,
  addCompanyAndJobWatchCountAction
} from '@/store'
import AppMap from '@/components/AppMap'
import JobCardV2 from '@/components/AppHome/JobCardV2'

import { Ellipsis, Image, Swiper, SwiperItem, Tab, Tabs, Tag } from '@antmjs/vantui'
import styled from './index.module.scss'

interface IProps {
  children?: ReactNode
}

const CompanyDetail: FC<IProps> = () => {
  const router = useRouter()
  const [data, setData] = useSafeState<IHomeCompanyDetail>()
  const appMapRef = useRef<ElementRef<typeof AppMap>>(null)
  const [jobTypes, setJobTypes] = useSafeState<string[]>([])
  const [type, setType] = useSafeState<string>('')
  const [jobList, setJobList] = useSafeState<IDetailJobList[]>([])
  const [currentPage, setCurrentPage] = useSafeState(1)
  const [pageSize, setPageSize] = useSafeState(6)
  const [totalCount, setTotalCount] = useSafeState(6)
  const [isMapShow, setIsMapShow] = useSafeState(false)
  const [address, setAddress] = useSafeState<any[]>([])

  const [isFixed, setIsFixed] = useSafeState(false)

  const dispatch = useAppDispatch()

  const loadJobListData = useMemoizedFn(async (type: string, isPageChange: boolean, current: number) => {
    const jobListRes = await dispatch(
      getCompanyDetailJobListAction({ currentPage: current, pageSize, companyId: router.params.id!, type })
    ).unwrap()
    if (jobListRes.code == 200) {
      setTotalCount(jobListRes.data.totalCount)
      if (isPageChange) {
        setJobList(jobListRes.data.records)
      } else {
        setJobList((c) => [...c, ...jobListRes.data.records])
      }
    }
  })

  const loadData = useMemoizedFn(async () => {
    if (router.params.id) {
      const res = await dispatch(getHomeCompanyDetailByIdAction(router.params.id)).unwrap()
      if (res.code == 200) {
        setData(res.data.data)
        const address = res.data.data.address
        setAddress(address)
        if (address) {
          setTimeout(() => {
            appMapRef.current?.setAddress({ latitude: address[1], longitude: address[0] })
          }, 1000)
        }
      }
      const res2 = await dispatch(getCompanyDetailTypeAction(router.params.id)).unwrap()
      if (res2.code == 200) {
        setJobTypes(res2.data)
        setType(res2.data[0])
        loadJobListData(res2.data[0], true, 1)
      }
      dispatch(addCompanyAndJobWatchCountAction({ type: 1, id: router.params.id }))
    }
  })

  useEffect(() => {
    loadData()
  }, [])

  //图片预览
  const handleImagePreView = useMemoizedFn((url: string) => {
    if (data?.companyUrl) {
      Taro.previewImage({
        current: url,
        urls: data?.companyUrl
      })
    }
  })

  const handleTabChange = useMemoizedFn((e) => {
    setType(e.detail.title)
    loadJobListData(e.detail.title, true, 1)
    setPageSize(6)
    setCurrentPage(1)
  })

  const handleTabScroll = useMemoizedFn((e) => {
    if (isFixed != e.detail.isFixed) {
      setIsFixed(e.detail.isFixed)
    }
  })

  useReachBottom(() => {
    if (totalCount != jobList.length) {
      setCurrentPage(currentPage + 1)
      loadJobListData(type, false, currentPage + 1)
    }
  })

  const handleGoToJob = useMemoizedFn(() => {
    Taro.pageScrollTo({
      selector: '#my-job',
      duration: 500,
      offsetTop: 50
    })
  })

  useDidShow(() => {
    setIsMapShow(true)
    if (address.length > 0) {
      setTimeout(() => {
        appMapRef.current?.setAddress({ latitude: address[1], longitude: address[0] })
      }, 5000)
    }
  })

  useDidHide(() => {
    setIsMapShow(false)
  })

  return (
    <View className={styled.companyDetail}>
      {!isFixed && <AppTitle title="公司详情" />}
      <View className={Taro.getEnv() == Taro.ENV_TYPE.WEB ? styled.contentWEB : styled.contentWeapp}>
        <Swiper height={200} paginationColor="#ff6666" autoPlay="3000" paginationVisible initPage={0} isPreventDefault={false}>
          {data?.companyUrl.map((item, index) => (
            <SwiperItem key={`swiper#demo1${index}`}>
              <Image src={item} fit="cover" width="100%" height="200px" onClick={() => handleImagePreView(item)} />
            </SwiperItem>
          ))}
        </Swiper>
        <View className="px-14px mt-8px  !border">
          <View className="flex justify-between items-center py-10px px-6px">
            <View className="flex items-center">
              <Image src={data?.avatar as any} height={40} width={40} className="mr-10px" round />
              <View className="text-18px font-600">{data?.shortName}</View>
            </View>
            <View>
              <Tag round color="#ff6666" className="text-16px" onClick={handleGoToJob}>
                <View className="mr-4px py-6px px-6px">招聘职位</View>
                <View className="py-6px px-6px">{data?.jobCount}</View>
              </Tag>
            </View>
          </View>
          <View className="flex items-center py-8px">
            <View className="px-8px truncate py-[2px] bg-[#f2f2f2] text-[#666] rounded-[4px] mr-[8px]">{data?.companyType}</View>
            <View className="px-8px truncate py-[2px] bg-[#f2f2f2] text-[#666] rounded-[4px] mr-[8px]">浏览次数 : {data?.watchCount}</View>
          </View>
        </View>
        <View className="px-14px mt-8px">
          <View className="font-600 text-16px">公司简介 :</View>
          <View className="px-6px py-8px  rounded-[12px]">
            {data?.desc && (
              <Ellipsis rows={6} className={styled.ellipsis}>
                {data?.desc}
              </Ellipsis>
            )}
          </View>
        </View>
        <View className="px-14px mt-8px">
          <View className="font-600 text-16px">公司信息 :</View>
          <View className="px-6px py-8px  rounded-[12px]">
            <View className="between">
              <View className="flex-1 flex flex-col">
                <View className="text-#6c6c6c">公司全称</View>
                <View className="text-#373737">{data?.fullName}</View>
              </View>
              <View className="flex-1 flex flex-col">
                <View className="text-#6c6c6c">公司法人</View>
                <View className="text-#373737">{data?.linkman}</View>
              </View>
            </View>
            <View className="between mt-6px">
              <View className="flex-1 flex flex-col">
                <View className="text-#6c6c6c">公司类别</View>
                <View className="text-#373737">{data?.category}</View>
              </View>
              <View className="flex-1 flex flex-col">
                <View className="text-#6c6c6c">公司大小</View>
                <View className="text-#373737">{data?.level}</View>
              </View>
            </View>
            <View className="between mt-6px">
              <View className="flex-1 flex flex-col">
                <View className="text-#6c6c6c">公司地址</View>
                <View className="text-#373737">{data?.city[0] + '-' + data?.city[1]}</View>
              </View>
              <View className="flex-1 flex flex-col">
                <View className="text-#6c6c6c">公司官网</View>
                <View className="text-#373737">{data?.govUrl}</View>
              </View>
            </View>
          </View>
        </View>
        <View className="px-14px mt-8px">
          <View className="font-600 text-16px">位置信息 :</View>
          <View className="px-6px truncate text-#6c6c6c text-18px">{data?.addressName}</View>
          <View className="px-6px py-8px  rounded-[12px]">{isMapShow && <AppMap ref={appMapRef} />}</View>
        </View>
        <View className=" mt-8px" id="my-job">
          <View className="px-14px font-600 text-16px">招聘职位 :</View>
          <View className=" py-8px  rounded-[12px]">
            <Tabs active={1} swipeable animated onChange={handleTabChange} sticky onScroll={handleTabScroll} color="#007aff">
              {jobTypes.map((item) => {
                return (
                  <Tab title={item} key={item} className="min-h-200px px-6px">
                    {jobList.map((job) => {
                      return <JobCardV2 item={job} key={job.jobId} />
                    })}
                  </Tab>
                )
              })}
            </Tabs>
          </View>
        </View>
      </View>
    </View>
  )
}

export default memo(CompanyDetail)
