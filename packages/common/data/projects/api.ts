import firebase from 'firebase/app'
import 'firebase/firestore'
import invariant from 'invariant'

import { ProjectDescription, Project, Strawberry } from './interface'
import { mapProject, mapStrawberry } from './map'

const getDb = () => {
  return firebase.firestore()
}

export const getProjectsRef = () => {
  const db = getDb()
  const user = firebase.auth().currentUser
  return db.collection('users').doc(user.uid).collection('projects')
}

export const saveProject = async ({
  projectId,
  projectDetails,
}: {
  projectId?: string
  projectDetails: ProjectDescription
}): Promise<string> => {
  const docRef = getProjectsRef().doc(projectId)

  let editOrSaveSpecificData = null
  if (projectId) {
    editOrSaveSpecificData = {
      // TODO fix
      'currentStrawBerry.size': projectDetails.strawberrySize,
    }
  } else {
    editOrSaveSpecificData = {
      currentStrawBerry: {
        size: projectDetails.strawberrySize,
      },
    }
  }

  await docRef.set(
    {
      name: projectDetails.name,
      strawberrySize: projectDetails.strawberrySize,
      numberOfStrawberries: projectDetails.numberOfStrawberries,
      breakSize: projectDetails.breakSize,
      description: projectDetails.description,
      ...editOrSaveSpecificData,
    },
    { merge: true }
  )
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

export const getAllProjects = async (): Promise<Project[]> => {
  return (await getProjectsRef().get()).docs.map((item) =>
    mapProject({
      id: item.id,
      ...item.data(),
    })
  )
}

export const stopStrawberry = async (
  project: Project,
  strawberry: Strawberry
) => {
  const newStrawberry = mapStrawberry({
    size: project.strawberrySize,
  })

  const projectRef = getProjectsRef().doc(project.id)
  await projectRef.set(
    {
      currentStrawBerry: newStrawberry,
    },
    { merge: true }
  )
  await projectRef.collection('strawberries').doc().set(strawberry)

  return newStrawberry
}

export const startStrawberry = async (
  projectId: string,
  startTime: number
): Promise<number> => {
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

  return startTime
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
