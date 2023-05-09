/*
 * @Author: hqk
 * @Date: 2023-04-18 16:26:13
 * @LastEditors: hqk
 * @LastEditTime: 2023-04-23 21:10:20
 * @Description:
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { useAppCreateAsyncThunk } from '@/hooks/useAppRedux'
import { clearHomeAction } from './home'
import { clearLoginAction } from './login'
import { clearChatAction } from './chat'
import { clearTabBarAction } from './tabbar'

interface IJobInfo {
  jobName: string
  hrId: number
  show: boolean
  jobId: string
  userId: number
}

interface IState {
  jobInfo: IJobInfo
}

const initialState = {
  jobInfo: {
    jobName: '',
    hrId: 0,
    show: false,
    jobId: '',
    userId: 0
  }
} as IState

export const clearAllAction = useAppCreateAsyncThunk('common/clearAll', (_, { dispatch }) => {
  dispatch(clearCommonAction())
  dispatch(clearHomeAction())
  dispatch(clearLoginAction())
  dispatch(clearChatAction())
  dispatch(clearTabBarAction())
})

export const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    changeJobInfoAction(state, { payload }: PayloadAction<IJobInfo>) {
      state.jobInfo = payload
    },
    clearCommonAction(state) {
      state.jobInfo = {} as IJobInfo
    }
  }
})

export const { changeJobInfoAction, clearCommonAction } = commonSlice.actions
export default commonSlice.reducer
