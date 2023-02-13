/*
 * @Author: hqk
 * @Date: 2023-02-12 18:50:10
 * @LastEditors: hqk
 * @LastEditTime: 2023-02-12 21:21:31
 * @Description:
 */
import { presetWeapp } from 'unocss-preset-weapp'
import { transformerAttributify, transformerClass } from 'unocss-preset-weapp/transformer'
import { defineConfig } from 'unocss'

export default defineConfig({
  presets: [
    // https://github.com/MellowCo/unocss-preset-weapp
    presetWeapp({
      isH5: process.env.TARO_ENV === 'h5',
      platform: 'taro',
      taroWebpack: 'webpack5',
    }),
  ],
  shortcuts: [
    {
      'border-base': 'border border-gray-500/10',
      center: 'flex justify-center items-center',
    },
  ],

  transformers: [transformerAttributify(), transformerClass()],
})
