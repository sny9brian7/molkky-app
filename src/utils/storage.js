import { collection, deleteDoc, doc, onSnapshot, orderBy, query, setDoc, writeBatch } from 'firebase/firestore'
import { db } from './firebase.js'

const matchesRef = collection(db, 'matches')

// Subscribes to live updates from Firestore so every open browser/device stays
// in sync automatically. Returns an unsubscribe function.
export function subscribeMatches(callback) {
  const q = query(matchesRef, orderBy('date', 'desc'))
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map((d) => d.data()))
  })
}

export async function addMatch(match) {
  await setDoc(doc(matchesRef, match.id), match)
}

export async function deleteMatch(id) {
  await deleteDoc(doc(matchesRef, id))
}

export async function clearMatches(matches) {
  const batch = writeBatch(db)
  for (const m of matches) {
    batch.delete(doc(matchesRef, m.id))
  }
  await batch.commit()
}

export function getStats(matches) {
  const totalPoints = matches.reduce((sum, m) => sum + m.pointsDelta, 0)
  const wins = matches.filter((m) => m.result === 'win').length
  const losses = matches.filter((m) => m.result === 'lose').length
  return { totalPoints, wins, losses }
}
