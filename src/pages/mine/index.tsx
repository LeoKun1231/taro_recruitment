import React, { memo } from 'react'
import type { FC, ReactNode } from 'react'
import { View } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import { Button, Cell, Dialog, Icon, Image, Popup } from '@antmjs/vantui'
import { useAppDispatch, useAppSelector, useAppShallowEqual } from '@/hooks'
import { ROLECODE } from '@/constant'
import { useMemoizedFn, useSafeState } from 'ahooks'
import UserEdit from '@/assets/img/user_edit.svg'
import { clearAllAction } from '@/store'
import { error } from '@/utils'
import ChatRecord from '@/components/AppMine/ChatRecord'
import PublishArticle from '@/components/AppMine/PublishArticle'
import { changeSelectedAction } from '@/store/modules/tabbar'

import styled from './index.module.scss'

interface IProps {
  children?: ReactNode
}
const getRoleName = (roleId: number) => {
  let roleName: string = ''
  switch (roleId) {
    case ROLECODE.ADMIN:
      roleName = '管理员'
      break
    case ROLECODE.BOSS:
      roleName = 'Boss'
      break
    case ROLECODE.TEACHER:
      roleName = '老师'
      break
    case ROLECODE.STUDENT:
      roleName = '学生'
      break
    case ROLECODE.HR:
      roleName = 'HR'
      break
    default:
      break
  }
  return roleName
}

const Mine: FC<IProps> = () => {
  const [onChatShow, setOnChatShow] = useSafeState(false)
  const [onMineArticleShow, setOnMineArticleShow] = useSafeState(false)

  const { loginUser } = useAppSelector((state) => {
    return {
      loginUser: state.login.loginUser
    }
  }, useAppShallowEqual)

  const dispatch = useAppDispatch()

  /**
   * 前往个人资料修改页
   */
  const handleGoToProfile = useMemoizedFn(() => {
    Taro.navigateTo({
      url: '/pages/profile/index'
    })
  })

  const handleLogout = useMemoizedFn(() => {
    Taro.showModal({
      title: '退出登录提醒',
      content: '您是否确定退出登录',
      showCancel: true,
      success: ({ confirm }) => {
        if (confirm) {
          Taro.clearStorage()
          dispatch(clearAllAction())
          Taro.redirectTo({
            url: '/pages/login/index'
          })
        }
      }
    })
  })

  const handleGoToPassword = useMemoizedFn(() => {
    if (!loginUser.telephone || loginUser.telephone == '') {
      error('请先绑定手机号')
      return
    }
    Taro.navigateTo({
      url: '/pages/reset-password/index'
    })
  })

  const onChatShowClose = useMemoizedFn(() => {
    setOnChatShow(false)
    Taro.showTabBar()
  })

  const handleChatShow = useMemoizedFn(() => {
    setOnChatShow(true)
    Taro.hideTabBar()
  })
  const onMineArticleClose = useMemoizedFn(() => {
    setOnMineArticleShow(false)
    Taro.showTabBar()
  })

  const handleOnMineArticleShow = useMemoizedFn(() => {
    setOnMineArticleShow(true)
    Taro.hideTabBar()
  })
  useDidShow(() => {
    dispatch(changeSelectedAction(3))
  })

  return (
    <View className={styled.mine}>
      <Image src={UserEdit} width={32} height={32} className="!absolute right-20px top-20px" onClick={handleGoToProfile}></Image>
      <View className={styled.circle}></View>
      <View className="px-16px">
        <View className="bg-white mt-[-120px] h-180px shadow-lg rounded-[12px]">
          <View className="center">
            {!loginUser.avatar ? (
              <Icon name="user-circle-o" className=" mt-[-40px] shadow rounded-full bg-white text-#007aff" size={80} />
            ) : (
              <View>
                <Image src={loginUser.avatar} round width={80} height={80} className=" mt-[-40px] shadow" />
              </View>
            )}
          </View>
          <View className="mt-16px text-center  text-24px w-[240px] m-auto">
            <View className="truncate">{loginUser.nickName}</View>
          </View>
          <View className="center mt-10px">
            <View className="text-[#999] mr-4px">姓名 :</View>
            <View className="text-[#999] mr-4px">{loginUser.userName}</View>
            <View className="text-[#999] mr-4px">角色 :</View>
            <View className="text-[#999] mr-4px">{getRoleName(loginUser.roleId)}</View>
          </View>
          {loginUser.telephone && (
            <View className="center mt-10px">
              <View className="text-[#999] mr-4px">手机号 :</View>
              <View className="text-[#999]">{loginUser.telephone}</View>
            </View>
          )}
        </View>
        <View className="mt-20px shadow-lg">
          {ROLECODE.STUDENT == loginUser.roleId && (
            <>
              <Cell
                renderIcon={<Icon name="description" className="mr-4px" color="#007aff" size={16} />}
                title="我的简历"
                isLink
                url="/pages/resume/index"
              />
              <Cell
                renderIcon={<Icon name="chat-o" className="mr-4px" color="#007aff" size={16} />}
                title="我沟通过岗位"
                isLink
                onClick={handleChatShow}
              />
            </>
          )}
          <Cell
            renderIcon={<Icon name="comment-o" className="mr-4px" color="#007aff" size={16} />}
            title="我发表的文章"
            isLink
            onClick={handleOnMineArticleShow}
          />
          <Cell
            renderIcon={<Icon name="setting-o" className="mr-4px" color="#007aff" size={16} />}
            title="帐号管理"
            isLink
            onClick={handleGoToPassword}
          />
        </View>
        <View className="mt-30px  mb-30px">
          <Button block type="primary" onClick={handleLogout}>
            退出登录
          </Button>
        </View>
      </View>
      <Popup show={onChatShow} onClose={onChatShowClose} position="right">
        <ChatRecord onClose={onChatShowClose} />
      </Popup>
      <Popup show={onMineArticleShow} onClose={onMineArticleClose} position="right">
        <PublishArticle onClose={onMineArticleClose} />
      </Popup>
    </View>
  )
}

export default memo(Mine)
