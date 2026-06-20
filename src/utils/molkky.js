// Core Mölkky scoring rules shared by the live score-entry screen.

export function createEmptySetState(startingTurn = 'me') {
  return {
    scores: { me: 0, opponent: 0 },
    turn: startingTurn,
    missStreak: { me: 0, opponent: 0 },
    throwCount: { me: 0, opponent: 0 },
    throws: [],
    winner: null,
  }
}

// Applies one throw (1-12, or 0 for a miss) to the given set state and
// returns a brand new state object (the input is never mutated).
export function applyThrow(state, value) {
  if (state.winner) return state

  const player = state.turn
  const opponent = player === 'me' ? 'opponent' : 'me'
  const scores = { ...state.scores }
  const missStreak = { ...state.missStreak }
  const throwCount = { ...state.throwCount }
  let winner = null
  let resultLabel = ''

  if (value === 0) {
    missStreak[player] += 1
    if (missStreak[player] >= 3) {
      winner = opponent
      scores[player] = 0
      resultLabel = '3連続ミスで失格'
    }
  } else {
    missStreak[player] = 0
    const raw = scores[player] + value
    if (raw === 50) {
      scores[player] = 50
      winner = player
      resultLabel = '50点ちょうど！セット勝利'
    } else if (raw > 50) {
      scores[player] = 25
      resultLabel = '50点超過のため25点へ'
    } else {
      scores[player] = raw
    }
  }

  throwCount[player] += 1

  const throwEntry = {
    player,
    value,
    cumulative: scores[player],
    note: resultLabel,
    throwNumber: state.throws.length + 1,
    round: throwCount[player], // this player's Nth throw — used to build the turn-by-turn table
    missStreakAfter: missStreak[player],
  }

  return {
    scores,
    turn: opponent,
    missStreak,
    throwCount,
    throws: [...state.throws, throwEntry],
    winner,
  }
}

// Builds rows like { round, me: {value, cumulative} | null, opponent: {...} | null }
// for rendering a turn-by-turn table similar to the official scoresheet.
export function buildRoundRows(throws) {
  const rows = {}
  for (const t of throws) {
    if (!rows[t.round]) rows[t.round] = { round: t.round, me: null, opponent: null }
    rows[t.round][t.player] = { value: t.value, cumulative: t.cumulative }
  }
  return Object.values(rows).sort((a, b) => a.round - b.round)
}

export function pointsForMatch(setScore, opponentNoTitle) {
  // setScore is from the user's perspective, e.g. { me: 2, opponent: 1 }
  const { me, opponent } = setScore
  const result = me > opponent ? 'win' : 'lose'
  let points = 0

  if (result === 'win') {
    points = 1
  } else {
    points = -1
    if (opponent === 2 && me === 0) {
      points -= 1 // 2タテ負け
    }
    if (opponentNoTitle) {
      points -= 1
    }
  }

  return { result, points }
}

export function scoreLabel(setScore) {
  return `${setScore.me}-${setScore.opponent}`
}

// Decides who throws first in the next set.
// Set 1: manual (provided by the caller). Set 2: swap from set 1.
// Set 3: whoever scored more combined points across sets 1+2; tie -> manual.
export function decideNextStartingTurn(setIndex, completedSets, manualChoice) {
  if (setIndex === 0) return manualChoice || 'me'
  if (setIndex === 1) return completedSets[0].startingTurn === 'me' ? 'opponent' : 'me'

  const totals = { me: 0, opponent: 0 }
  for (const s of completedSets) {
    totals.me += s.finalScores.me
    totals.opponent += s.finalScores.opponent
  }
  if (totals.me === totals.opponent) return manualChoice || 'me'
  return totals.me > totals.opponent ? 'me' : 'opponent'
}
