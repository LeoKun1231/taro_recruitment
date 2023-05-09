/*
 * @Author: hqk
 * @Date: 2023-03-05 15:44:31
 * @LastEditors: hqk
 * @LastEditTime: 2023-04-25 21:49:44
 * @Description:
 */
import { useAppCreateAsyncThunk } from '@/hooks'
import {
  addArticleWatchCount,
  addComment,
  cancelLike,
  deleteArticleById,
  deleteCommentById,
  doLike,
  getArticleDetailById,
  getArticleList,
  getArticleRelationById,
  getCommentList,
  getMoreCommentList,
  getSearchResult,
  getTopicDetail,
  getTopicList,
  publishArticle,
  reportById
} from '@/services'
import { IAddComment, IArticleDetailData, IArticlePageQuery, ICommentQuery, ILike, IReport, ITopicContent } from '@/types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface IState {}

export const getArtcleListAction = useAppCreateAsyncThunk('community/getArticle', async (payload: IArticlePageQuery) => {
  const { currentPage, pageSize, typedId, userId, topicId } = payload
  const res = await getArticleList({ currentPage, pageSize, typedId, userId, topicId })
  return res
})

export const saveLikeAction = useAppCreateAsyncThunk('community/saveLike', async (payload: ILike) => {
  const res = await doLike(payload)
  return res
})
export const saveCancelLikeAction = useAppCreateAsyncThunk('community/cancelLike', async (payload: ILike) => {
  const res = await cancelLike(payload)
  return res
})

export const getArticleSearchResultAction = useAppCreateAsyncThunk('community/getArticleSearchResult', async (payload: string) => {
  const res = await getSearchResult(payload)
  return res
})
export const getArticleDetailAction = useAppCreateAsyncThunk('community/getArticleDetail', async (payload: string) => {
  const res = await getArticleDetailById(payload)
  return res
})
export const getArticleRelationAction = useAppCreateAsyncThunk('community/getArticleRelation', async (payload: string) => {
  const res = await getArticleRelationById(payload)
  return res
})
export const getCommentListAction = useAppCreateAsyncThunk('community/getCommentList', async (payload: ICommentQuery) => {
  const res = await getCommentList(payload)
  return res
})

export const addCommentAction = useAppCreateAsyncThunk('community/addComment', async (payload: IAddComment) => {
  const res = await addComment(payload)
  return res
})

export const getMoreCommentAction = useAppCreateAsyncThunk(
  'community/getMoreComment',
  async (payload: Pick<ICommentQuery, 'articleId' | 'rootId' | 'userId'>) => {
    const res = await getMoreCommentList(payload)
    return res
  }
)

export const deleteCommentByIdAction = useAppCreateAsyncThunk('common/deleteComment', async (payload: number) => {
  const res = await deleteCommentById(payload)
  return res
})

export const addWatchCountAction = useAppCreateAsyncThunk('community/addWatchCount', async (payload: string) => {
  await addArticleWatchCount(payload)
})

export const deleteArticleByIdAction = useAppCreateAsyncThunk('community/deleteArticle', async (payload: string) => {
  const res = await deleteArticleById(payload)
  return res
})

export const reportByIdAction = useAppCreateAsyncThunk('community/report', async (payload: { data: IReport; page: string }) => {
  const { data, page } = payload
  const res = await reportById(page, data)
  return res
})

export const getTopicDetailAction = useAppCreateAsyncThunk('community/getTopicDetail', async (payload: number) => {
  const res = await getTopicDetail(payload)
  return res
})

export const getTopicListAction = useAppCreateAsyncThunk(
  'community/topicList',
  async (payload: { currentPage: number; pageSize: number }) => {
    const res = await getTopicList(payload)
    return res
  }
)

export const publishArticleAction = useAppCreateAsyncThunk('community/addArticle', async (payload: ITopicContent) => {
  const res = await publishArticle(payload)
  return res
})

const initialState = {} as IState

export const communitySlice = createSlice({
  name: 'community',
  initialState,
  reducers: {}
})

export const {} = communitySlice.actions
export default communitySlice.reducer
