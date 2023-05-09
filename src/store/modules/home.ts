import { useAppCreateAsyncThunk } from '@/hooks/useAppRedux'
import {
  getCompanyCategoryList,
  getHomeCompanyList,
  getHotCompanyList,
  getHomeJobList,
  getPhoneJobTypeList,
  getHotJobList,
  getJobListWithDetailType,
  getJobRelationList,
  getHomeCompanyDetail,
  getCompanyDetailType,
  getCompanyDetailJobList,
  addCompanyAndJobWatchCount,
  getHomeJobDetail,
  uploadResume,
  addResumeToJob,
  getHomeBannerList,
  registerChatUser,
  saveChatRecord,
  getResumeURL,
  checkIsChat,
  searchJob
} from '@/services'
import { IJobRelationQuery, IBasePage, IConversationList } from '@/types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export const getHotCompanyListAction = useAppCreateAsyncThunk('home/getHotCompanyList', async (payload: IBasePage) => {
  const res = await getHotCompanyList(payload)
  return res
})

export const getHotJobListAction = useAppCreateAsyncThunk('home/getHotJobList', async (payload: IBasePage) => {
  const res = await getHotJobList(payload)
  return res
})

export const getHomeCompanyListAction = useAppCreateAsyncThunk(
  'home/getHomeCompanyListv',
  async (payload: IBasePage & { category: string }) => {
    const res = await getHomeCompanyList(payload)
    return res
  }
)

export const getHomeJobListAction = useAppCreateAsyncThunk('home/getHomeJobList', async (payload: IBasePage & { type: string }) => {
  const res = await getHomeJobList(payload)
  return res
})

export const getCompanyCategoryAction = useAppCreateAsyncThunk('home/getCompanyCategory', async () => {
  const res = await getCompanyCategoryList()
  return res
})

export const getPhoneJobTypeListAction = useAppCreateAsyncThunk('home/getPhoneJobTypeList', async () => {
  const res = await getPhoneJobTypeList()
  return res
})

export const getJobListWithDetailTypeAction = useAppCreateAsyncThunk(
  'home/getJobListWithDetailType',
  async (payload: IBasePage & { type: string }) => {
    const res = await getJobListWithDetailType(payload)
    return res
  }
)

export const getJobRelationListAction = useAppCreateAsyncThunk('home/getJobRelationList', async (payload: IJobRelationQuery) => {
  const res = await getJobRelationList(payload)
  return res
})
export const getHomeCompanyDetailByIdAction = useAppCreateAsyncThunk('home/getHomeCompanyDetail', async (payload: string) => {
  const res = await getHomeCompanyDetail(payload)
  return res
})

export const getCompanyDetailTypeAction = useAppCreateAsyncThunk('home/getCompanyDetailType', async (payload: string) => {
  const res = await getCompanyDetailType(payload)
  return res
})

export const getCompanyDetailJobListAction = useAppCreateAsyncThunk(
  'home/getCompanyDetailJobList',
  async (payload: IBasePage & { type: string; companyId: string }) => {
    const res = await getCompanyDetailJobList(payload)
    return res
  }
)
export const addCompanyAndJobWatchCountAction = useAppCreateAsyncThunk(
  'home/addCompanyAndJobWatchCount',
  async (payload: { type: number; id: string }) => {
    const { id, type } = payload
    const res = await addCompanyAndJobWatchCount(id, type)
    return res
  }
)
export const getHomeJobDetailAction = useAppCreateAsyncThunk('home/getHomeJobDetail', async (payload: string) => {
  const res = await getHomeJobDetail(payload)
  return res
})
export const uploadResumeAction = useAppCreateAsyncThunk('home/uploadResume', async (payload: any) => {
  const res = await uploadResume(payload)
  return res
})

export const getHomeBannerListAction = useAppCreateAsyncThunk('home/getHomeBannerList', async () => {
  const res = await getHomeBannerList()
  return res
})
export const registerChatUserAction = useAppCreateAsyncThunk('home/getHomeBannerList', async (payload: { toId: number }) => {
  const res = await registerChatUser(payload)
  return res
})
export const addResumeToJobAction = useAppCreateAsyncThunk('home/addResumeToJob', async (payload: { jobId: string; userId: number }) => {
  const { jobId, userId } = payload
  const res = await addResumeToJob(jobId, userId)
  return res
})
export const saveChatRecordAction = useAppCreateAsyncThunk('home/saveChatRecord', async (payload: { jobId: string; userId: number }) => {
  const { jobId, userId } = payload
  const res = await saveChatRecord(userId, jobId)
  return res
})
export const checkIsChatAction = useAppCreateAsyncThunk('home/checkIsChat', async (payload: { jobId: string; userId: number }) => {
  const { jobId, userId } = payload
  const res = await checkIsChat(userId, jobId)
  return res
})

export const getResumeURLAction = useAppCreateAsyncThunk('home/getResumeURL', async () => {
  const res = await getResumeURL()
  return res
})
export const searchJobAction = useAppCreateAsyncThunk('home/searchJob', async (text: string) => {
  const res = await searchJob(text)
  return res
})

interface IState {}

const initialState = {} as IState

const homeSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    clearHomeAction(state) {
      state = {} as IState
    }
  }
})

export default homeSlice.reducer

export const { clearHomeAction } = homeSlice.actions
