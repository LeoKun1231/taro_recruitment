/*
 * @Author: hqk
 * @Date: 2023-02-12 18:50:10
 * @LastEditors: hqk
 * @LastEditTime: 2023-05-09 11:53:10
 * @Description:
 */
import { presetWeapp } from 'unocss-preset-weapp'
import { transformerClass } from 'unocss-preset-weapp/transformer'
import { defineConfig } from 'unocss'

export default defineConfig({
  presets: [
    // https://github.com/MellowCo/unocss-preset-weapp
    presetWeapp({
      isH5: process.env.TARO_ENV === 'h5',
      platform: 'taro',
      taroWebpack: 'webpack5',
      designWidth: 375,
      deviceRatio: {
        640: 2.34 / 2,
        750: 1,
        828: 1.81 / 2,
        375: 2
      }
    })
  ],
  shortcuts: [
    {
      'border-base': 'border border-gray-500/10',
      center: 'flex justify-center items-center',
      border: 'border-b-1px border-b-solid border-b-#f1f1f1',
      between: 'flex justify-between items-center',
      around: 'flex justify-around items-center'
    }
  ],

  transformers: [transformerClass()]
})
