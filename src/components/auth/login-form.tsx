'use client'

import React, { useState } from 'react'
import { useAppStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Stethoscope, Shield, Wrench, Sparkles } from 'lucide-react'

export function LoginForm() {
  const login = useAppStore(s => s.login)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    
    await new Promise(r => setTimeout(r, 600))
    
    const success = login(email, password)
    if (!success) {
      setError('Credenciales incorrectas. Intente nuevamente.')
    }
    setIsLoading(false)
  }

  const quickLogin = (email: string, password: string) => {
    setEmail(email)
    setPassword(password)
    setError('')
    login(email, password)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#EAF3EA] via-[#F8FAF5] to-[#DCE8DE] p-4">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-[#C9B24A]/5 blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-[#EAF3EA]/50 blur-3xl" />
        <div className="absolute top-[40%] left-[10%] w-[200px] h-[200px] rounded-full bg-[#D8C866]/5 blur-2xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo Section */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[#C9B24A] to-[#A8922F] shadow-gold-lg mb-4"
          >
            <Sparkles className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-[#2C3E2D] tracking-tight">Marfil Stetic</h1>
          <p className="text-[#8B948B] mt-1 text-sm">Clínica Odontológica Estética</p>
        </div>

        {/* Login Card */}
        <Card className="border-0 shadow-gold-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl text-[#2C3E2D]">Iniciar Sesión</CardTitle>
            <CardDescription className="text-[#8B948B]">
              Ingrese sus credenciales para acceder al sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#56635A] text-sm font-medium">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="correo@marfilstetic.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError('') }}
                  className="h-11 border-[#D4DDD6] bg-[#F8FAF5]/50 focus:border-[#C9B24A] focus:ring-[#C9B24A]/20"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#56635A] text-sm font-medium">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError('') }}
                    className="h-11 pr-10 border-[#D4DDD6] bg-[#F8FAF5]/50 focus:border-[#C9B24A] focus:ring-[#C9B24A]/20"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B948B] hover:text-[#C9B24A]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm text-center bg-red-50 py-2 px-3 rounded-lg"
                >
                  {error}
                </motion.p>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-gradient-to-r from-[#C9B24A] to-[#A8922F] hover:from-[#D8C866] hover:to-[#C9B24A] text-white font-medium shadow-gold transition-all duration-300"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Accediendo...
                  </div>
                ) : 'Iniciar Sesión'}
              </Button>
            </form>

            {/* Quick Access */}
            <div className="mt-6 pt-5 border-t border-[#D4DDD6]">
              <p className="text-xs text-[#8B948B] text-center mb-3">Acceso rápido (demo)</p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => quickLogin('admin@marfilstetic.com', 'admin123')}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-[#D4DDD6] hover:border-[#C9B24A] hover:bg-[#C9B24A]/5 transition-all duration-200"
                >
                  <Shield className="w-5 h-5 text-[#C9B24A]" />
                  <span className="text-[10px] font-medium text-[#56635A]">Admin</span>
                </button>
                <button
                  onClick={() => quickLogin('doctor@marfilstetic.com', 'doctor123')}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-[#D4DDD6] hover:border-[#C9B24A] hover:bg-[#C9B24A]/5 transition-all duration-200"
                >
                  <Stethoscope className="w-5 h-5 text-[#C9B24A]" />
                  <span className="text-[10px] font-medium text-[#56635A]">Doctor</span>
                </button>
                <button
                  onClick={() => quickLogin('tecnico@marfilstetic.com', 'tecnico123')}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-[#D4DDD6] hover:border-[#C9B24A] hover:bg-[#C9B24A]/5 transition-all duration-200"
                >
                  <Wrench className="w-5 h-5 text-[#C9B24A]" />
                  <span className="text-[10px] font-medium text-[#56635A]">Técnico</span>
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-[#8B948B] mt-6">
          © 2025 Marfil Stetic. Todos los derechos reservados.
        </p>
      </motion.div>
    </div>
  )
}
