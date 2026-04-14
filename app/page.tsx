import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Navbar from '@/components/landing/Navbar'
import Hero from '@/components/landing/Hero'
import Problems from '@/components/landing/Problems'
import Features from '@/components/landing/Features'
import ProductPreview from '@/components/landing/ProductPreview'
import Pricing from '@/components/landing/Pricing'
import FinalCTA from '@/components/landing/FinalCTA'

export default async function Home() {
  const session = await getServerSession(authOptions)
  if (session) redirect('/dashboard')

  return (
    <div className="bg-white scroll-smooth">
      <Navbar />
      <Hero />
      <Problems />
      <Features />
      <ProductPreview />
      <Pricing />
      <FinalCTA />
    </div>
  )
}
