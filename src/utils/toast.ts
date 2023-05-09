import Taro from '@tarojs/taro'

export function error(title: string) {
  Taro.showToast({
    title,
    icon: 'error',
    duration: 3000
  })
}

export function success(title: string) {
  Taro.showToast({
    title,
    icon: 'success',
    duration: 1500
  })
}
