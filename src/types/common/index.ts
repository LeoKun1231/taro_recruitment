import { IBaseResult } from '../base'

export interface IMajorNoTree {
  majorName: string
  id: number
}

export interface IMajorNoTreeData extends IBaseResult {
  data: {
    list: IMajorNoTree[]
  }
}

export interface IUpload extends IBaseResult {
  data: {
    url: string
    fileName: string
  }
}

export interface IMajorTreeData extends IBaseResult {
  data: ITree[]
}

export interface ITree {
  value: number
  title: string
  children?: ITree[]
}
