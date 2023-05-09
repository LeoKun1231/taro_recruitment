/*
 * @Author: hqk
 * @Date: 2023-04-20 15:38:22
 * @LastEditors: hqk
 * @LastEditTime: 2023-04-25 14:36:33
 * @Description:
 */
import { EventEmitter } from 'ahooks/lib/useEventEmitter'
import { createContext } from 'react'

export const TimContext = createContext<any>(undefined)

export const DeleteEventContext = createContext<EventEmitter<any>>(undefined as any)
export const LoadEventContext = createContext<EventEmitter<any>>(undefined as any)
export const MessageEventContext = createContext<EventEmitter<any>>(undefined as any)
