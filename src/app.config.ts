/*
 * @Author: hqk
 * @Date: 2023-04-17 17:21:10
 * @LastEditors: hqk
 * @LastEditTime: 2023-05-15 10:56:06
 * @Description:
 */
export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/login/index',
    'pages/community/index',
    'pages/chat/index',
    'pages/resume/index',
    'pages/mine/index',
    'pages/profile/index',
    'pages/reset-password/index',
    'pages/chat-room/index',
    'pages/article-detail/index',
    'pages/company-detail/index',
    'pages/job-detail/index',
    'pages/search/index',
    'pages/topic-article/index',
    'pages/publish-article/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black',
    onReachBottomDistance: 100
  },
  tabBar: {
    custom: false,
    color: '#646566',
    selectedColor: '#007aff',
    backgroundColor: '#ffffff',
    list: [
      {
        pagePath: 'pages/home/index',
        selectedIconPath: 'assets/img/home_active.png',
        iconPath: 'assets/img/home.png',
        text: '首页'
      },
      {
        pagePath: 'pages/community/index',
        selectedIconPath: 'assets/img/community_active.png',
        iconPath: 'assets/img/community.png',
        text: '社区'
      },
      {
        pagePath: 'pages/chat/index',
        selectedIconPath: 'assets/img/chat_active.png',
        iconPath: 'assets/img/chat.png',
        text: '聊天'
      },
      {
        pagePath: 'pages/mine/index',
        selectedIconPath: 'assets/img/mine_active.png',
        iconPath: 'assets/img/mine.png',
        text: '我的'
      }
    ]
  }
})
