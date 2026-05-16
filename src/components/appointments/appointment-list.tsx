'use client'

import React from 'react'
import { useAppStore } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Clock, User, ChevronRight, Search, Smile } from 'lucide-react'
import { Input } from '@/components/ui/input'

export function AppointmentList() {
  const { appointments, patients, setView, setSelectedAppointment, setSelectedPatient, currentUser, assignDoctorToAppointment, updateAppointmentStatus } = useAppStore()
  const [searchTerm, setSearchTerm] = React.useState('')

  const pendingAppointments = appointments
    .filter(a => a.status === 'pending')
    .filter(a => {
      if (!searchTerm) return true
      const patient = patients.find(p => p.id === a.patientId)
      return patient?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
             a.reason.toLowerCase().includes(searchTerm.toLowerCase())
    })
    .sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date)
      if (dateCompare !== 0) return dateCompare
      return a.time.localeCompare(b.time)
    })

  const handleAttendPatient = (appointmentId: string, patientId: string) => {
    setSelectedAppointment(appointmentId)
    setSelectedPatient(patientId)
    if (currentUser?.role === 'doctor') {
      assignDoctorToAppointment(appointmentId, currentUser.id)
    }
    updateAppointmentStatus(appointmentId, 'in-progress')
    setView('odontogram')
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      'pending': 'bg-amber-100 text-amber-700 border-amber-200',
      'in-progress': 'bg-[#C9B24A]/10 text-[#A8922F] border-[#C9B24A]/30',
      'diagnosed': 'bg-blue-100 text-blue-700 border-blue-200',
      'referred': 'bg-purple-100 text-purple-700 border-purple-200',
      'in-attention': 'bg-emerald-100 text-emerald-700 border-emerald-200',
      'completed': 'bg-green-100 text-green-700 border-green-200',
      'cancelled': 'bg-red-100 text-red-700 border-red-200',
    }
    const labels: Record<string, string> = {
      'pending': 'Pendiente',
      'in-progress': 'En Proceso',
      'diagnosed': 'Diagnosticada',
      'referred': 'Derivada',
      'in-attention': 'En Atención',
      'completed': 'Completada',
      'cancelled': 'Cancelada',
    }
    return (
      <Badge variant="outline" className={`text-[10px] px-2 py-0.5 ${styles[status] || ''}`}>
        {labels[status] || status}
      </Badge>
    )
  }

  return (
    <div className="p-4 lg:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-[#2C3E2D]">Citas Pendientes</h2>
          <p className="text-[#8B948B] text-sm">{pendingAppointments.length} cita(s) pendiente(s)</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B948B]" />
          <Input
            placeholder="Buscar paciente o motivo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-10 border-[#D4DDD6] bg-white"
          />
        </div>
      </div>

      {pendingAppointments.length === 0 ? (
        <Card className="border-0 shadow-md bg-white">
          <CardContent className="py-12 text-center">
            <Calendar className="w-12 h-12 text-[#D4DDD6] mx-auto mb-3" />
            <p className="text-[#8B948B]">No hay citas pendientes</p>
            <p className="text-[#8B948B] text-sm mt-1">Las citas pendientes aparecerán aquí</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          <AnimatePresence>
            {pendingAppointments.map((appointment, index) => {
              const patient = patients.find(p => p.id === appointment.patientId)
              return (
                <motion.div
                  key={appointment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="border-0 shadow-md hover:shadow-gold transition-all duration-300 bg-white group">
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex items-start gap-4 flex-1 min-w-0">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#C9B24A]/10 to-[#A8922F]/5 flex items-center justify-center flex-shrink-0 border border-[#C9B24A]/20">
                            <User className="w-6 h-6 text-[#C9B24A]" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-[#2C3E2D] truncate">{patient?.name}</h3>
                            <p className="text-sm text-[#8B948B] truncate">{appointment.reason}</p>
                            <div className="flex items-center gap-3 mt-2">
                              <span className="flex items-center gap-1 text-xs text-[#8B948B]">
                                <Calendar className="w-3.5 h-3.5" />
                                {appointment.date}
                              </span>
                              <span className="flex items-center gap-1 text-xs text-[#8B948B]">
                                <Clock className="w-3.5 h-3.5" />
                                {appointment.time}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          {getStatusBadge(appointment.status)}
                          {(currentUser?.role === 'doctor' || currentUser?.role === 'admin') && (
                            <Button
                              onClick={() => handleAttendPatient(appointment.id, appointment.patientId)}
                              className="bg-gradient-to-r from-[#C9B24A] to-[#A8922F] hover:from-[#D8C866] hover:to-[#C9B24A] text-white shadow-gold flex-1 sm:flex-none"
                              size="sm"
                            >
                              <Smile className="w-4 h-4 mr-1.5" />
                              Atender
                              <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
