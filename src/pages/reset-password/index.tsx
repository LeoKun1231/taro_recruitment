import AppTitle from '@/components/AppTitle'
import { useAppDispatch } from '@/hooks'
import { checkPhoneAction, sendCodeAction } from '@/store'
import { resetPassowrdByTelephoneAction } from '@/store/modules/info'
import { error, validateCode, validatePhone } from '@/utils'
import { Button, CountDown, Field } from '@antmjs/vantui'
import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useMemoizedFn, useSafeState } from 'ahooks'
import React, { memo, useEffect } from 'react'
import type { FC, ReactNode } from 'react'

import styled from './index.module.scss'

interface IProps {
  children?: ReactNode
}

const ResetPassword: FC<IProps> = () => {
  const [telephone, setTelephone] = useSafeState('')
  const [code, setCode] = useSafeState('')
  const [password, setPassword] = useSafeState('')
  const [isSendCode, setIsSendCode] = useSafeState(false)

  const [isDisabled, setIsDisabled] = useSafeState(true)
  const [isEdit, setIsEdit] = useSafeState(false)

  const dispatch = useAppDispatch()

  const onTelephoneChange = useMemoizedFn((e) => {
    setTelephone(e.detail)
  })

  const onCodeChange = useMemoizedFn((e) => {
    setCode(e.detail)
  })

  const onPasswordChange = useMemoizedFn((e) => {
    setPassword(e.detail)
  })

  const onCountDownFinish = useMemoizedFn(() => {
    setIsDisabled(false)
    setIsSendCode(false)
  })

  const onCodeSend = useMemoizedFn(async () => {
    if (!validatePhone(telephone)) {
      error('请输入正确手机号码')
      return
    }
    const res = await dispatch(checkPhoneAction(telephone)).unwrap()
    if (res.code == 200) {
      const res2 = await dispatch(sendCodeAction(telephone)).unwrap()
      if (res2.code == 200) {
        setIsSendCode(true)
        setIsDisabled(true)
      }
    }
  })

  const handleEdit = useMemoizedFn(async () => {
    if (code != '' && password != '' && telephone != '' && isSendCode) {
      if (!validatePhone(telephone)) {
        error('请输入正确手机号码')
        return
      }
      if (!validateCode(code)) {
        error('请输入验证码')
        return
      }
      const res = await dispatch(resetPassowrdByTelephoneAction({ telephone, code, password })).unwrap()
      if (res.code == 200) {
        Taro.navigateBack({ delta: 1 })
      }
    }
  })

  useEffect(() => {
    if (telephone.length > 0) {
      setIsDisabled(false)
    }
  }, [telephone])

  useEffect(() => {
    if (code != '' && password != '' && telephone != '' && isSendCode) {
      if (!validatePhone(telephone)) {
        return
      }
      if (!validateCode(code)) {
        return
      }
      setIsEdit(true)
    }
  }, [code, password, telephone, isSendCode])

  return (
    <View className="bg-[#f4f5f7]">
      <AppTitle title="重置密码" />
      <View className={Taro.getEnv() == Taro.ENV_TYPE.WEB ? styled.content : ''}>
        <View>
          <Field value={telephone} label="手机号" placeholder="请输入手机号" inputAlign="right" border onChange={onTelephoneChange} />
          <Field
            value={code}
            center
            maxlength={6}
            clearable
            label="短信验证码"
            placeholder="请输入短信验证码"
            border
            onChange={onCodeChange}
            renderButton={
              <Button size="small" type="info" onClick={onCodeSend} disabled={isDisabled}>
                {isSendCode ? <CountDown time={60000} format="重新发送(ss秒)" onFinish={onCountDownFinish} /> : '发送验证码'}
              </Button>
            }
          />
          <Field value={password} label="新密码" placeholder="请输入新的密码" inputAlign="right" border onChange={onPasswordChange} />
        </View>
        <View className="pt-50px px-16px ">
          <Button block type="primary" round disabled={!isEdit} onClick={handleEdit}>
            修改
          </Button>
        </View>
      </View>
    </View>
  )
}

export default memo(ResetPassword)
