/*
 * @Author: hqk
 * @Date: 2023-02-11 19:20:23
 * @LastEditors: hqk
 * @LastEditTime: 2023-02-12 11:09:28
 * @Description:
 */
import getBaseUrlAndTimeout from './config'
import AppRequest from './request'

const { BASE_URL, TIME_OUT } = getBaseUrlAndTimeout()
const appRequest = new AppRequest(BASE_URL, TIME_OUT)

export default appRequest
