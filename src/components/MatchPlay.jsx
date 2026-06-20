import { useState } from 'react'
import {
  createEmptySetState,
  applyThrow,
  pointsForMatch,
  decideNextStartingTurn,
} from '../utils/molkky.js'
import RoundTable from './RoundTable.jsx'
import { useTheme } from '../theme/ThemeContext.jsx'

const NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
const GOLD = '#facc15'
const MISS_RED = '#f43f5e'

function MissDots({ count }) {
  return (
    <div className="flex justify-center gap-1 mt-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2.5 h-2.5 rounded-full transition-colors"
          style={
            i < count
              ? { background: MISS_RED, boxShadow: `0 0 6px ${MISS_RED}` }
              : { background: 'rgba(148,163,184,0.3)' }
          }
        />
      ))}
    </div>
  )
}

function SetDots({ count }) {
  return (
    <div className="flex justify-center gap-1">
      {[0, 1].map((i) => (
        <span
          key={i}
          className="text-base leading-none"
          style={
            i < count
              ? { color: GOLD, textShadow: `0 0 8px ${GOLD}` }
              : { color: 'rgba(148,163,184,0.35)' }
          }
        >
          {i < count ? '★' : '☆'}
        </span>
      ))}
    </div>
  )
}

export default function MatchPlay({ opponentName, opponentNoTitle, firstServer, onFinish, onCancel }) {
  const { theme } = useTheme()
  const [completedSets, setCompletedSets] = useState([]) // [{ winner, throws, finalScores, startingTurn }]
  const [setState, setSetState] = useState(createEmptySetState(firstServer))
  const [startingTurn, setStartingTurn] = useState(firstServer)
  const [history, setHistory] = useState([]) // undo stack of previous setState snapshots
  const [subview, setSubview] = useState('play') // play | setEnd | chooseServer | matchEnd
  const [matchResult, setMatchResult] = useState(null)

  const setWins = {
    me: completedSets.filter((s) => s.winner === 'me').length,
    opponent: completedSets.filter((s) => s.winner === 'opponent').length,
  }

  const currentSetNumber = completedSets.length + 1

  function commitThrow(value) {
    if (setState.winner || subview !== 'play') return
    setHistory((h) => [...h, setState])
    const next = applyThrow(setState, value)
    setSetState(next)
    if (next.winner) {
      setSubview('setEnd')
    }
  }

  function undoToPlay() {
    if (history.length === 0) return
    const prev = history[history.length - 1]
    setHistory((h) => h.slice(0, -1))
    setSetState(prev)
    setSubview('play')
  }

  function proceedAfterSet() {
    const finishedSet = {
      winner: setState.winner,
      throws: setState.throws,
      finalScores: setState.scores,
      startingTurn,
    }
    const newCompleted = [...completedSets, finishedSet]
    setCompletedSets(newCompleted)
    setHistory([])

    const wins = {
      me: newCompleted.filter((s) => s.winner === 'me').length,
      opponent: newCompleted.filter((s) => s.winner === 'opponent').length,
    }

    if (wins.me === 2 || wins.opponent === 2) {
      const finalSetScore = { me: wins.me, opponent: wins.opponent }
      const { result, points } = pointsForMatch(finalSetScore, opponentNoTitle)
      setMatchResult({
        sets: newCompleted,
        finalSetScore,
        result,
        points,
      })
      setSubview('matchEnd')
      return
    }

    const totals = { me: 0, opponent: 0 }
    for (const s of newCompleted) {
      totals.me += s.finalScores.me
      totals.opponent += s.finalScores.opponent
    }
    const isThirdSet = newCompleted.length === 2
    const tied = totals.me === totals.opponent

    if (isThirdSet && tied) {
      setSubview('chooseServer')
      return
    }

    const next = decideNextStartingTurn(newCompleted.length, newCompleted, null)
    beginNextSet(next)
  }

  function beginNextSet(turn) {
    setStartingTurn(turn)
    setSetState(createEmptySetState(turn))
    setSubview('play')
  }

  function confirmMatch() {
    onFinish({
      id: `${Date.now()}`,
      date: new Date().toISOString(),
      opponentName,
      opponentNoTitle,
      sets: matchResult.sets,
      finalSetScore: matchResult.finalSetScore,
      result: matchResult.result,
      pointsDelta: matchResult.points,
    })
  }

  if (subview === 'chooseServer') {
    return (
      <div className="space-y-5 animate-[fadeIn_0.3s_ease-out]">
        <header className="text-center">
          <h1 className="text-lg font-bold" style={{ fontFamily: theme.fontDisplay, color: theme.bgText }}>
            第3セットの先攻を選んでください
          </h1>
          <p className="text-sm mt-1" style={{ color: theme.bgTextMuted }}>
            1・2セットの合計得点が同点のため、手動で選択します
          </p>
        </header>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => beginNextSet('me')}
            className="py-6 rounded-2xl font-bold"
            style={{ background: theme.surface, color: theme.surfaceText, border: `1px solid ${theme.surfaceBorder}` }}
          >
            自分
          </button>
          <button
            onClick={() => beginNextSet('opponent')}
            className="py-6 rounded-2xl font-bold"
            style={{ background: theme.surface, color: theme.surfaceText, border: `1px solid ${theme.surfaceBorder}` }}
          >
            {opponentName}
          </button>
        </div>
      </div>
    )
  }

  if (subview === 'setEnd') {
    const winnerColor = setState.winner === 'me' ? theme.accentMe : theme.accentOpponent
    return (
      <div className="space-y-5 animate-[fadeIn_0.3s_ease-out]">
        <header className="text-center space-y-1">
          <p className="text-xs font-bold tracking-widest" style={{ color: winnerColor }}>
            第{currentSetNumber}セット終了
          </p>
          <h1 className="text-xl font-bold" style={{ fontFamily: theme.fontDisplay, color: theme.bgText }}>
            {setState.winner === 'me' ? '自分' : opponentName} の勝利！
          </h1>
        </header>

        <section
          className="rounded-2xl p-4 overflow-x-auto"
          style={{ background: theme.surface, border: `1px solid ${theme.surfaceBorder}` }}
        >
          <RoundTable throws={setState.throws} opponentName={opponentName} />
        </section>

        <div className="flex gap-2">
          <button
            onClick={undoToPlay}
            className="flex-1 py-4 rounded-2xl font-bold active:scale-[0.98] transition-all"
            style={{ background: '#f59e0b', color: '#020617' }}
          >
            戻る
          </button>
          <button
            onClick={proceedAfterSet}
            className="flex-1 py-4 rounded-2xl font-bold active:scale-[0.98] transition-all"
            style={{
              backgroundImage: `linear-gradient(to right, ${theme.accentMe}, ${theme.accentOpponent})`,
              color: theme.ctaText,
              boxShadow: theme.ctaGlow,
            }}
          >
            次へ
          </button>
        </div>
      </div>
    )
  }

  if (subview === 'matchEnd' && matchResult) {
    return (
      <div className="space-y-5 animate-[fadeIn_0.3s_ease-out]">
        <div className="text-center space-y-2">
          <p className="text-3xl">🏆</p>
          <h1 className="text-xl font-bold" style={{ fontFamily: theme.fontDisplay, color: theme.bgText }}>
            試合終了
          </h1>
          <p className="text-lg" style={{ color: theme.bgTextMuted }}>
            {matchResult.finalSetScore.me} - {matchResult.finalSetScore.opponent}（
            {matchResult.result === 'win' ? '勝利' : '敗北'}）
          </p>
          <p
            className="text-3xl font-extrabold"
            style={{
              fontFamily: theme.fontDisplay,
              color: matchResult.points > 0 ? theme.positive : theme.negative,
            }}
          >
            {matchResult.points > 0 ? '+' : ''}
            {matchResult.points}pt
          </p>
        </div>

        <section className="space-y-3">
          {matchResult.sets.map((s, i) => (
            <div
              key={i}
              className="rounded-2xl p-4 overflow-x-auto"
              style={{ background: theme.surface, border: `1px solid ${theme.surfaceBorder}` }}
            >
              <p className="text-xs font-semibold mb-2" style={{ color: theme.surfaceTextMuted }}>
                第{i + 1}セット — 勝者：{s.winner === 'me' ? '自分' : opponentName}
              </p>
              <RoundTable throws={s.throws} opponentName={opponentName} />
            </div>
          ))}
        </section>

        <button
          onClick={confirmMatch}
          className="w-full py-4 rounded-2xl font-bold text-lg active:scale-[0.98] transition-all"
          style={{
            backgroundImage: `linear-gradient(to right, ${theme.accentMe}, ${theme.accentOpponent})`,
            color: theme.ctaText,
            boxShadow: theme.ctaGlow,
          }}
        >
          結果を保存してダッシュボードへ
        </button>
      </div>
    )
  }

  const order = startingTurn === 'me' ? ['me', 'opponent'] : ['opponent', 'me']
  const labels = { me: '自分', opponent: opponentName }
  const accentFor = { me: theme.accentMe, opponent: theme.accentOpponent }
  const glowFor = { me: theme.accentMeGlow, opponent: theme.accentOpponentGlow }

  return (
    <div className="space-y-5 animate-[fadeIn_0.3s_ease-out]">
      <header className="flex items-center justify-between">
        <button onClick={onCancel} className="text-sm" style={{ color: theme.bgTextMuted }}>
          ✕ 中断
        </button>
        <h1 className="text-base font-bold tracking-wide" style={{ fontFamily: theme.fontDisplay, color: theme.bgText }}>
          vs {opponentName}
        </h1>
        <span className="text-xs w-12 text-right" style={{ color: theme.bgTextMuted }}>
          {currentSetNumber}/3
        </span>
      </header>

      <section
        className="rounded-2xl p-5 space-y-4"
        style={{ background: theme.surface, border: `1px solid ${theme.surfaceBorder}` }}
      >
        <div className="flex justify-center gap-3 text-xs" style={{ color: theme.surfaceTextMuted }}>
          {completedSets.map((s, i) => (
            <span
              key={i}
              className="px-2 py-1 rounded-lg"
              style={{ background: theme.inputBg, border: `1px solid ${theme.surfaceBorder}` }}
            >
              第{i + 1}セット: {s.winner === 'me' ? '自分' : opponentName}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 text-center">
          {order.map((player) => (
            <div
              key={player}
              className="rounded-xl py-4 transition-all"
              style={
                setState.turn === player
                  ? { background: `${accentFor[player]}1a`, boxShadow: glowFor[player], border: `2px solid ${accentFor[player]}` }
                  : { background: theme.inputBg, border: `2px solid transparent` }
              }
            >
              <p className="text-xs mb-1" style={{ color: theme.surfaceTextMuted }}>{labels[player]}</p>
              <SetDots count={setWins[player]} />
              <p
                className="text-4xl font-extrabold mt-1"
                style={{ fontFamily: theme.fontDisplay, color: theme.surfaceText }}
              >
                {setState.scores[player]}
              </p>
              <MissDots count={setState.missStreak[player]} />
            </div>
          ))}
        </div>
      </section>

      <section
        className="rounded-2xl p-4 space-y-3"
        style={{ background: theme.surface, border: `1px solid ${theme.surfaceBorder}` }}
      >
        <p className="text-xs text-center" style={{ color: theme.surfaceTextMuted }}>
          現在の手番：
          <span className="font-bold" style={{ color: accentFor[setState.turn] }}>
            {labels[setState.turn]}
          </span>
        </p>
        <div className="grid grid-cols-4 gap-2">
          {NUMBERS.map((n) => (
            <button
              key={n}
              onClick={() => commitThrow(n)}
              className="aspect-square rounded-xl font-bold text-lg active:scale-95 transition-all"
              style={{ background: theme.inputBg, color: theme.surfaceText, border: `1px solid ${theme.surfaceBorder}` }}
            >
              {n}
            </button>
          ))}
          <button
            onClick={() => commitThrow(0)}
            className="col-span-2 rounded-xl font-bold active:scale-95 transition-all"
            style={{ background: MISS_RED, color: '#ffffff' }}
          >
            ミス（0点）
          </button>
          <button
            disabled={history.length === 0}
            onClick={undoToPlay}
            className="col-span-2 rounded-xl font-bold active:scale-95 transition-all disabled:cursor-not-allowed"
            style={
              history.length === 0
                ? { background: theme.inputBg, color: theme.surfaceTextMuted }
                : { background: '#f59e0b', color: '#020617' }
            }
          >
            1手戻る
          </button>
        </div>
      </section>
    </div>
  )
}
