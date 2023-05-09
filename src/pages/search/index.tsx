import { View } from '@tarojs/components'
import React, { memo, useEffect } from 'react'
import type { FC, ReactNode } from 'react'
import { Search, Icon, Empty } from '@antmjs/vantui'
import { useDebounceFn, useMemoizedFn, useSafeState } from 'ahooks'
import { useAppDispatch } from '@/hooks'
import { getArticleSearchResultAction, searchJobAction } from '@/store'
import Taro, { useRouter } from '@tarojs/taro'

import styled from './index.module.scss'

interface IProps {
  children?: ReactNode
}

const AppSearch: FC<IProps> = () => {
  const router = useRouter()

  const [data, setData] = useSafeState<any[]>([])

  const dispatch = useAppDispatch()

  const { run: handleSearch } = useDebounceFn(
    (e) => {
      if (e.detail != '') {
        if (router.params.type == '1') {
          dispatch(searchJobAction(e.detail))
            .unwrap()
            .then((res) => {
              if (res.code == 200) {
                setData(res.data)
              }
            })
        } else if (router.params.type == '2') {
          dispatch(getArticleSearchResultAction(e.detail))
            .unwrap()
            .then((res) => {
              if (res.code == 200) {
                setData(res?.data?.list)
              }
            })
        }
      } else {
        setData([])
      }
    },
    {
      wait: 500
    }
  )

  const handleBack = useMemoizedFn(() => {
    Taro.navigateBack()
  })

  const handleGoToDetail = useMemoizedFn((id: string) => {
    if (router.params!.type == '1') {
      Taro.redirectTo({
        url: '/pages/job-detail/index?id=' + id
      })
    } else if (router.params.type == '2') {
      Taro.redirectTo({
        url: '/pages/article-detail/index?id=' + id
      })
    }
  })

  useEffect(() => {
    setData([])
  }, [router.params.type])

  return (
    <View>
      <View className="flex items-center border ">
        <Icon name="arrow-left" size={24} className="ml-10px" onClick={handleBack} />
        <Search
          shape="round"
          placeholder={router.params.type == '1' ? '请输入搜索岗位名' : '请输入文章名'}
          className="w-[calc(100vw-34px)]"
          onChange={handleSearch}
        />
      </View>

      <View className="h-[calc(100vh-205px)] px-10px">
        {data.map((item) => {
          return (
            <View key={item.id} className="py-10px border between" onClick={() => handleGoToDetail(item.id)}>
              {router.params.type == '1' && (
                <>
                  <View className="flex items-center">
                    <View className="text-[#666] max-w-[160px] truncate mr-6px">{item.jobName}</View>
                    <View className="px-4px text-12px max-w-60px truncate py-[2px] bg-[#f2f2f2] text-[#666] rounded-[4px] mr-[8px]">
                      {item.jobType}
                    </View>
                  </View>
                  <View className="text-orange text-14px">
                    {item.startMoney}K~{item.endMoney}K·{item.moneyMonth}薪
                  </View>
                </>
              )}
              {router.params.type == '2' && (
                <>
                  <View className="flex items-center">
                    <Icon name="records" size={20} />
                    <View className="text-[#666] truncate ml-6px">{item.title}</View>
                  </View>
                </>
              )}
            </View>
          )
        })}
        {data.length == 0 && <Empty description="暂无数据" />}
      </View>
    </View>
  )
}

export default memo(AppSearch)
