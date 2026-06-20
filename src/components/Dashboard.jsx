import { useTheme } from '../theme/ThemeContext.jsx'

export default function Dashboard({ stats, onStartMatch, onShowHistory }) {
  const { theme } = useTheme()
  const { totalPoints, wins, losses } = stats

  const pointsColor = totalPoints > 0 ? theme.positive : totalPoints < 0 ? theme.negative : theme.surfaceText

  return (
    <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
      <header className="text-center space-y-1">
        <h1
          className="text-2xl sm:text-3xl font-bold tracking-wider"
          style={{ fontFamily: theme.fontDisplay, color: theme.bgText }}
        >
          サスケ 2先チャレンジ
        </h1>
      </header>

      <section
        className="rounded-2xl p-6 text-center space-y-4"
        style={{ background: theme.surface, border: `1px solid ${theme.surfaceBorder}` }}
      >
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] mb-1" style={{ color: theme.surfaceTextMuted }}>
            TOTAL POINTS
          </p>
          <p
            className="text-6xl font-extrabold tracking-tight"
            style={{ fontFamily: theme.fontDisplay, color: pointsColor }}
          >
            {totalPoints > 0 ? '+' : ''}
            {totalPoints}
          </p>
        </div>

        <div className="flex justify-center gap-8 pt-3" style={{ borderTop: `1px solid ${theme.surfaceBorder}` }}>
          <div>
            <p className="text-xs tracking-widest" style={{ color: theme.surfaceTextMuted }}>WIN</p>
            <p className="text-2xl font-bold" style={{ fontFamily: theme.fontDisplay, color: theme.positive }}>
              {wins}
            </p>
          </div>
          <div>
            <p className="text-xs tracking-widest" style={{ color: theme.surfaceTextMuted }}>LOSE</p>
            <p className="text-2xl font-bold" style={{ fontFamily: theme.fontDisplay, color: theme.negative }}>
              {losses}
            </p>
          </div>
          <div>
            <p className="text-xs tracking-widest" style={{ color: theme.surfaceTextMuted }}>TOTAL</p>
            <p className="text-2xl font-bold" style={{ fontFamily: theme.fontDisplay, color: theme.surfaceText }}>
              {wins + losses}
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <button
          onClick={onStartMatch}
          className="w-full py-4 rounded-2xl font-bold text-lg tracking-wide active:scale-[0.98] transition-all"
          style={{
            backgroundImage: `linear-gradient(to right, ${theme.accentMe}, ${theme.accentOpponent})`,
            color: theme.ctaText,
            boxShadow: theme.ctaGlow,
          }}
        >
          ▶ 新規試合を開始
        </button>
        <button
          onClick={onShowHistory}
          className="w-full py-4 rounded-2xl font-bold text-lg tracking-wide active:scale-[0.98] transition-all"
          style={{
            background: theme.surface,
            color: theme.surfaceText,
            border: `1px solid ${theme.surfaceBorder}`,
          }}
        >
          対戦履歴を見る
        </button>
      </section>
    </div>
  )
}
