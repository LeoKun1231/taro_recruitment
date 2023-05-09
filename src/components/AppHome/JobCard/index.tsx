/*
 * @Author: hqk
 * @Date: 2023-04-21 21:29:16
 * @LastEditors: hqk
 * @LastEditTime: 2023-04-23 16:43:06
 * @Description:
 */

import { IHomeJobList } from '@/types'
import { Image } from '@antmjs/vantui'
import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useMemoizedFn } from 'ahooks'
import React, { memo } from 'react'
import type { FC, ReactNode } from 'react'

interface IProps {
  children?: ReactNode
  item: IHomeJobList
}

const JobCard: FC<IProps> = (props) => {
  const { item } = props

  const handleGoToJobDetail = useMemoizedFn(() => {
    Taro.navigateTo({
      url: '/pages/job-detail/index?id=' + item.jobId
    })
  })

  const handleGoToCompany = useMemoizedFn(() => {
    Taro.navigateTo({
      url: '/pages/company-detail/index?id=' + item.companyId
    })
  })

  return (
    <View className="px-10px py-14px bg-white my-10px rounded-[12px]">
      <View onClick={handleGoToJobDetail}>
        <View className="flex items-center justify-between">
          <View className="w-[200px] truncate">{item.jobName}</View>
          <View className="text-orange">
            {item.startMoney}K~{item.endMoney}K·{item.moneyMonth}薪
          </View>
        </View>
        <View className="flex items-center justify-between text-[#999] py-4px">
          <View className="w-[200px] truncate">{item.city[0] + ' ' + item.city[1]}</View>
          <View>{item.jobRequire}</View>
        </View>
        <View className="flex items-center py-10px">
          {item.tag.slice(0, 4).map((tag) => {
            return (
              <View className="px-8px max-w-70px truncate py-[2px] bg-[#f2f2f2] text-[#666] rounded-[4px] mr-[8px]" key={tag}>
                {tag}
              </View>
            )
          })}
        </View>
      </View>
      <View
        className="flex items-center justify-between  pt-6px px-8px border-t-1px border-t-solid border-t-#eee"
        onClick={handleGoToCompany}
      >
        <View className="center">
          <Image src={item.avatar} round height={30} width={30} className="border-1px border-solid border-#e2e2e2 mr-10px" />
          <View>{item.companyName}</View>
        </View>
        <View className="center">
          <View className="mr-6px border-1  truncate border-#eee border-solid px-8px py-4px mr-8px text-[#999]">{item.category}</View>
          <View className="border-1  truncate border-#eee border-solid px-8px py-4px text-[#999]">{item.size}</View>
        </View>
      </View>
    </View>
  )
}

export default memo(JobCard)
