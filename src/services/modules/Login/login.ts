/*
 * @Author: hqk
 * @Date: 2023-02-26 10:08:14
 * @LastEditors: hqk
 * @LastEditTime: 2023-04-18 16:47:56
 */
import appRequest from '@/services'
import { IBaseResult, ILoginAccount, ILoginPhone, ILoginResetPassword, ILoginResult } from '@/types'

/**
 * @description: 帐号登录
 * @param {ILoginAccount} account
 * @return {*}
 */
export function loginByAccount(account: ILoginAccount) {
  return appRequest.post<ILoginResult>({
    url: '/user/login/account',
    data: account
  })
}

/**
 * @description: 手机登录
 * @param {ILoginPhone} phone
 * @return {*}
 */
export function loginByPhone(phone: ILoginPhone) {
  return appRequest.post<ILoginResult>({
    url: '/user/login/phone',
    data: phone
  })
}

/**
 * @description: 重置密码
 * @param {ILoginResetPassword} data
 * @return {*}
 */
export function resetPassword(data: ILoginResetPassword) {
  return appRequest.post<ILoginResult>({
    url: '/user/login/resetPassword',
    data
  })
}

/**
 * @description: 验证码登录
 * @param {number} telephone
 * @return {*}
 */
export function sendCode(telephone: number | string) {
  return appRequest.get<IBaseResult>({
    url: `/sms/${telephone}`
  })
}

export function checkPhoneIsExit(telephone: number | string) {
  return appRequest.get<IBaseResult>({
    url: `/user/login/checkPhone/${telephone}`
  })
}

export function checkPhoneIsExitNoMessage(telephone: number | string) {
  return appRequest.get<IBaseResult>({
    url: `/user/login/checkPhoneNoMessage/${telephone}`
  })
}
