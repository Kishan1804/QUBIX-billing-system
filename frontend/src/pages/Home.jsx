import React from 'react'
import Button from '../components/common/Button';
import FeatureCard from '../components/common/FeatureCard';
import { ChartColumn, CircleCheckBig, Shield, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext'


const Home = () => {

  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuth()

  const handleLogOut = () => {
    logout()
    toast.success("Logged out")
  }

  const handleLogin = () => {
    navigate('/login')
  }

  const handleSignUp = () => {
    navigate('/signup')
  }

  return (

    <div className="min-h-screen bg-slate-50">

      {/* NAVBAR */}
      <header className="sticky top-0 z-30 backdrop-blur bg-white/70 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-xl font-bold tracking-tight text-slate-800">
            QUBIX
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Button children="Logout" variant="danger" onClick={handleLogOut} />
            ) : (
              <>
                <Button children="Login" variant="outline" onClick={handleLogin} />
                <Button children="Signup" variant="primary" onClick={handleSignUp} />
              </>
            )}
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 py-24 text-center">

          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-slate-900">
            Smart Billing for
            <span className="text-blue-600"> Modern Businesses</span>
          </h1>

          <p className="mt-6 text-lg text-slate-500 max-w-2xl mx-auto">
            Create invoices, track payments, manage customers and gain insights —
            all in one powerful billing platform.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            {isAuthenticated ? (
              <Button
                children="Go to Dashboard"
                variant="primary"
                onClick={() => navigate('/dashboard')}
              />
            ) : (
              <>
                <Button children="Get Started" variant="primary" onClick={handleSignUp} />
                <Button children="Login" variant="outline" onClick={handleLogin} />
              </>
            )}
          </div>

        </div>

        {/* subtle gradient bg */}
        <div className="absolute inset-0 -z-10 bg-linear-to-b from-blue-50 via-slate-50 to-slate-50" />
      </section>

      {/* FEATURES */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">

          <h2 className="text-3xl font-bold text-center text-slate-800 mb-12">
            Powerful Features
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              color="#2563eb"
              title="Easy Invoicing"
              desc="Create and send professional invoices in seconds."
              icon={CircleCheckBig}
            />
            <FeatureCard
              color="#2563eb"
              title="Smart Payments"
              desc="Accept Razorpay payments with automatic reconciliation."
              icon={Zap}
            />
            <FeatureCard
              color="#2563eb"
              title="Analytics Dashboard"
              desc="Track revenue, invoices and business growth insights."
              icon={ChartColumn}
            />
            <FeatureCard
              color="#2563eb"
              title="Secure System"
              desc="Role-based access and enterprise grade security."
              icon={Shield}
            />
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 py-8 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center text-slate-400">
          © 2026 QUBIX. All rights reserved.
        </div>
      </footer>

    </div>
  )
}

export default Home