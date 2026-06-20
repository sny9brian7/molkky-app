import { useState } from 'react'
import { useTheme } from '../theme/ThemeContext.jsx'

export default function NewMatchSetup({ onCancel, onConfirm }) {
  const { theme } = useTheme()
  const [name, setName] = useState('')
  const [noTitle, setNoTitle] = useState(false)
  const [firstServer, setFirstServer] = useState('me')

  const canStart = name.trim().length > 0

  return (
    <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
      <header className="flex items-center gap-2">
        <button onClick={onCancel} className="text-sm" style={{ color: theme.bgTextMuted }}>
          ← 戻る
        </button>
        <h1
          className="text-lg font-bold tracking-wider flex-1 text-center -ml-6"
          style={{ fontFamily: theme.fontDisplay, color: theme.bgText }}
        >
          試合設定
        </h1>
      </header>

      <section
        className="rounded-2xl p-6 space-y-5"
        style={{ background: theme.surface, border: `1px solid ${theme.surfaceBorder}` }}
      >
        <div>
          <label className="block text-xs font-semibold tracking-widest mb-2" style={{ color: theme.surfaceTextMuted }}>
            対戦相手名
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-2"
            style={{
              background: theme.inputBg,
              border: `1px solid ${theme.inputBorder}`,
              color: theme.inputText,
            }}
            autoFocus
          />
        </div>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={noTitle}
            onChange={(e) => setNoTitle(e.target.checked)}
            className="mt-1 w-5 h-5 rounded"
            style={{ accentColor: theme.accentOpponent }}
          />
          <span className="text-sm" style={{ color: theme.surfaceText }}>相手はチャンピオンではない</span>
        </label>

        <div>
          <label className="block text-xs font-semibold tracking-widest mb-2" style={{ color: theme.surfaceTextMuted }}>
            第1セットの先攻
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setFirstServer('me')}
              className="py-3 rounded-xl font-bold text-sm transition-all"
              style={
                firstServer === 'me'
                  ? { background: theme.accentMe, color: theme.accentMeText, border: `1px solid ${theme.accentMe}`, boxShadow: theme.accentMeGlow }
                  : { background: theme.inputBg, color: theme.surfaceTextMuted, border: `1px solid ${theme.surfaceBorder}` }
              }
            >
              自分
            </button>
            <button
              type="button"
              onClick={() => setFirstServer('opponent')}
              className="py-3 rounded-xl font-bold text-sm transition-all"
              style={
                firstServer === 'opponent'
                  ? { background: theme.accentOpponent, color: theme.accentOpponentText, border: `1px solid ${theme.accentOpponent}`, boxShadow: theme.accentOpponentGlow }
                  : { background: theme.inputBg, color: theme.surfaceTextMuted, border: `1px solid ${theme.surfaceBorder}` }
              }
            >
              相手
            </button>
          </div>
        </div>
      </section>

      <button
        disabled={!canStart}
        onClick={() => onConfirm(name.trim(), noTitle, firstServer)}
        className="w-full py-4 rounded-2xl font-bold text-lg tracking-wide active:scale-[0.98] transition-all disabled:cursor-not-allowed"
        style={
          canStart
            ? {
                backgroundImage: `linear-gradient(to right, ${theme.accentMe}, ${theme.accentOpponent})`,
                color: theme.ctaText,
                boxShadow: theme.ctaGlow,
              }
            : { background: theme.surfaceBorder, color: theme.surfaceTextMuted }
        }
      >
        試合開始
      </button>
    </div>
  )
}
