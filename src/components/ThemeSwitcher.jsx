import { useState } from 'react'
import { useTheme } from '../theme/ThemeContext.jsx'

export default function ThemeSwitcher() {
  const { theme, themeId, setThemeId, themes } = useTheme()
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed top-4 right-4 z-40 w-10 h-10 rounded-full flex items-center justify-center text-lg transition-transform hover:scale-110"
        style={{
          background: theme.surface,
          border: `1px solid ${theme.surfaceBorder}`,
          color: theme.surfaceText,
        }}
        title="テーマを変更"
      >
        ⚙
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-6"
          style={{ background: 'rgba(0,0,0,0.6)' }}
          onClick={() => setOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl p-6 space-y-4"
            style={{
              background: theme.surface,
              border: `1px solid ${theme.surfaceBorder}`,
              color: theme.surfaceText,
              fontFamily: theme.fontBody,
            }}
          >
            <h2 className="font-bold text-lg" style={{ fontFamily: theme.fontDisplay }}>
              テーマを選択
            </h2>
            <div className="space-y-2">
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setThemeId(t.id)
                    setOpen(false)
                  }}
                  className="w-full text-left rounded-xl px-4 py-3 transition-all flex items-center justify-between gap-3"
                  style={{
                    background: t.id === themeId ? t.accentMe : 'transparent',
                    color: t.id === themeId ? t.accentMeText : theme.surfaceText,
                    border: `1px solid ${t.id === themeId ? t.accentMe : theme.surfaceBorder}`,
                  }}
                >
                  <span>
                    <span className="block font-semibold text-sm">{t.name}</span>
                    <span
                      className="block text-xs opacity-80"
                      style={{ color: t.id === themeId ? t.accentMeText : theme.surfaceTextMuted }}
                    >
                      {t.description}
                    </span>
                  </span>
                  {t.id === themeId && <span>✓</span>}
                </button>
              ))}
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-full py-2.5 rounded-xl text-sm font-semibold"
              style={{ background: 'transparent', color: theme.surfaceTextMuted, border: `1px solid ${theme.surfaceBorder}` }}
            >
              閉じる
            </button>
          </div>
        </div>
      )}
    </>
  )
}
