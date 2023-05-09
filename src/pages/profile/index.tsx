import React, { memo, useEffect, useState } from 'react'
import type { FC, ReactNode } from 'react'
import { View } from '@tarojs/components'
import { Button, Cell, Image, Uploader, Icon, Field } from '@antmjs/vantui'
import Taro, { useLoad } from '@tarojs/taro'
import { useMemoizedFn, useSafeState } from 'ahooks'
import { useAppDispatch, useAppSelector, useAppShallowEqual } from '@/hooks'
import classNames from 'classnames'
import { updateUserInfoAction, uploadAvatarAction } from '@/store/modules/info'
import AppTitle from '@/components/AppTitle'
import getBaseUrlAndTimeout from '@/services/config'
import { changeLoginUserAction, checkPhoneNoMessageAction } from '@/store'
import { error, validateEmail, validatePhone, validateRealName } from '@/utils'

import styled from './index.module.scss'

interface IProps {
  children?: ReactNode
}

const Profile: FC<IProps> = () => {
  const [value, setValue] = useSafeState([])
  const [url, setUrl] = useState('')

  const [nickName, setNickName] = useSafeState('')
  const [userName, setUserName] = useSafeState('')
  const [telephone, setTelephone] = useSafeState('')
  const [email, setEmail] = useSafeState('')
  const [isDisabled, setIsDisabled] = useState(false)

  const { loginUser } = useAppSelector((state) => {
    return {
      loginUser: state.login.loginUser
    }
  }, useAppShallowEqual)

  const dispatch = useAppDispatch()

  //上传头像
  const afterRead = useMemoizedFn((event) => {
    const { file, name } = event.detail
    Taro.uploadFile({
      url: getBaseUrlAndTimeout().BASE_URL + '/acl/user/updateTempAvatar', //仅为示例，非真实的接口地址
      filePath: file.url,
      withCredentials: false,
      name: 'file',
      header: {
        Authorization: 'Bearer ' + loginUser.token
      },
      success({ data }: any) {
        const res = JSON.parse(data)
        //do something
        if (res.code === 200) {
          setUrl(res.data.url)
        }
      }
    })
    setValue(value.concat(file))
  })

  const onNickNameChange = useMemoizedFn((e) => {
    setNickName(e.detail)
  })
  const onUserNameChange = useMemoizedFn((e) => {
    setUserName(e.detail)
  })
  const onTelephoneChange = useMemoizedFn((e) => {
    setTelephone(e.detail)
  })
  const onEmailChange = useMemoizedFn((e) => {
    setEmail(e.detail)
  })

  useEffect(() => {
    if (loginUser) {
      setNickName(loginUser.nickName)
      setUserName(loginUser.userName)
      setTelephone(loginUser.telephone)
      setEmail(loginUser.email)
      setUrl(loginUser.avatar)
    }
  }, [])

  useEffect(() => {
    if (loginUser.avatar != url) {
      setIsDisabled(false)
      return
    }
    if (loginUser.userName != userName) {
      setIsDisabled(false)
      return
    }
    if (loginUser.email != email) {
      setIsDisabled(false)
      return
    }
    if (loginUser.telephone != telephone) {
      setIsDisabled(false)
      return
    }
    if (loginUser.nickName != nickName) {
      setIsDisabled(false)
      return
    }
    setIsDisabled(true)
  }, [nickName, userName, email, telephone, url])

  const handleEdit = useMemoizedFn(async () => {
    if (!validateRealName(userName)) {
      error('姓名只能是中文')
      return
    }
    if (!validatePhone(telephone)) {
      error('请输入正确的手机号')
      return
    }
    if (!validateEmail(email)) {
      error('请输入邮箱')
      return
    }

    if (loginUser.telephone != telephone) {
      const res = await dispatch(checkPhoneNoMessageAction(telephone)).unwrap()
      if (res.code == 200) {
        error('该手机号已经存在')
        return
      }
    }

    dispatch(
      updateUserInfoAction({
        nickName,
        userName,
        telephone,
        email,
        avatar: url
      })
    )
      .unwrap()
      .then((res) => {
        if (res.code == 200) {
          const { userName, nickName, telephone, email, avatar } = res.data.data
          dispatch(changeLoginUserAction({ userName, nickName, telephone, email, avatar }))
          setIsDisabled(true)
          Taro.navigateBack({
            delta: 1
          })
        }
      })
  })

  const handleReset = useMemoizedFn(() => {
    setNickName(loginUser.nickName)
    setUserName(loginUser.userName)
    setTelephone(loginUser.telephone)
    setEmail(loginUser.email)
    setUrl(loginUser.avatar)
    setValue([])
  })

  return (
    <View className="bg-[#f4f5f7]">
      <AppTitle title="个人资料" />
      <View className={styled.avatar} style={{ paddingTop: Taro.ENV_TYPE.WEB == Taro.getEnv() ? '50px' : '' }}>
        <Cell
          title="头像"
          renderExtra={
            <Uploader
              fileList={value}
              maxCount={1}
              deletable={false}
              accept="image"
              onAfterRead={afterRead}
              className={classNames({ 'center !display-block': true, [styled.uploader]: true })}
            >
              <View className="center">
                <Image src={url} width={50} height={50} round className=" border-1 border-solid border-[#eee]" />
              </View>
            </Uploader>
          }
        />
      </View>
      <View className="mt-20px">
        <Field value={nickName} label="用户名" placeholder="请输入用户名" inputAlign="right" border onChange={onNickNameChange} />
        <Field value={userName} label="姓名" placeholder="请输入姓名" inputAlign="right" border onChange={onUserNameChange} />
        <Field value={telephone} label="手机号" placeholder="请输入手机号" inputAlign="right" border onChange={onTelephoneChange} />
        <Field value={email} label="邮箱" placeholder="请输入邮箱" inputAlign="right" border onChange={onEmailChange} />
      </View>
      <View className="pt-50px px-16px bg-white">
        <Button block type="primary" disabled={isDisabled} onClick={handleEdit}>
          修改
        </Button>
      </View>
      <View className="pt-30px px-16px bg-white">
        <Button block type="info" onClick={handleReset}>
          重置
        </Button>
      </View>
    </View>
  )
}

export default memo(Profile)
