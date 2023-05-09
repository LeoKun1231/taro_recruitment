/*
 * @Author: hqk
 * @Date: 2023-02-11 19:20:32
 * @LastEditors: hqk
 * @LastEditTime: 2023-04-27 10:20:44
 * @Description:
 */

import Taro from '@tarojs/taro'
import store from '@/store'
import { error, success } from '@/utils'

class AppRequest {
  constructor(private BASE_URL: string, private TIME_OUT: number) {}

  request<T = any>(options: Taro.request.Option) {
    //判断url路径是否完整
    let url: string
    if (options.url.includes(this.BASE_URL)) {
      url = options.url
    } else {
      url = this.BASE_URL + options.url
    }
    Taro.showToast({
      title: '加载中...',
      icon: 'loading'
    })
    return new Promise<T>((resolve, reject) => {
      const token = store.getState().login?.loginUser?.token
      if (token) {
        Taro.request({
          timeout: this.TIME_OUT,
          mode: 'cors',
          ...options,
          header: {
            Authorization: 'Bearer ' + token //将token添加到头部
          },
          url,
          success(res) {
            const { data } = res
            Taro.hideToast({ noConflict: true })
            if ((data?.code == 20000 || data?.code == 500) && data?.message) {
              error(data.message)
            } else if (data?.code == 200 && data?.message) {
              //成功提示
              success(data.message)
            } else if (data.code == 30001) {
              Taro.showModal({
                content: '登录过期，请重新登录',
                showCancel: false,
                success() {
                  Taro.redirectTo({
                    url: '/pages/login/index'
                  })
                }
              })
            }
            resolve(res.data)
          },
          fail(err) {
            error('网络错误,请重试')
            reject(err)
          }
        })
      } else {
        Taro.request({
          timeout: this.TIME_OUT,
          mode: 'cors',
          ...options,
          url,
          success(res) {
            const { data } = res
            Taro.hideToast({ noConflict: true })
            if ((data?.code == 20000 || data?.code == 500) && data?.message) {
              error(data.message)
            } else if (data?.code == 200 && data?.message) {
              //成功提示
              success(data.message)
            } else if (data.code == 30001) {
              Taro.showModal({
                content: '登录过期，请重新登录',
                showCancel: false,
                success() {
                  Taro.redirectTo({
                    url: '/pages/login/index'
                  })
                }
              })
            }
            resolve(res.data)
          },
          fail(err) {
            error('网络错误,请重试')
            reject(err)
          }
        })
      }
    })
  }
  get<T = any>(options: Taro.request.Option) {
    return this.request<T>({ ...options, method: 'GET' })
  }
  post<T = any>(options: Taro.request.Option) {
    return this.request<T>({ ...options, method: 'POST' })
  }
  delete<T = any>(options: Taro.request.Option) {
    return this.request<T>({ ...options, method: 'DELETE' })
  }
  put<T = any>(options: Taro.request.Option) {
    return this.request<T>({ ...options, method: 'PUT' })
  }
}

export default AppRequest
