/*
 * @Author: hqk
 * @Date: 2023-04-21 18:41:11
 * @LastEditors: hqk
 * @LastEditTime: 2023-04-23 15:50:03
 * @Description:
 */
import { IHomeCompanyList } from '@/types'
import { Image } from '@antmjs/vantui'
import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useMemoizedFn } from 'ahooks'
import React, { memo } from 'react'
import type { FC, ReactNode } from 'react'

interface IProps {
  children?: ReactNode
  item: IHomeCompanyList
}

const CompamyCard: FC<IProps> = (props) => {
  const { item } = props

  const handleGotoCompanyDetail = useMemoizedFn(() => {
    Taro.navigateTo({
      url: '/pages/company-detail/index?id=' + item.companyId
    })
  })

  const handleGoToJobDetail = useMemoizedFn((id: string) => {
    Taro.navigateTo({
      url: '/pages/job-detail/index?id=' + id
    })
  })

  return (
    <View className=" bg-white my-6px py-8px px-4px rounded-8px">
      <View className="flex py-10px px-4px items-center" onClick={handleGotoCompanyDetail}>
        <View className="mr-12px center">
          <Image src={item.avatar} width={54} height={54} className="border-1 border-solid border-#eee" />
        </View>
        <View className="flex flex-col justify-between h-full">
          <View className="text-16px text-[#333] w-180px truncate">{item.shortName}</View>
          <View className="flex mt-6px">
            <View className="px-8px max-w-70px truncate py-[2px] bg-[#f2f2f2] text-[#666] rounded-[4px] mr-[8px]">{item.category}</View>
            <View className="px-8px max-w-70px truncate py-[2px] bg-[#f2f2f2] text-[#666] rounded-[4px] mr-[8px]">{item.level}</View>
            <View className="px-8px max-w-70px truncate py-[2px] bg-[#f2f2f2] text-[#666] rounded-[4px] mr-[8px]">{item.level}</View>
          </View>
        </View>
      </View>
      <View className="border-t-1px border-t-solid border-t-#eee">
        {item.jobList.map((job) => {
          return (
            <View
              key={job.jobId}
              className="flex justify-between items-center py-6px px-4px text-[#666]"
              onClick={() => handleGoToJobDetail(job.jobId)}
            >
              <View className="w-200px truncate">{job.jobName}</View>
              <View className="text-orange">
                {job.startMoney}K~{job.endMoney}K·{job.moneyMonth}薪
              </View>
            </View>
          )
        })}
      </View>
    </View>
  )
}

export default memo(CompamyCard)
