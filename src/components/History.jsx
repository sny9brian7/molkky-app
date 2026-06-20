import { useState } from 'react'
import { ADMIN_PASSWORD } from '../utils/config.js'
import RoundTable from './RoundTable.jsx'
import { useTheme } from '../theme/ThemeContext.jsx'

function formatDate(iso) {
  const d = new Date(iso)
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(
    d.getMinutes(),
  ).padStart(2, '0')}`
}

export default function History({ matches, stats, onBack, onResetHistory, onDeleteMatch }) {
  const { theme } = useTheme()
  const [openId, setOpenId] = useState(null)
  const negative = stats.totalPoints < 0 ? -stats.totalPoints : 0
  const needsDonation = negative >= 1
  const prizeCount = Math.floor(negative / 10)
  const [passwordTarget, setPasswordTarget] = useState(null) // null | 'all' | matchId
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function closeDialog() {
    setPasswordTarget(null)
    setPassword('')
    setError('')
  }

  function handleConfirm() {
    if (password !== ADMIN_PASSWORD) {
      setError('パスワードが正しくありません')
      return
    }
    if (passwordTarget === 'all') {
      onResetHistory()
    } else {
      onDeleteMatch(passwordTarget)
    }
    closeDialog()
  }

  return (
    <div className="space-y-5 animate-[fadeIn_0.3s_ease-out]">
      <header className="flex items-center gap-2">
        <button onClick={onBack} className="text-sm" style={{ color: theme.bgTextMuted }}>
          ← 戻る
        </button>
        <h1
          className="text-lg font-bold tracking-wider flex-1 text-center -ml-6"
          style={{ fontFamily: theme.fontDisplay, color: theme.bgText }}
        >
          対戦履歴
        </h1>
      </header>

      {(needsDonation || prizeCount >= 1) && (
        <section className="rounded-2xl p-4 space-y-2 bg-amber-500/10 border border-amber-400/30">
          <p className="text-sm font-bold tracking-wide text-amber-300">⚠ PENALTY ACTIVE</p>
          {needsDonation && <p className="text-sm text-amber-100">モルックセット寄付</p>}
          {prizeCount >= 1 && (
            <p className="text-sm text-amber-100">モルック棒プレゼント：{prizeCount}本</p>
          )}
        </section>
      )}

      {matches.length === 0 && (
        <p className="text-center text-sm py-10" style={{ color: theme.bgTextMuted }}>
          まだ対戦記録がありません
        </p>
      )}

      <div className="space-y-3">
        {matches.map((m) => {
          const isOpen = openId === m.id
          return (
            <div
              key={m.id}
              className="rounded-2xl overflow-hidden"
              style={{ background: theme.surface, border: `1px solid ${theme.surfaceBorder}` }}
            >
              <div className="flex items-stretch">
                <button
                  onClick={() => setOpenId(isOpen ? null : m.id)}
                  className="flex-1 p-4 flex items-center justify-between text-left"
                >
                  <div>
                    <p className="text-xs" style={{ color: theme.surfaceTextMuted }}>{formatDate(m.date)}</p>
                    <p className="font-semibold" style={{ color: theme.surfaceText }}>
                      vs {m.opponentName}
                      {!m.opponentNoTitle && (
                        <span className="ml-2 text-[10px] text-amber-700 bg-amber-400/20 border border-amber-400/40 px-1.5 py-0.5 rounded">
                          👑 チャンピオン
                        </span>
                      )}
                    </p>
                    <p className="text-sm" style={{ color: theme.surfaceTextMuted }}>
                      {m.finalSetScore.me}-{m.finalSetScore.opponent}（
                      {m.result === 'win' ? '勝利' : '敗北'}）
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className="text-xl font-extrabold"
                      style={{
                        fontFamily: theme.fontDisplay,
                        color: m.pointsDelta > 0 ? theme.positive : theme.negative,
                      }}
                    >
                      {m.pointsDelta > 0 ? '+' : ''}
                      {m.pointsDelta}
                    </p>
                    <p className="text-xs" style={{ color: theme.surfaceTextMuted }}>{isOpen ? '▲' : '▼'}</p>
                  </div>
                </button>
                <button
                  onClick={() => setPasswordTarget(m.id)}
                  className="px-4 transition-colors hover:text-rose-500"
                  style={{ color: theme.surfaceTextMuted }}
                  title="この記録を削除"
                >
                  🗑
                </button>
              </div>

              {isOpen && (
                <div className="p-4 space-y-4" style={{ borderTop: `1px solid ${theme.surfaceBorder}` }}>
                  {m.sets.map((s, i) => (
                    <div key={i} className="space-y-1">
                      <p className="text-xs font-semibold" style={{ color: theme.surfaceTextMuted }}>
                        第{i + 1}セット — 勝者：{s.winner === 'me' ? '自分' : m.opponentName}
                      </p>
                      <div className="rounded-lg p-2 overflow-x-auto" style={{ background: theme.inputBg }}>
                        <RoundTable throws={s.throws} opponentName={m.opponentName} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {matches.length > 0 && (
        <button
          onClick={() => setPasswordTarget('all')}
          className="w-full py-3 rounded-2xl text-sm font-semibold transition-all"
          style={{ background: theme.surface, color: theme.negative, border: `1px solid ${theme.negative}55` }}
        >
          履歴を全てリセット（管理者用）
        </button>
      )}

      {passwordTarget !== null && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center px-6 z-50">
          <div
            className="rounded-2xl p-6 w-full max-w-sm space-y-4"
            style={{ background: theme.surface, border: `1px solid ${theme.surfaceBorder}`, color: theme.surfaceText }}
          >
            <h2 className="font-bold" style={{ fontFamily: theme.fontDisplay }}>
              {passwordTarget === 'all' ? '履歴を全てリセット' : 'この記録を削除'}
            </h2>
            <p className="text-sm" style={{ color: theme.surfaceTextMuted }}>
              {passwordTarget === 'all'
                ? 'すべての対戦履歴とポイントが削除されます。管理者パスワードを入力してください。'
                : 'この対戦記録を削除します。管理者パスワードを入力してください。'}
            </p>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError('')
              }}
              autoFocus
              className="w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-2"
              style={{ background: theme.inputBg, border: `1px solid ${theme.inputBorder}`, color: theme.inputText }}
              placeholder="パスワード"
            />
            {error && <p className="text-xs" style={{ color: theme.negative }}>{error}</p>}
            <div className="flex gap-2">
              <button
                onClick={closeDialog}
                className="flex-1 py-3 rounded-xl font-semibold"
                style={{ background: theme.inputBg, color: theme.surfaceTextMuted }}
              >
                キャンセル
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 py-3 rounded-xl font-semibold"
                style={{ background: theme.negative, color: '#ffffff' }}
              >
                削除する
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
