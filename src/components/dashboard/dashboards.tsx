'use client'

import React from 'react'
import { useAppStore } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { 
  Calendar, Users, ClipboardCheck, ArrowRightLeft, 
  Clock, TrendingUp, Activity, CheckCircle2 
} from 'lucide-react'

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export function AdminDashboard() {
  const { appointments, patients, referrals, setView } = useAppStore()

  const pendingCount = appointments.filter(a => a.status === 'pending').length
  const inProgressCount = appointments.filter(a => a.status === 'in-progress' || a.status === 'diagnosed').length
  const referredCount = referrals.filter(r => r.status === 'referred' || r.status === 'in-attention').length
  const completedCount = referrals.filter(r => r.status === 'completed').length
  const totalRevenue = referrals.reduce((sum, r) => {
    return sum + r.toothDiagnoses.reduce((s, d) => {
      return s + d.treatments.reduce((ts, t) => ts + t.price, 0)
    }, 0)
  }, 0)

  const stats = [
    { label: 'Citas Pendientes', value: pendingCount, icon: <Clock className="w-5 h-5" />, color: 'from-amber-400 to-amber-600', onClick: () => setView('appointments') },
    { label: 'En Proceso', value: inProgressCount, icon: <Activity className="w-5 h-5" />, color: 'from-[#C9B24A] to-[#A8922F]', onClick: () => setView('appointments') },
    { label: 'Derivaciones Activas', value: referredCount, icon: <ArrowRightLeft className="w-5 h-5" />, color: 'from-emerald-400 to-emerald-600', onClick: () => setView('review') },
    { label: 'Atenciones Completadas', value: completedCount, icon: <CheckCircle2 className="w-5 h-5" />, color: 'from-teal-400 to-teal-600', onClick: () => setView('review') },
  ]

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-bold text-[#2C3E2D]">Bienvenido, Administrador</h2>
        <p className="text-[#8B948B] mt-1">Resumen general de la clínica Marfil Stetic</p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <motion.div key={stat.label} variants={itemVariants}>
            <Card className="border-0 shadow-md hover:shadow-gold transition-shadow cursor-pointer bg-white" onClick={stat.onClick}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[#8B948B] text-sm">{stat.label}</p>
                    <p className="text-3xl font-bold text-[#2C3E2D] mt-1">{stat.value}</p>
                  </div>
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-sm`}>
                    {stat.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Revenue Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card className="border-0 shadow-md bg-gradient-to-r from-[#2C3E2D] to-[#3A5240]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Total Cobros Registrados</p>
                <p className="text-3xl font-bold text-[#D8C866] mt-1">S/ {totalRevenue.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-[#C9B24A]/20 flex items-center justify-center">
                <TrendingUp className="w-7 h-7 text-[#D8C866]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <h3 className="text-lg font-semibold text-[#2C3E2D] mb-3">Acciones Rápidas</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Ver Citas', icon: <Calendar className="w-5 h-5" />, view: 'appointments' as const },
            { label: 'Pacientes', icon: <Users className="w-5 h-5" />, view: 'patients' as const },
            { label: 'Derivaciones', icon: <ArrowRightLeft className="w-5 h-5" />, view: 'referrals' as const },
            { label: 'Seguimiento', icon: <ClipboardCheck className="w-5 h-5" />, view: 'review' as const },
          ].map((action) => (
            <Button
              key={action.label}
              variant="outline"
              onClick={() => setView(action.view)}
              className="h-auto py-4 flex flex-col gap-2 border-[#D4DDD6] hover:border-[#C9B24A] hover:bg-[#C9B24A]/5 text-[#56635A] hover:text-[#C9B24A]"
            >
              {action.icon}
              <span className="text-xs font-medium">{action.label}</span>
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Recent Appointments */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <Card className="border-0 shadow-md bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-[#2C3E2D] text-base">Citas Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            {appointments.length === 0 ? (
              <p className="text-[#8B948B] text-sm text-center py-6">No hay citas registradas</p>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {appointments.slice(0, 5).map((apt) => {
                  const patient = useAppStore.getState().getPatientById(apt.patientId)
                  return (
                    <div key={apt.id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-[#F8FAF5] hover:bg-[#EAF3EA] transition-colors">
                      <div>
                        <p className="text-sm font-medium text-[#2C3E2D]">{patient?.name || 'Paciente'}</p>
                        <p className="text-xs text-[#8B948B]">{apt.date} - {apt.time}</p>
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        apt.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                        apt.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                        'bg-[#C9B24A]/10 text-[#A8922F]'
                      }`}>
                        {apt.status === 'pending' ? 'Pendiente' : 
                         apt.status === 'completed' ? 'Completada' :
                         apt.status === 'in-progress' ? 'En Proceso' :
                         apt.status === 'referred' ? 'Derivada' :
                         apt.status === 'in-attention' ? 'En Atención' : apt.status}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export function DoctorDashboard() {
  const { appointments, diagnoses, referrals, setView, currentUser } = useAppStore()

  const pendingCount = appointments.filter(a => a.status === 'pending').length
  const myDiagnoses = diagnoses.length
  const activeReferrals = referrals.filter(r => r.doctorId === currentUser?.id && r.status !== 'completed').length
  const completedReferrals = referrals.filter(r => r.doctorId === currentUser?.id && r.status === 'completed').length

  const stats = [
    { label: 'Citas Pendientes', value: pendingCount, icon: <Clock className="w-5 h-5" />, color: 'from-amber-400 to-amber-600' },
    { label: 'Diagnósticos Realizados', value: myDiagnoses, icon: <Activity className="w-5 h-5" />, color: 'from-[#C9B24A] to-[#A8922F]' },
    { label: 'Derivaciones Activas', value: activeReferrals, icon: <ArrowRightLeft className="w-5 h-5" />, color: 'from-emerald-400 to-emerald-600' },
    { label: 'Atenciones Completadas', value: completedReferrals, icon: <CheckCircle2 className="w-5 h-5" />, color: 'from-teal-400 to-teal-600' },
  ]

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-bold text-[#2C3E2D]">Bienvenido, {currentUser?.name}</h2>
        <p className="text-[#8B948B] mt-1">Panel de control</p>
      </motion.div>

      <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <motion.div key={stat.label} variants={itemVariants}>
            <Card className="border-0 shadow-md bg-white">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[#8B948B] text-sm">{stat.label}</p>
                    <p className="text-3xl font-bold text-[#2C3E2D] mt-1">{stat.value}</p>
                  </div>
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-sm`}>
                    {stat.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="border-0 shadow-md bg-white h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-[#2C3E2D] text-base">Próximas Citas</CardTitle>
            </CardHeader>
            <CardContent>
              {appointments.filter(a => a.status === 'pending').length === 0 ? (
                <p className="text-[#8B948B] text-sm text-center py-6">No hay citas pendientes</p>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {appointments.filter(a => a.status === 'pending').slice(0, 5).map((apt) => {
                    const patient = useAppStore.getState().getPatientById(apt.patientId)
                    return (
                      <div key={apt.id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-[#F8FAF5]">
                        <div>
                          <p className="text-sm font-medium text-[#2C3E2D]">{patient?.name}</p>
                          <p className="text-xs text-[#8B948B]">{apt.date} - {apt.time}</p>
                        </div>
                        <Button size="sm" onClick={() => setView('appointments')} className="bg-[#C9B24A] hover:bg-[#A8922F] text-white h-8 text-xs">
                          Atender
                        </Button>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card className="border-0 shadow-md bg-white h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-[#2C3E2D] text-base">Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={() => setView('appointments')} className="w-full justify-start bg-[#C9B24A]/10 hover:bg-[#C9B24A]/20 text-[#A8922F] border border-[#C9B24A]/30" variant="outline">
                <Calendar className="w-4 h-4 mr-2" /> Ver Citas Pendientes
              </Button>
              <Button onClick={() => setView('review')} className="w-full justify-start bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200" variant="outline">
                <ClipboardCheck className="w-4 h-4 mr-2" /> Ver Seguimiento
              </Button>
              <Button onClick={() => setView('patients')} className="w-full justify-start bg-[#F8FAF5] hover:bg-[#EAF3EA] text-[#56635A] border border-[#D4DDD6]" variant="outline">
                <Users className="w-4 h-4 mr-2" /> Ver Pacientes
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export function TechnicianDashboard() {
  const { referrals, currentUser, setView } = useAppStore()

  const myReferrals = referrals.filter(r => r.technicianId === currentUser?.id)
  const activeCount = myReferrals.filter(r => r.status === 'referred' || r.status === 'in-attention').length
  const completedCount = myReferrals.filter(r => r.status === 'completed').length

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-bold text-[#2C3E2D]">Bienvenido, {currentUser?.name}</h2>
        <p className="text-[#8B948B] mt-1">Panel del técnico dental</p>
      </motion.div>

      <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-md bg-white">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[#8B948B] text-sm">Citas Asignadas</p>
                  <p className="text-3xl font-bold text-[#2C3E2D] mt-1">{activeCount}</p>
                </div>
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#C9B24A] to-[#A8922F] flex items-center justify-center text-white shadow-sm">
                  <ClipboardCheck className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-md bg-white">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[#8B948B] text-sm">Atenciones Completadas</p>
                  <p className="text-3xl font-bold text-[#2C3E2D] mt-1">{completedCount}</p>
                </div>
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white shadow-sm">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Button onClick={() => setView('technician-panel')} className="bg-[#C9B24A] hover:bg-[#A8922F] text-white shadow-gold">
          <ClipboardCheck className="w-4 h-4 mr-2" /> Ver Mis Citas Asignadas
        </Button>
      </motion.div>
    </div>
  )
}
