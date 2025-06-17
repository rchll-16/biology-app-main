import { ref, get, update } from 'firebase/database'
import { database } from '../../firebaseConfig'

export const markLessonComplete = async (userId, lessonIndex) => {
  const userRef = ref(database, `users/${userId}`)
  const snapshot = await get(userRef)

  let completedLessons = []
  if (snapshot.exists() && snapshot.val().completedLessons) {
    completedLessons = snapshot.val().completedLessons
  }

  // Prevent duplicate completion
  if (!completedLessons.includes(lessonIndex)) {
    completedLessons.push(lessonIndex)
    await update(userRef, { completedLessons })
  }

  return true // for redirect handling
}

export const hasCompletedLesson = async (userId, lessonIndex) => {
  const snapshot = await get(ref(database, `users/${userId}/completedLessons`))
  if (snapshot.exists()) {
    const completedLessons = snapshot.val()
    return completedLessons.includes(lessonIndex)
  }
  return false
}
