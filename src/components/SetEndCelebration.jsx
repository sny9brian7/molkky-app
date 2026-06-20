const PIECE_COUNT = 28

export default function SetEndCelebration({ colors }) {
  const pieces = Array.from({ length: PIECE_COUNT }, (_, i) => {
    const left = Math.random() * 100
    const delay = Math.random() * 0.4
    const duration = 1.6 + Math.random() * 1.2
    const size = 6 + Math.random() * 8
    const rotate = Math.random() * 360
    const color = colors[i % colors.length]
    return { id: i, left, delay, duration, size, rotate, color }
  })

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-40">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="absolute top-[-5%] rounded-sm"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size * 0.5}px`,
            background: p.color,
            transform: `rotate(${p.rotate}deg)`,
            animation: `confettiFall ${p.duration}s ease-in ${p.delay}s forwards`,
          }}
        />
      ))}
    </div>
  )
}
