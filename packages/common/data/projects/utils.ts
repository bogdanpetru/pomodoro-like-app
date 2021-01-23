import { last, addArray, nowInSeconds, isNumber } from '@app/utils'
import { CurrentStrawBerry, Strawberry } from '../interface'

export const getTimeLeft = (strawberry: Strawberry): number => {
  if (!strawberry) {
    return
  }
  if (!strawberry?.startTime.length) {
    return strawberry.size
  }

  const timeLeft =
    strawberry.size -
    ((strawberry?.timeSpent && addArray(strawberry.timeSpent)) || 0)

  const timeFromPreviousStart =
    strawberry.running && strawberry.startTime.length
      ? nowInSeconds() - last(strawberry.startTime)
      : 0

  return timeLeft - timeFromPreviousStart
}

export const getTimeLeftRatio = (strawberry: CurrentStrawBerry): number => {
  let timeSpentRatio: number = null
  if (isNumber(strawberry?.size) && isNumber(strawberry.time)) {
    timeSpentRatio = strawberry.time / strawberry?.size
  }
  return timeSpentRatio
}
