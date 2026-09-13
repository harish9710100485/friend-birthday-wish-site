import InteractiveProvider from '../../context/InteractiveProvider'
import AmbientBackground from '../../components/AmbientBackground'
import FloatingHearts from '../../components/FloatingHearts'

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <InteractiveProvider>
      <AmbientBackground />
      <FloatingHearts />
      {children}
    </InteractiveProvider>
  )
}
