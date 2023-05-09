/*
 * @Author: hqk
 * @Date: 2023-04-17 17:21:10
 * @LastEditors: hqk
 * @LastEditTime: 2023-05-08 13:54:01
 * @Description:
 */
/// <reference types="@tarojs/taro" />

declare module '*.png'
declare module '*.gif'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.svg'
declare module '*.css'
declare module '*.less'
declare module '*.scss'
declare module '*.sass'
declare module '*.styl'

declare namespace NodeJS {
  interface ProcessEnv {
    TARO_ENV: 'weapp' | 'swan' | 'alipay' | 'h5' | 'rn' | 'tt' | 'quickapp' | 'qq' | 'jd'
  }
}
declare module 'prismjs'
