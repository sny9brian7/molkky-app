import { useState, useCallback, useEffect } from 'react'
import Dashboard from './components/Dashboard.jsx'
import NewMatchSetup from './components/NewMatchSetup.jsx'
import MatchPlay from './components/MatchPlay.jsx'
import History from './components/History.jsx'
import ThemeSwitcher from './components/ThemeSwitcher.jsx'
import { useTheme } from './theme/ThemeContext.jsx'
import { subscribeMatches, addMatch, clearMatches, deleteMatch, getStats } from './utils/storage.js'

export default function App() {
  const { theme } = useTheme()
  const [view, setView] = useState('dashboard') // dashboard | setup | play | history
  const [matches, setMatches] = useState([])
  const [pendingOpponent, setPendingOpponent] = useState(null)

  useEffect(() => {
    const unsubscribe = subscribeMatches(setMatches)
    return unsubscribe
  }, [])

  const stats = getStats(matches)

  const goDashboard = useCallback(() => setView('dashboard'), [])
  const goHistory = useCallback(() => setView('history'), [])
  const goSetup = useCallback(() => setView('setup'), [])

  const startMatch = useCallback((opponentName, opponentNoTitle, firstServer) => {
    setPendingOpponent({ opponentName, opponentNoTitle, firstServer })
    setView('play')
  }, [])

  const resetHistory = useCallback(() => {
    clearMatches(matches)
  }, [matches])

  const removeMatch = useCallback((id) => {
    deleteMatch(id)
  }, [])

  const finishMatch = useCallback((matchRecord) => {
    addMatch(matchRecord)
    setPendingOpponent(null)
    setView('dashboard')
  }, [])

  return (
    <div
      className="min-h-screen flex flex-col items-center px-4 py-6 sm:py-10 transition-colors duration-500"
      style={{ background: theme.appBackground, color: theme.bgText, fontFamily: theme.fontBody }}
    >
      <ThemeSwitcher />
      <div className="w-full max-w-md transition-all duration-300">
        {view === 'dashboard' && (
          <Dashboard
            stats={stats}
            onStartMatch={goSetup}
            onShowHistory={goHistory}
          />
        )}
        {view === 'setup' && (
          <NewMatchSetup onCancel={goDashboard} onConfirm={startMatch} />
        )}
        {view === 'play' && pendingOpponent && (
          <MatchPlay
            opponentName={pendingOpponent.opponentName}
            opponentNoTitle={pendingOpponent.opponentNoTitle}
            firstServer={pendingOpponent.firstServer}
            onFinish={finishMatch}
            onCancel={goDashboard}
          />
        )}
        {view === 'history' && (
          <History
            matches={matches}
            stats={stats}
            onBack={goDashboard}
            onResetHistory={resetHistory}
            onDeleteMatch={removeMatch}
          />
        )}
      </div>
    </div>
  )
}
