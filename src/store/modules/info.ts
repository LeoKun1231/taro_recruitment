/*
 * @Author: hqk
 * @Date: 2023-02-04 11:54:17
 * @LastEditors: hqk
 * @LastEditTime: 2023-02-04 13:37:27
 * @Description:
 */
import { useAppCreateAsyncThunk } from '@/hooks/useAppRedux'
import {
  getChattingJob,
  getMineArtilceById,
  resetPassowrdByPassword,
  resetPassowrdByTelephone,
  updateUserInfo,
  uploadAvatar
} from '@/services'
import { IBasePage } from '@/types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export const resetPassowrdByPasswordAction = useAppCreateAsyncThunk('info/resetPasswordByPassword', async (payload: any) => {
  const res = await resetPassowrdByPassword(payload)
  return res
})
export const resetPassowrdByTelephoneAction = useAppCreateAsyncThunk('info/resetPassowrdByTelephone', async (payload: any) => {
  const res = await resetPassowrdByTelephone(payload)
  return res
})
export const updateUserInfoAction = useAppCreateAsyncThunk('info/updateUserInfo', async (payload: any) => {
  const res = await updateUserInfo(payload)
  return res
})

export const getChattingJobListAction = useAppCreateAsyncThunk('info/getChattingJob', async (payload: IBasePage) => {
  const res = await getChattingJob(payload)
  return res
})
export const getMineArtilceByIdAction = useAppCreateAsyncThunk('info/getMineArtilceById', async (payload: IBasePage) => {
  const res = await getMineArtilceById(payload)
  return res
})
export const uploadAvatarAction = useAppCreateAsyncThunk('info/uploadAvatar', async (payload: any) => {
  const res = await uploadAvatar(payload)
  return res
})

interface IState {
  resumeURL: string
}

const initialState = {
  resumeURL: ''
} as IState

const infoSlice = createSlice({
  name: 'info',
  initialState,
  reducers: {
    changeResumeURLAction(state, { payload }: PayloadAction<string>) {
      state.resumeURL = payload
    }
  }
})

export default infoSlice.reducer
export const { changeResumeURLAction } = infoSlice.actions
