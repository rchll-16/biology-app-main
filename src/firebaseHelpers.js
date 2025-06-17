// src/firebaseHelpers.js
import { ref, get, update, set } from 'firebase/database'
import { database } from './firebaseConfig'

export async function markLessonComplete(userId, lessonIndex) {
  if (!userId || userId === 'guest') return

  const userRef = ref(database, `users/${userId}`)
  const snapshot = await get(userRef)

  let completedLessons = []
  if (snapshot.exists() && snapshot.val().completedLessons) {
    completedLessons = snapshot.val().completedLessons
  }

  if (!completedLessons.includes(lessonIndex)) {
    completedLessons.push(lessonIndex)
    await update(userRef, { completedLessons })
  }
}

export async function updateLessonPoints(userId, lessonId, pointsToAdd) {
  if (!userId || userId === 'guest') return

  const pointsRef = ref(database, `users/${userId}/lessonPoints/${lessonId}`)
  const snapshot = await get(pointsRef)
  let currentPoints = 0
  if (snapshot.exists()) currentPoints = snapshot.val()

  await set(pointsRef, currentPoints + pointsToAdd) 
}
