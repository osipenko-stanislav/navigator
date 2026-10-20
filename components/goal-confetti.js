let stopCelebration = () => {}

export function launchGoalConfetti() {
  stopCelebration()
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const canvas = document.createElement('canvas')
  canvas.className = 'goal-confetti'
  canvas.setAttribute('aria-hidden', 'true')
  const context = canvas.getContext('2d')
  if (!context) return
  const width = window.innerWidth
  const height = window.innerHeight
  const density = Math.min(window.devicePixelRatio || 1, 2)
  canvas.width = width * density
  canvas.height = height * density
  context.scale(density, density)
  document.body.append(canvas)

  const colors = ['#8755FF', '#B49BFF', '#FFC857', '#21BE96', '#FF829C']
  const particles = Array.from({ length: width < 600 ? 64 : 110 }, () => ({
    x: Math.random() * width,
    y: -12 - Math.random() * height * .65,
    speed: 170 + Math.random() * 150,
    drift: (Math.random() - .5) * 65,
    angle: Math.random() * Math.PI * 2,
    spin: (Math.random() - .5) * 6,
    size: 5 + Math.random() * 5,
    color: colors[Math.floor(Math.random() * colors.length)],
  }))
  let frame
  let started
  let previous
  const stop = () => {
    cancelAnimationFrame(frame)
    canvas.remove()
    document.removeEventListener('visibilitychange', stop)
    window.removeEventListener('resize', stop)
    if (stopCelebration === stop) stopCelebration = () => {}
  }
  stopCelebration = stop
  document.addEventListener('visibilitychange', stop, { once: true })
  window.addEventListener('resize', stop, { once: true })

  function draw(now) {
    started ??= now
    previous ??= now
    const elapsed = now - started
    const delta = Math.min((now - previous) / 1000, .05)
    previous = now
    if (elapsed > 4200) return stop()
    context.clearRect(0, 0, width, height)
    context.globalAlpha = Math.min(1, (4200 - elapsed) / 600)
    for (const particle of particles) {
      particle.y += particle.speed * delta
      particle.x += particle.drift * delta
      particle.angle += particle.spin * delta
      context.save()
      context.translate(particle.x, particle.y)
      context.rotate(particle.angle)
      context.fillStyle = particle.color
      context.fillRect(-particle.size / 2, -particle.size / 4, particle.size, particle.size / 2)
      context.restore()
    }
    frame = requestAnimationFrame(draw)
  }
  frame = requestAnimationFrame(draw)
}
