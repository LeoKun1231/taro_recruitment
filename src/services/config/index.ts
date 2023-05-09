/*
 * @Author: hqk
 * @Date: 2023-02-12 11:04:55
 * @LastEditors: hqk
 * @LastEditTime: 2023-02-12 11:09:52
 * @Description:
 */

const getBaseUrlAndTimeout = () => {
  let BASE_URL = ''
  const TIME_OUT = 60000
  if (process.env.NODE_ENV === 'development') {
    //开发环境 - 根据请求不同返回不同的BASE_URL
    BASE_URL = 'https://www.hqk10.xyz:8666'
  } else if (process.env.NODE_ENV === 'production') {
    // 生产环境
    BASE_URL = 'https://www.hqk10.xyz:8666'
  }
  return {
    BASE_URL,
    TIME_OUT
  }
}

export default getBaseUrlAndTimeout
