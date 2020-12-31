export enum StrawberryType {
  STRAWBERRY_TYPE_INTERVAL = 'STRAWBERRY_TYPE_INTERVAL',
  STRAWBERRY_TYPE_PAUSE = 'STRAWBERRY_TYPE_INTERVAL',
}

export interface StrawberryConfig {
  size: number
  timeSpent?: number[]
  startTime?: number[]
  running?: boolean
  notes?: string
  name?: string
  finished?: boolean
  type?: StrawberryType
}

export interface Strawberry extends StrawberryConfig {
  id: string
}

export interface ProjectDescription {
  name: string
  strawberrySize: number
  breakSize?: number
  description?: string
  numberOfStrawberries?: number
  strawberries?: Strawberry[]
  currentStrawBerry?: Strawberry
  statistics: {
    totalStrawberries: number
  }
}

export interface Project extends ProjectDescription {
  id: string
}
