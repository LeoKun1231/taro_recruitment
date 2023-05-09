/*
 * @Author: hqk
 * @Date: 2023-02-26 16:44:50
 * @LastEditors: hqk
 * @LastEditTime: 2023-03-24 13:50:00
 * @Description:
 */
import appRequest from '@/services'
import { IMajorNoTreeData, IMajorTreeData, IUpload } from '@/types/common'

export function getMajorNoTreeList() {
  return appRequest.get<IMajorNoTreeData>({
    url: '/acl/major/noTreeList'
  })
}

export function upload(data: any) {
  return appRequest.post<IUpload>({
    url: '/oss/upload',
    data
  })
}

export function getMajorTreeList(id: number) {
  return appRequest.get<IMajorTreeData>({
    url: `/acl/major/list/${id}`
  })
}

export function getAllMajorTreeList() {
  return appRequest.get<IMajorTreeData>({
    url: '/acl/major/list'
  })
}
