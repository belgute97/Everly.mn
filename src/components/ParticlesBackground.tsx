import { useTheme } from '../hooks/useTheme'
import Particles from './Particles'

// Брэндийн хөх, алт, улаан. Цайвар дэвсгэр дээр бүдэг, харанхуй дээр арай тод
const COLORS = {
  light: ['#0a5cb8', '#f2b705', '#d7263d'],
  dark: ['#5aa2ff', '#ffc83d', '#ff5a70'],
}

// Бүх хуудасны ард тогтсон, товшилтод саад болохгүй тоосонцор
export default function ParticlesBackground() {
  const theme = useTheme()
  return (
    <div className="particles-bg" aria-hidden="true">
      <Particles
        particleColors={COLORS[theme]}
        particleCount={110}
        particleSpread={10}
        speed={0.1}
        particleBaseSize={70}
        sizeRandomness={1}
        glow={theme === 'dark' ? 0.5 : 0.2}
        twinkle={0.3}
        drift="up"
        driftSpeed={0.5}
        hoverEffect="parallax"
        clickBurst={false}
        opacity={theme === 'dark' ? 0.55 : 0.3}
      />
    </div>
  )
}
