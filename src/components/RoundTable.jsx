import { buildRoundRows } from '../utils/molkky.js'
import { useTheme } from '../theme/ThemeContext.jsx'

export default function RoundTable({ throws, opponentName }) {
  const { theme } = useTheme()
  const rows = buildRoundRows(throws)

  return (
    <table className="w-full text-sm text-center border-collapse" style={{ color: theme.surfaceText }}>
      <thead>
        <tr style={{ color: theme.surfaceTextMuted }}>
          <th className="py-1 text-xs tracking-widest">TURN</th>
          <th className="py-1" colSpan={2} style={{ color: theme.accentMe }}>自分</th>
          <th className="py-1" colSpan={2} style={{ color: theme.accentOpponent }}>{opponentName}</th>
        </tr>
        <tr className="text-[10px]" style={{ color: theme.surfaceTextMuted }}>
          <th></th>
          <th>得点</th>
          <th>合計</th>
          <th>得点</th>
          <th>合計</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.round} style={{ borderTop: `1px solid ${theme.surfaceBorder}` }}>
            <td className="py-1" style={{ color: theme.surfaceTextMuted }}>{r.round}</td>
            <td className="font-semibold" style={{ color: r.me ? theme.surfaceText : theme.surfaceBorder }}>
              {r.me ? r.me.value : '-'}
            </td>
            <td className="font-bold" style={{ color: r.me ? theme.accentMe : theme.surfaceBorder }}>
              {r.me ? r.me.cumulative : '-'}
            </td>
            <td className="font-semibold" style={{ color: r.opponent ? theme.surfaceText : theme.surfaceBorder }}>
              {r.opponent ? r.opponent.value : '-'}
            </td>
            <td className="font-bold" style={{ color: r.opponent ? theme.accentOpponent : theme.surfaceBorder }}>
              {r.opponent ? r.opponent.cumulative : '-'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
