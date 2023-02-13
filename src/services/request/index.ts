/*
 * @Author: hqk
 * @Date: 2023-02-11 19:20:32
 * @LastEditors: hqk
 * @LastEditTime: 2023-02-12 11:02:32
 * @Description:
 */

import Taro from '@tarojs/taro'

class AppRequest {
  constructor(private BASE_URL: string, private TIME_OUT: number) {}

  private interceptor(chain: Taro.Chain) {
    const requestParams = chain.requestParams
    Taro.showLoading({
      title: '加载中...',
    })
    let token = Taro.getStorageSync('token') //拿到本地缓存中存的token
    if (token) {
      requestParams.header = {
        ...requestParams.header,
        Authorization: 'Bearer ' + token, //将token添加到头部
      }
    }
    return chain
      .proceed(requestParams)
      .then((res) => {
        Taro.hideLoading()
        return res
      })
      .catch((err) => {
        Taro.hideLoading()
        console.error(err)
        return Promise.reject(err)
      })
  }

  request<T = any>(options: Taro.request.Option) {
    //判断url路径是否完整
    let url: string
    if (options.url.includes(this.BASE_URL)) {
      url = options.url
    } else {
      url = this.BASE_URL + options.url
    }

    //添加拦截器
    Taro.addInterceptor(this.interceptor)
    return new Promise<T>((resolve, reject) => {
      Taro.request({
        timeout: this.TIME_OUT,
        ...options,
        url,
        success(res) {
          resolve(res.data)
        },
        fail(err) {
          reject(err)
        },
      })
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
