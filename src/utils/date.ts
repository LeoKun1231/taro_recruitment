/*
 * @Author: hqk
 * @Date: 2023-04-20 17:30:19
 * @LastEditors: hqk
 * @LastEditTime: 2023-05-08 13:29:16
 * @Description:
 */
import dayjs from 'dayjs'
import * as isLeapYear from 'dayjs/plugin/isLeapYear' // 导入插件
import 'dayjs/locale/zh-cn' // 导入本地化语言
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(isLeapYear) // 使用插件
dayjs.extend(relativeTime)
dayjs.locale('zh-cn') // 使用本地化语言

export const timeago = (date: any) => {
  return dayjs(date).fromNow()
}
