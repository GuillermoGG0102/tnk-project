import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <p className="font-mono text-8xl font-bold text-gradient-primary mb-4">404</p>
        <h1 className="font-display text-3xl font-bold text-[#F0F4FF] mb-3">Page not found</h1>
        <p className="text-[#8A9CC8] mb-8 max-w-sm">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button variant="primary">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </div>
  )
}
