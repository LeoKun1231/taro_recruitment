/*
 * @Author: hqk
 * @Date: 2023-04-17 17:21:10
 * @LastEditors: hqk
 * @LastEditTime: 2023-04-19 22:18:54
 * @Description:
 */
import path from 'path'
import UnoCSS from 'unocss/webpack'

const config = {
  projectName: 'taro_react_template',
  date: '2023-2-13',
  designWidth(input) {
    if (input.file?.replace(/\\+/g, '/').indexOf('@antmjs/vantui') > -1) {
      return 750
    }
    return 375
  },
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2,
    375: 2
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  alias: {
    '@': path.resolve(__dirname, '..', 'src')
  },
  // 使用pxconfig，忽略对组件库的单位的转换。
  defineConstants: {},
  copy: {
    patterns: [],
    options: {}
  },
  framework: 'react',
  compiler: 'webpack5',
  cache: {
    enable: false // Webpack 持久化缓存配置，建议开启。默认配置请参考：https://docs.taro.zone/docs/config-detail#cache
  },
  mini: {
    postcss: {
      pxtransform: {
        enable: true,
        config: {}
      },
      url: {
        enable: true,
        config: {
          limit: 1024 // 设定转换尺寸上限
        }
      },
      cssModules: {
        enable: true, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    },
    // 合并webpack配置
    webpackChain(chain) {
      // https://github.com/unocss/unocss
      chain.plugin('unocss').use(UnoCSS())
    },
    miniCssExtractPluginOption: {
      ignoreOrder: true
    }
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    esnextModules: [/@antmjs[\\/]vantui/, 'prismjs'],
    postcss: {
      autoprefixer: {
        enable: true,
        config: {}
      },
      pxtransform: {
        enable: true,
        config: {}
      },
      cssModules: {
        enable: true, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    },
    // 合并webpack配置
    webpackChain(chain) {
      // https://github.com/unocss/unocss
      chain.plugin('unocss').use(UnoCSS())
    },
    devServer: {
      host: '0.0.0.0',
      hot: false
    }
  },
  rn: {
    appName: 'taroDemo',
    postcss: {
      cssModules: {
        enable: false // 默认为 false，如需使用 css modules 功能，则设为 true
      }
    }
  }
}

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'))
  }
  return merge({}, config, require('./prod'))
}
