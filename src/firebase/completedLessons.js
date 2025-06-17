import { ref, get, update } from 'firebase/database'
import { database } from '../../firebaseConfig'

export async function markLessonComplete(userId, lessonIndex, completed = true) {
  const userRef = ref(database, `users/${userId}`)

  try {
    const snapshot = await get(userRef)

    if (!snapshot.exists()) {
      console.error('User not found.')
      return
    }

    const userData = snapshot.val()
    const completedLessons = userData.completedLessons || []
    const unlockedLessons = userData.unlockedLessons || {}
    const lessonPoints = userData.lessonPoints || {}
    let totalPoints = userData.totalPoints || 0

    if (completed && !completedLessons.includes(lessonIndex)) {
      completedLessons.push(lessonIndex)
      unlockedLessons[lessonIndex + 1] = true
      // Add some default points or customize as needed
      const pointsEarned = 10
      lessonPoints[lessonIndex] = pointsEarned
      totalPoints += pointsEarned
    }

    await update(userRef, {
      completedLessons,
      unlockedLessons,
      lessonPoints,
      totalPoints
    })

    console.log(`Lesson ${lessonIndex} complete for ${userId}.`)
  } catch (error) {
    console.error('Error saving lesson completion:', error)
  }
}

