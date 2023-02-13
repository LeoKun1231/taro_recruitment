/*
 * @Author: hqk
 * @Date: 2023-02-12 15:46:45
 * @LastEditors: hqk
 * @LastEditTime: 2023-02-12 15:49:11
 * @Description:
 */
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '@/store'

// Use throughout your app instead of plain `useDispatch` and `useSelector`
type DispatchFunc = () => AppDispatch
export const useAppDispatch: DispatchFunc = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
