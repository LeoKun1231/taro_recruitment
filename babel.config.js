/*
 * @Author: hqk
 * @Date: 2023-02-13 11:06:53
 * @LastEditors: hqk
 * @LastEditTime: 2023-02-13 11:45:35
 * @Description:
 */
// babel-preset-taro 更多选项和默认值：
// https://github.com/NervJS/taro/blob/next/packages/babel-preset-taro/README.md
module.exports = {
  presets: [
    [
      'taro',
      {
        framework: 'react',
        ts: true,
      },
    ],
  ],
  plugins: [
    [
      'import',
      {
        libraryName: '@nutui/nutui-react-taro',
        libraryDirectory: 'dist/esm',
        style: true,
        camel2DashComponentName: false,
      },
      'nutui-react-taro',
    ],
  ],
}
