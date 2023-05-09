/*
 * @Author: hqk
 * @Date: 2023-04-22 13:23:39
 * @LastEditors: hqk
 * @LastEditTime: 2023-04-22 14:21:33
 * @Description:
 */
import { IDetailJobList } from '@/types'
import { Text, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useMemoizedFn } from 'ahooks'
import React, { memo } from 'react'
import type { FC, ReactNode } from 'react'

interface IProps {
  children?: ReactNode
  item: IDetailJobList
}

const JobCardV2: FC<IProps> = (props) => {
  const { item } = props

  const handleGoToJobDetail = useMemoizedFn(() => {
    Taro.navigateTo({
      url: '/pages/job-detail/index?id=' + item.jobId
    })
  })

  return (
    <View key={item.jobId} className="px-12px py-16px my-10px bg-white border" onClick={handleGoToJobDetail}>
      <View className="w-full">
        <View className="between text-18px items-center">
          <View className="truncate w-[140px]">{item.jobName}</View>
          <View className=" text-[#ff6666]">
            {item.startMoney}K~{item.endMoney}K·{item.moneyMonth}薪
          </View>
        </View>
        <View className="flex py-12px">
          {item.tag.slice(0, 3).map((tag) => {
            return (
              <View className="px-4px py-2px border-1px border-solid border-#ff9a35 text-#ff9a35 mr-4px max-w-100px truncate " key={tag}>
                {tag}
              </View>
            )
          })}
          {item.tag.length > 3 && <Text className="text-#ff9a35">...</Text>}
        </View>
        <View className="flex py-6px">
          {item.weal.slice(0, 3).map((weal) => {
            return (
              <View
                className=" border-1  max-w-100px truncate border-#eee border-solid px-4px rounded-[6px] py-2px mr-4px text-#666 bg-#eee"
                key={weal}
              >
                {weal}
              </View>
            )
          })}
          {item.weal.length > 3 && <Text>...</Text>}
        </View>
      </View>
    </View>
  )
}

export default memo(JobCardV2)
