/*
 * @Author: hqk
 * @Date: 2023-04-17 23:07:40
 * @LastEditors: hqk
 * @LastEditTime: 2023-04-26 17:07:23
 * @Description:
 */
import React, { memo, useContext, useEffect, useMemo, useState } from 'react'
import type { FC, ReactNode } from 'react'
import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { Button, Field, Checkbox, Popup, Icon, CountDown, Dialog, NumberKeyboard, FormItem, CellGroup } from '@antmjs/vantui'
import { useMemoizedFn, useSafeState } from 'ahooks'

import circle from '@/assets/img/circle.png'
import circleActive from '@/assets/img/circle_active.png'
import circlePassword from '@/assets/img/circle_password.png'
import circlePasswordActive from '@/assets/img/circle_password_active.png'
import { checkPhoneAction, clearAllAction, loginByAccountAction, loginByPhoneAction, registerChatUserAction, sendCodeAction } from '@/store'
import { useAppDispatch } from '@/hooks'
import { error, validatePhone } from '@/utils'
import { TimContext } from '@/context'
import TIM from 'tim-wx-sdk'

import styled from './index.module.scss'

interface IProps {
  children?: ReactNode
}

interface IPasswordProps {
  children?: ReactNode
  onCancel: () => void
}

const PasswordLogin: FC<IPasswordProps> = memo((props) => {
  const { onCancel } = props

  const [account, setAccount] = useSafeState('')
  const [password, setPassword] = useSafeState('')
  const [isAgree, setIsAgree] = useSafeState(false)

  const dispatch = useAppDispatch()

  /**
   * 返回
   */
  const handleCancel = useMemoizedFn(() => {
    onCancel && onCancel()
  })

  /**
   * 保存帐号
   */
  const handleSaveAccount = useMemoizedFn((e) => {
    setAccount(e.detail)
  })

  /**
   * 保存密码
   */
  const handleSavePassword = useMemoizedFn((e) => {
    setPassword(e.detail)
  })

  /**
   * 保存是否同意协议
   */
  const handleSaveIsAgree = useMemoizedFn((e) => {
    setIsAgree(e.detail)
  })

  /**
   * 密码登录
   */
  const handlePasswordLogin = useMemoizedFn(async () => {
    if (!isAgree) {
      error('请先同意协议')
      return
    }
    if (account == '') {
      error('帐号不能为空')
      return
    }
    if (password == '') {
      error('密码不能为空')
      return
    }

    const res = await dispatch(loginByAccountAction({ account, password })).unwrap()
    if (res.code == 200) {
      dispatch(registerChatUserAction({ toId: res.data.id! }))
      Taro.switchTab({
        url: '/pages/home/index',
        success() {
          setAccount('')
          setPassword('')
          setIsAgree(false)
        }
      })
    }
  })

  return (
    <View className={styled.password}>
      <View className=" px-28px mt-28px">
        <Icon name="cross" size="32px" className="icon" onClick={handleCancel}></Icon>
        <View className="mt-32px text-[#007aff] text-26px">帐号密码登录</View>
        <View className="mt-44px !rounded-full overflow-hidden">
          <Field value={account} placeholder="请输入你的帐号" onChange={handleSaveAccount} />
        </View>
        <View className="mt-24px !rounded-full overflow-hidden">
          <Field type="password" value={password} placeholder="请输入你的密码" onChange={handleSavePassword} />
        </View>
        <Button color="#007aff" block round className="!mt-36px" onClick={handlePasswordLogin}>
          登录
        </Button>
        <View className="mt-40px">
          <Checkbox
            value={isAgree}
            onChange={handleSaveIsAgree}
            className="center"
            renderIcon={<Image className="w-20px h-20px align-top" src={isAgree ? circlePasswordActive : circlePassword} />}
          >
            <Text className="text-[#007aff] text-14px">我已阅读并同意《用户协议》</Text>
          </Checkbox>
        </View>
      </View>
    </View>
  )
})

const Login: FC<IProps> = () => {
  const [telephone, setTelephone] = useSafeState('')
  const [code, setCode] = useSafeState('')
  const [isAgree, setIsAgree] = useSafeState(false)
  const [passwordShow, setPasswordShow] = useSafeState(false)
  const [codeShow, setCodeShow] = useSafeState(false)
  const [isSendCode, setIsSendCode] = useSafeState(false)

  const tim = useContext(TimContext)

  const dispatch = useAppDispatch()

  useEffect(() => {
    // Taro.removeStorage({
    //   key: 'persist:root'
    // })
    tim?.logout()
    tim?.destroy()
    Taro.clearStorageSync()
    dispatch(clearAllAction())
  }, [])

  /**
   * 保存电话
   */
  const handleTelephoneChange = useMemoizedFn((e) => {
    setTelephone(e.detail)
  })

  /**
   * 保存是否同意协议
   */
  const handleIsAgreeChange = useMemoizedFn((e) => {
    setIsAgree(e.detail)
  })

  /**
   * 跳转去密码登录
   */
  const handlePasswordLogin = useMemoizedFn(() => {
    setPasswordShow(true)
  })

  /**
   * 关闭密码登录
   */
  const handlePasswordCancel = useMemoizedFn(() => {
    setPasswordShow(false)
  })

  /**
   * 处理验证码输入
   */
  const handleCodeChange = useMemoizedFn((e) => {
    setCode(e.detail)
  })

  /**
   * 关闭输入验证码
   */
  const handleCodeCancel = useMemoizedFn(() => {
    setCodeShow(false)
    setCode('')
  })

  /**
   * 倒计时结束
   */
  const handleCountDownFinsh = useMemoizedFn(() => {
    setIsSendCode(false)
  })

  /**
   * 发送验证码
   */
  const handleSendCode = useMemoizedFn(async () => {
    if (!isAgree) {
      error('请先同意协议')
      return
    }
    if (telephone == '') {
      error('手机号码不能为空')
      return
    }
    if (!validatePhone(telephone)) {
      error('请输入正确的手机号码')
      return
    }
    const res = await dispatch(checkPhoneAction(telephone)).unwrap()
    if (res?.code == 200) {
      await dispatch(sendCodeAction(telephone))
      setCodeShow(true)
      setIsSendCode(true)
    }
  })

  /**
   * 打开验证码 如果没有输入
   */
  const handleShowSendCode = useMemoizedFn(() => {
    setCode('')
    setCodeShow(true)
  })

  /**
   * 登录
   */
  const handlePhoneLogin = useMemoizedFn(async () => {
    if (code.length < 6) {
      error('请输入6位验证码')
    }
    setCodeShow(false)
    setIsSendCode(false)
    const res = await dispatch(loginByPhoneAction({ code, telephone })).unwrap()
    if (res.code == 200) {
      dispatch(registerChatUserAction({ toId: res.data.id! }))
      Taro.switchTab({
        url: '/pages/home/index',
        success() {
          setIsAgree(false)
          setTelephone('')
          setCode('')
        }
      })
    }
    setCode('')
  })

  return (
    <View className={styled.login}>
      <View className=" text-white overflow-hidden px-28px h-[100vh] bg-[#007aff]">
        <View className="italic text-30px mt-70px ml-6px">欢迎来到</View>
        <View className="italic text-30px ml-6px">校园招聘网</View>
        <View className="text-14px ml-6px ">为学生和企业服务</View>
        <View className="mt-44px !rounded-full overflow-hidden">
          <Field value={telephone} placeholder="请输入你的手机号" onChange={handleTelephoneChange} />
        </View>

        {isSendCode ? (
          <Button color="#007aff" plain block round className="!mt-36px" onClick={handleShowSendCode}>
            <CountDown time={60000} format="发送验证码(ss秒)" onFinish={handleCountDownFinsh} />
          </Button>
        ) : (
          <Button color="#007aff" plain block round className="!mt-36px" onClick={handleSendCode}>
            获取短信验证码
          </Button>
        )}

        <View className="mt-36px center ">
          <Text className="text-14px" onClick={handlePasswordLogin}>
            密码登录
          </Text>
        </View>
        <View className="mt-40px">
          <Checkbox
            value={isAgree}
            onChange={handleIsAgreeChange}
            className="center"
            renderIcon={<Image className="w-20px h-20px align-top" src={isAgree ? circleActive : circle} />}
          >
            <Text className="text-white text-14px">我已阅读并同意《用户协议》</Text>
          </Checkbox>
        </View>
      </View>
      <Popup show={passwordShow} position="bottom">
        <PasswordLogin onCancel={handlePasswordCancel} />
      </Popup>
      <Dialog
        title="请输入验证码"
        showCancelButton
        closeOnClickOverlay={false}
        show={codeShow}
        onCancel={handleCodeCancel}
        onConfirm={handlePhoneLogin}
      >
        <View className={styled.code}>
          <Field value={code} placeholder="请输入验证码" maxlength={6} autoFocus center={true} border onChange={handleCodeChange} />
        </View>
      </Dialog>
    </View>
  )
}

export default memo(Login)
