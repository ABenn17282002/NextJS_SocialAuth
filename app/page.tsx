import React from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function page() {
  return (
    <div>
      {/* <Button>Hellow World</Button> */}
      <Link href={{ pathname: '/dashboard' }}>/dashboard</Link>
      <Link href={{ pathname: '/profile' }}>/profile</Link>
    </div>
  )
}
