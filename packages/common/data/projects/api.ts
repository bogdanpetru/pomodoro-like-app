import firebase from 'firebase/app'
import 'firebase/firestore'
import invariant from 'invariant'

import { ProjectDescription, Project, CurrentStrawBerry } from '../interface'

import { mapProject, mapStrawberry } from './map'

const getDb = () => firebase.firestore()

export const getProjectsRef = () => {
  const db = getDb()
  const user = firebase.auth().currentUser

  if (!user) {
    throw new Error('user not logged in')
  }

  return db.collection('users').doc(user?.uid).collection('projects')
}

export const saveProject = async (
  projectId: string = null,
  projectDetails?: ProjectDescription
): Promise<string> => {
  const docRef = getProjectsRef().doc(projectId || void 0)

  const commonData = {
    name: projectDetails.name,
    strawberrySize: projectDetails.strawberrySize,
    numberOfStrawberries: projectDetails.numberOfStrawberries,
    breakSize: projectDetails.breakSize,
    description: projectDetails.description,
  }

  if (projectId) {
    await docRef.update(commonData)
  } else {
    await docRef.set({
      ...commonData,
      currentStrawBerry: {
        size: projectDetails.strawberrySize,
      },
    })
  }

  return docRef.id
}

export const deleteProject = (projectId: string) =>
  getProjectsRef().doc(projectId).delete()

export const getProject = async (projectId: string): Promise<Project> => {
  const docRef = getProjectsRef()
  const project = (await docRef.doc(projectId).get()).data()

  if (!project) {
    throw new Error(`Could not find project with id ${projectId}`)
  }

  return mapProject({ ...project, id: projectId })
}

export const getProjects = async (): Promise<Project[]> => {
  return (await getProjectsRef().get()).docs.map((item) =>
    mapProject({
      id: item.id,
      ...item.data(),
    })
  )
}

export const setCurrentStrawberry = async (
  projectId: string,
  strawberry: CurrentStrawBerry
) => {
  const projectRef = getProjectsRef().doc(projectId)
  await projectRef.set(
    {
      currentStrawBerry: strawberry,
    },
    { merge: true }
  )

  return strawberry
}

export const archiveStrawberry = async (
  projectId: string,
  strawberry: CurrentStrawBerry
) =>
  getProjectsRef()
    .doc(projectId)
    .collection('strawberries')
    .doc()
    .set(strawberry)

export const updateProject = (project: Project): Promise<void> => {
  const projectRef = getProjectsRef().doc(project.id)
  return projectRef.update(project)
}

export const startStrawberry = async (
  projectId: string,
  startTime: number
): Promise<void> => {
  invariant(projectId, 'cannot start a interval without a project-id')

  await getProjectsRef()
    .doc(projectId)
    .set(
      {
        currentStrawBerry: {
          running: true,
          startTime: firebase.firestore.FieldValue.arrayUnion(startTime),
        },
      },
      { merge: true }
    )
}

export const pauseStrawberry = async (projectId: string, timeSpent: number) => {
  invariant(projectId, 'cannot start a interval without a project-id')

  await getProjectsRef()
    .doc(projectId)
    .set(
      {
        currentStrawBerry: {
          running: false,
          timeSpent: firebase.firestore.FieldValue.arrayUnion(timeSpent),
        },
      },
      { merge: true }
    )
}
