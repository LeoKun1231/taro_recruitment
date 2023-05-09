/*
 * @Author: hqk
 * @Date: 2023-02-11 16:40:05
 * @LastEditors: hqk
 * @LastEditTime: 2023-05-08 14:47:28
 * @Description:
 */
import React, { memo, useEffect } from 'react'
import type { FC, ReactNode } from 'react'
import { View } from '@tarojs/components'
import { Icon, Image, Popup, Search, Swiper, SwiperItem, Tab, Tabs } from '@antmjs/vantui'
import { useMemoizedFn, useSafeState } from 'ahooks'
import { useAppDispatch } from '@/hooks'
import { getHomeBannerListAction, getHotCompanyListAction } from '@/store'
import HomeCategory from '@/components/AppHome/HomeCategory'
import Taro, { useDidShow } from '@tarojs/taro'
import HomeCompany from '@/components/AppHome/HomeCompany'
import HomeJob from '@/components/AppHome/HomeJob'
import classNames from 'classnames'
import { changeSelectedAction } from '@/store/modules/tabbar'

import styled from './index.module.scss'

interface IProps {
  children?: ReactNode
}

const Home: FC<IProps> = () => {
  const [initPage, setInitPage] = useSafeState(0)
  const [images, setImages] = useSafeState<{ govUrl: string; imgUrl: string }[]>([])
  const [isCategoryShow, setIsCategoryShow] = useSafeState(false)
  const [type, setType] = useSafeState<'job' | 'company'>('company')
  const [companyType, setCompanyType] = useSafeState('热门')
  const [jobType, setJobType] = useSafeState('热门')
  const [tabIndex, setTabIndex] = useSafeState(0)

  const onTabChange = useMemoizedFn((e) => {
    console.log(e.detail)
    if (e.detail.index == 0) {
      setCompanyType('热门')
    } else if (e.detail.index == 1) {
      setJobType('热门')
    }
    setType(e.detail.index == 0 ? 'company' : 'job')
  })

  const dispatch = useAppDispatch()

  const loadImages = useMemoizedFn(async () => {
    const res = await dispatch(getHomeBannerListAction()).unwrap()
    if (res.code == 200) {
      setImages(res.data)
    }
  })

  useEffect(() => {
    loadImages()
  }, [])

  useEffect(() => {
    if (type == 'company') {
    }
  }, [])

  useDidShow(() => {
    Taro.pageScrollTo({
      scrollTop: 0
    })
  })

  const onCategoryOpen = useMemoizedFn(() => {
    setIsCategoryShow(true)
    Taro.hideTabBar()
  })

  const onPopupClose = useMemoizedFn(() => {
    setIsCategoryShow(false)
    Taro.showTabBar()
  })

  const handleCategoryChange = useMemoizedFn((value: string) => {
    if (type == 'company') {
      setCompanyType(value)
    } else if (type == 'job') {
      setJobType(value)
    }
    Taro.showTabBar()
    setIsCategoryShow(false)
  })

  const handleGoToSearch = useMemoizedFn(() => {
    Taro.navigateTo({
      url: '/pages/search/index?type=' + 1
    })
  })

  useDidShow(() => {
    dispatch(changeSelectedAction(0))
  })

  const openNewPage = useMemoizedFn((url: string) => {
    Taro.getEnv() == Taro.ENV_TYPE.WEB && window.open(url)
  })

  return (
    <View className="bg-#f8f8f8 ">
      <Search
        shape="round"
        readonly
        onClickInput={handleGoToSearch}
        placeholder="请输入岗位名称"
        renderAction={
          <View onClick={onCategoryOpen} className="center w-60px text-[#1890ff] text-16px">
            <View className="mr-2px">分类</View>
            <Icon name="filter-o" />
          </View>
        }
      />
      <Swiper height={200} paginationColor="#426543" autoPlay="3000" paginationVisible initPage={initPage} isPreventDefault={false}>
        {images.map((item, index) => (
          <SwiperItem key={`swiper#demo1${index}`}>
            <Image src={item.imgUrl} fit="cover" width="100%" height="200px" onClick={() => openNewPage(item.govUrl)} />
          </SwiperItem>
        ))}
      </Swiper>
      <Tabs onClick={onTabChange} sticky color="#007aff">
        <Tab title="公司列表" className="px-10px bg-#f8f8f8 ">
          <HomeCompany type={companyType} tab={type} />
        </Tab>
        <Tab title="职位列表" className="px-10px bg-#f8f8f8 ">
          <HomeJob type={jobType} tab={type} />
        </Tab>
      </Tabs>
      <Popup show={isCategoryShow} position="top" onClose={onPopupClose}>
        <HomeCategory onClose={onPopupClose} type={type} onConfirm={handleCategoryChange} />
      </Popup>
    </View>
  )
}

export default memo(Home)
