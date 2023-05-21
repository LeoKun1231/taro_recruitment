/*
 * @Author: hqk
 * @Date: 2023-04-19 16:13:34
 * @LastEditors: hqk
 * @LastEditTime: 2023-05-18 20:15:11
 * @Description:
 */
import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import React, { memo, useEffect } from 'react'
import type { FC, ReactNode } from 'react'
import { useAppDispatch, useAppSelector, useAppShallowEqual } from '@/hooks'
import { getResumeURLAction, uploadResumeAction } from '@/store'
import { useMemoizedFn, useSafeState } from 'ahooks'
import { Button, Empty, Uploader } from '@antmjs/vantui'
import AppTitle from '@/components/AppTitle'
import getBaseUrlAndTimeout from '@/services/config'
import { error, getFileType, success } from '@/utils'

import styled from './index.module.scss'

interface IProps {
  children?: ReactNode
}

const Resume: FC<IProps> = () => {
  const [value, setValue] = useSafeState([])

  const [resumeURL, setResumeURL] = useSafeState('')
  const [isShowLook, setIsShowLook] = useSafeState(false)

  const { loginUser } = useAppSelector((state) => {
    return {
      loginUser: state.login.loginUser
    }
  }, useAppShallowEqual)

  const dispatch = useAppDispatch()

  const loadResume = useMemoizedFn(async () => {
    const res = await dispatch(getResumeURLAction()).unwrap()
    if (res.code == 200) {
      const { data } = res
      setResumeURL(data.url)
    } else {
    }
  })

  useEffect(() => {
    loadResume()
  }, [])

  //h5上传简历
  const handleH5InputChange = useMemoizedFn((e) => {
    const formData = new FormData()

    const type = getFileType(e.nativeEvent?.target?.files[0]?.name)
    if (type != 'pdf') {
      error('请上传pdf格式的文件')
      return
    }

    /**
     * 限制文件大小
     */
    // const fileSize = e.nativeEvent?.target?.files[0]?.size
    // const size = fileSize / 1024 / 1024
    // if (size > 10) {
    //   error('简历大小不能大于10M')
    //   return
    // }

    formData.append('file', e.nativeEvent.target.files[0])
    dispatch(uploadResumeAction(formData))
      .unwrap()
      .then((res) => {
        if (res.code == 200) {
          loadResume()
          success('上传简历成功')
        } else {
          error('上传简历失败')
        }
      })
  })

  useEffect(() => {
    if (resumeURL == '') {
      setIsShowLook(false)
    } else {
      setIsShowLook(true)
    }
  }, [resumeURL])

  //查看pdf
  const handleLookResume = useMemoizedFn(() => {
    if (Taro.ENV_TYPE.WEB == Taro.getEnv()) {
      // dispatch(changeResumeURLAction(resumeURL))
      window.open(resumeURL)
    } else {
      Taro.downloadFile({
        url: resumeURL,
        success: function (res) {
          var filePath = res.tempFilePath
          Taro.openDocument({
            filePath: filePath,
            success: function (res) {}
          })
        }
      })
    }
  })

  const handleWEAPPClick = useMemoizedFn(() => {
    Taro.chooseMessageFile({
      count: 1,
      type: 'file',
      success: function (res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const temp = res.tempFiles
        const type = getFileType(temp[0].name)
        if (type != 'pdf') {
          error('请上传pdf格式的文件')
          return
        }

        // const fileSize = temp[0].size
        // const size = fileSize / 1024 / 1024
        // if (size > 10) {
        //   error('不能大于10M')
        //   return
        // }

        Taro.uploadFile({
          url: getBaseUrlAndTimeout().BASE_URL + '/home/upload/resume', //仅为示例，非真实的接口地址
          filePath: temp[0].path,
          withCredentials: false,
          name: 'file',
          header: {
            Authorization: 'Bearer ' + loginUser.token
          },
          success({ data }: any) {
            const res = JSON.parse(data)
            //do something
            if (res.code === 200) {
              success('上传简历成功')
              loadResume()
            } else {
              error('上传简历失败')
            }
          }
        })
      }
    })
  })

  return (
    <View className=" bg-[#f7f8fa] h-100vh overflow-hidden">
      <AppTitle title="我的简历" />
      {!isShowLook ? (
        <View className={Taro.getEnv() == Taro.ENV_TYPE.WEB ? styled.content : 'center h-full'}>
          <Empty description="还没有上传简历，请上传pdf格式的简历">
            {Taro.getEnv() == Taro.ENV_TYPE.WEAPP && (
              <Button type="primary" icon="edit" className="!m-0" block onClick={handleWEAPPClick}>
                上传简历
              </Button>
            )}
            {Taro.getEnv() == Taro.ENV_TYPE.WEB && (
              <View className="center">
                <input type="file" accept=".pdf" className={styled.input} onChange={handleH5InputChange} />
                <Button type="primary" icon="edit" className={styled.inputButton}>
                  上传简历
                </Button>
              </View>
            )}
          </Empty>
        </View>
      ) : (
        <View className={Taro.getEnv() == Taro.ENV_TYPE.WEB ? styled.content : 'center h-full'}>
          <View className="w-[70%] flex justify-between items-center">
            {Taro.getEnv() == Taro.ENV_TYPE.WEAPP && (
              <Button type="primary" icon="edit" className="!m-0" onClick={handleWEAPPClick}>
                修改简历
              </Button>
            )}
            {Taro.getEnv() == Taro.ENV_TYPE.WEB && (
              <View>
                <input type="file" accept=".pdf" className={styled.input} onChange={handleH5InputChange} />
                <Button type="primary" icon="edit" className={styled.inputButton}>
                  修改简历
                </Button>
              </View>
            )}
            <Button type="info" icon="search" className="!m-0" onClick={handleLookResume}>
              查看简历
            </Button>
          </View>
        </View>
      )}
    </View>
  )
}

export default memo(Resume)
