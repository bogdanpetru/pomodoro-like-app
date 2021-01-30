import { Project } from '@app/data/interface'
import * as api from '@app/data/api'

import { State } from '../state'
import { ActionTypes, Action } from '../actions'

import { startMonitoring } from './monitoring'

/**
 * TODO:
 * - so everything works ok when network is ok and firebase is up and running
 * - what happens when something fails?
 *  - implement a way to retry
 *  - while offline, or failed requests should accumulate
 *  - maybe mark data that has been updated? is dirty
 */

export const initializeData = (
  dispatch: React.Dispatch<Action>,
  getState: () => State
) => async (): Promise<Project[]> => {
  const state = getState()
  if (state.projects.list?.length) {
    return []
  }

  const projects = await api.getProjects()

  dispatch({
    type: ActionTypes.SET_PROJECTS,
    projects: projects,
  })

  startMonitoring(dispatch, getState)

  return projects
}
