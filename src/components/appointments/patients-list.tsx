'use client'

import React from 'react'
import { useAppStore } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Search, Plus, Phone, Mail, MapPin, FileText } from 'lucide-react'
import { Patient } from '@/lib/types'

export function PatientsList() {
  const { patients, addPatient, diagnoses, appointments } = useAppStore()
  const [searchTerm, setSearchTerm] = React.useState('')
  const [showAddDialog, setShowAddDialog] = React.useState(false)
  const [newPatient, setNewPatient] = React.useState({
    name: '', email: '', phone: '', dni: '', birthDate: '', address: ''
  })

  const filteredPatients = patients.filter(p => 
    !searchTerm || 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.dni.includes(searchTerm) ||
    p.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddPatient = () => {
    if (!newPatient.name || !newPatient.dni) return
    const patient: Patient = {
      id: `patient-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...newPatient,
      createdAt: new Date().toISOString(),
    }
    addPatient(patient)
    setNewPatient({ name: '', email: '', phone: '', dni: '', birthDate: '', address: '' })
    setShowAddDialog(false)
  }

  return (
    <div className="p-4 lg:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-[#2C3E2D]">Pacientes</h2>
          <p className="text-[#8B948B] text-sm">{filteredPatients.length} paciente(s) registrado(s)</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B948B]" />
            <Input
              placeholder="Buscar paciente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-10 border-[#D4DDD6] bg-white"
            />
          </div>
          <Button onClick={() => setShowAddDialog(true)} className="bg-[#C9B24A] hover:bg-[#A8922F] text-white shadow-gold h-10">
            <Plus className="w-4 h-4 mr-1.5" /> Nuevo
          </Button>
        </div>
      </div>

      {filteredPatients.length === 0 ? (
        <Card className="border-0 shadow-md bg-white">
          <CardContent className="py-12 text-center">
            <Users className="w-12 h-12 text-[#D4DDD6] mx-auto mb-3" />
            <p className="text-[#8B948B]">No se encontraron pacientes</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          <AnimatePresence>
            {filteredPatients.map((patient, index) => {
              const patientDiagnoses = diagnoses.filter(d => d.patientId === patient.id)
              const patientAppointments = appointments.filter(a => a.patientId === patient.id)
              return (
                <motion.div
                  key={patient.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <Card className="border-0 shadow-md bg-white hover:shadow-gold transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#C9B24A] to-[#A8922F] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {patient.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-[#2C3E2D] text-sm truncate">{patient.name}</h3>
                          <p className="text-xs text-[#8B948B]">DNI: {patient.dni}</p>
                          <div className="flex items-center gap-3 mt-2 text-[10px] text-[#8B948B]">
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3" /> {patient.phone}
                            </span>
                            {patient.email && (
                              <span className="flex items-center gap-1 truncate">
                                <Mail className="w-3 h-3" /> {patient.email}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-[9px] bg-[#F8FAF5] text-[#56635A] border-[#D4DDD6]">
                              {patientAppointments.length} cita(s)
                            </Badge>
                            {patientDiagnoses.length > 0 && (
                              <Badge variant="outline" className="text-[9px] bg-[#C9B24A]/5 text-[#A8922F] border-[#C9B24A]/30">
                                <FileText className="w-2.5 h-2.5 mr-0.5" /> {patientDiagnoses.length} diagnóstico(s)
                              </Badge>
                            )}
                          </div>
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

      {/* Add Patient Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[450px] bg-white border-0 shadow-gold-lg">
          <DialogHeader>
            <DialogTitle className="text-[#2C3E2D] flex items-center gap-2">
              <Users className="w-5 h-5 text-[#C9B24A]" />
              Nuevo Paciente
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="text-[#56635A] text-sm">Nombre Completo *</Label>
              <Input value={newPatient.name} onChange={(e) => setNewPatient(p => ({ ...p, name: e.target.value }))} className="border-[#D4DDD6]" placeholder="Nombre del paciente" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-[#56635A] text-sm">DNI *</Label>
                <Input value={newPatient.dni} onChange={(e) => setNewPatient(p => ({ ...p, dni: e.target.value }))} className="border-[#D4DDD6]" placeholder="12345678" />
              </div>
              <div>
                <Label className="text-[#56635A] text-sm">Teléfono</Label>
                <Input value={newPatient.phone} onChange={(e) => setNewPatient(p => ({ ...p, phone: e.target.value }))} className="border-[#D4DDD6]" placeholder="+51 999 888 777" />
              </div>
            </div>
            <div>
              <Label className="text-[#56635A] text-sm">Email</Label>
              <Input type="email" value={newPatient.email} onChange={(e) => setNewPatient(p => ({ ...p, email: e.target.value }))} className="border-[#D4DDD6]" placeholder="correo@email.com" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-[#56635A] text-sm">Fecha de Nacimiento</Label>
                <Input type="date" value={newPatient.birthDate} onChange={(e) => setNewPatient(p => ({ ...p, birthDate: e.target.value }))} className="border-[#D4DDD6]" />
              </div>
              <div>
                <Label className="text-[#56635A] text-sm">Dirección</Label>
                <Input value={newPatient.address} onChange={(e) => setNewPatient(p => ({ ...p, address: e.target.value }))} className="border-[#D4DDD6]" placeholder="Dirección" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)} className="border-[#D4DDD6]">Cancelar</Button>
            <Button onClick={handleAddPatient} disabled={!newPatient.name || !newPatient.dni} className="bg-[#C9B24A] hover:bg-[#A8922F] text-white">
              Registrar Paciente
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
