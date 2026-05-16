'use client'

import React, { useState } from 'react'
import { useAppStore } from '@/lib/store'
import { ToothDiagnosis, Treatment } from '@/lib/types'
import { toothMap, commonTreatments } from '@/lib/mock-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Smile, Plus, Trash2, ArrowRightLeft, ChevronDown,
  DollarSign, FileText, Stethoscope, User, CheckCircle,
  AlertCircle, X
} from 'lucide-react'

function ToothIcon({ number, size = 'md' }: { number: number; size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 20, md: 28, lg: 36 }
  const s = sizes[size]
  
  // Determine tooth type by position
  const isMolar = [1,2,3,14,15,16,17,18,19,30,31,32].includes(number)
  const isPremolar = [4,5,12,13,20,21,28,29].includes(number)
  const isCanine = [6,11,22,27].includes(number)
  const isIncisor = [7,8,9,10,23,24,25,26].includes(number)
  
  if (isMolar) {
    return (
      <svg width={s} height={s} viewBox="0 0 36 36" fill="none">
        <rect x="2" y="4" width="32" height="28" rx="6" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1.5" />
        <path d="M10 12 L18 8 L26 12" stroke="currentColor" strokeWidth="1" opacity="0.5" />
        <path d="M8 20 L18 16 L28 20" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      </svg>
    )
  }
  if (isPremolar) {
    return (
      <svg width={s} height={s} viewBox="0 0 36 36" fill="none">
        <rect x="4" y="6" width="28" height="24" rx="5" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 14 L18 10 L24 14" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      </svg>
    )
  }
  if (isCanine) {
    return (
      <svg width={s} height={s} viewBox="0 0 36 36" fill="none">
        <path d="M12 6 L24 6 L26 12 L22 30 L14 30 L10 12 Z" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    )
  }
  // Incisor
  return (
    <svg width={s} height={s} viewBox="0 0 36 36" fill="none">
      <rect x="8" y="4" width="20" height="28" rx="4" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1.5" />
      <line x1="18" y1="6" x2="18" y2="30" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
    </svg>
  )
}

function ToothButton({ 
  toothNumber, 
  isSelected, 
  hasDiagnosis, 
  onClick 
}: { 
  toothNumber: number
  isSelected: boolean
  hasDiagnosis: boolean
  onClick: () => void
}) {
  const toothInfo = toothMap.find(t => t.number === toothNumber)
  
  return (
    <motion.button
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
        tooth-btn relative flex flex-col items-center justify-center p-1.5 rounded-xl border-2 cursor-pointer transition-all
        ${isSelected 
          ? 'border-[#C9B24A] bg-[#C9B24A]/15 selected' 
          : hasDiagnosis 
            ? 'border-[#C9B24A]/40 bg-[#C9B24A]/8 diagnosed' 
            : 'border-[#D4DDD6] bg-white hover:border-[#C9B24A]/40 hover:bg-[#C9B24A]/5'
        }
      `}
      title={`${toothNumber} - ${toothInfo?.name || ''}`}
    >
      <div className={`${isSelected ? 'text-[#C9B24A]' : hasDiagnosis ? 'text-[#A8922F]' : 'text-[#8B948B]'}`}>
        <ToothIcon number={toothNumber} size="sm" />
      </div>
      <span className={`text-[9px] font-bold mt-0.5 ${isSelected ? 'text-[#C9B24A]' : hasDiagnosis ? 'text-[#A8922F]' : 'text-[#8B948B]'}`}>
        {toothNumber}
      </span>
      {hasDiagnosis && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#C9B24A] rounded-full border-2 border-white badge-pulse" />
      )}
    </motion.button>
  )
}

export function OdontogramView() {
  const { 
    selectedAppointmentId, selectedPatientId, selectedTooth,
    setSelectedTooth, diagnoses, addDiagnosis, updateDiagnosis, removeDiagnosis,
    patients, appointments, currentUser, setView, updateAppointmentStatus,
    getTechnicians
  } = useAppStore()

  const [showDiagnosisDialog, setShowDiagnosisDialog] = useState(false)
  const [showReferralDialog, setShowReferralDialog] = useState(false)
  const [newTreatment, setNewTreatment] = useState({ name: '', price: 0, observations: '' })
  const [toothObservations, setToothObservations] = useState('')
  const [selectedTechnician, setSelectedTechnician] = useState('')
  const [referralNotes, setReferralNotes] = useState('')

  const appointment = appointments.find(a => a.id === selectedAppointmentId)
  const patient = patients.find(p => p.id === selectedPatientId)
  const appointmentDiagnoses = diagnoses.filter(d => d.appointmentId === selectedAppointmentId)
  const currentToothDiagnosis = selectedTooth ? appointmentDiagnoses.find(d => d.toothNumber === selectedTooth) : null
  const technicians = getTechnicians()

  // Upper teeth: 1-16 (right to left visually)
  const upperTeeth = Array.from({ length: 16 }, (_, i) => i + 1)
  // Lower teeth: 17-32 (left to right visually, matching standard dental chart)
  const lowerTeeth = Array.from({ length: 16 }, (_, i) => i + 17)

  const handleToothClick = (toothNumber: number) => {
    setSelectedTooth(toothNumber)
    const existing = appointmentDiagnoses.find(d => d.toothNumber === toothNumber)
    if (existing) {
      setToothObservations(existing.observations)
    } else {
      setToothObservations('')
    }
    setShowDiagnosisDialog(true)
  }

  const handleAddTreatment = () => {
    if (!newTreatment.name) return
    
    const treatment: Treatment = {
      id: `treatment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: newTreatment.name,
      price: newTreatment.price,
      observations: newTreatment.observations,
      status: 'pending',
    }

    if (currentToothDiagnosis) {
      const updatedTreatments = [...currentToothDiagnosis.treatments, treatment]
      updateDiagnosis(currentToothDiagnosis.id, { treatments: updatedTreatments })
    } else {
      const diagnosis: ToothDiagnosis = {
        id: `diagnosis-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        appointmentId: selectedAppointmentId!,
        patientId: selectedPatientId!,
        toothNumber: selectedTooth!,
        treatments: [treatment],
        observations: toothObservations,
        diagnosedAt: new Date().toISOString(),
        diagnosedBy: currentUser?.id || '',
      }
      addDiagnosis(diagnosis)
    }
    
    setNewTreatment({ name: '', price: 0, observations: '' })
  }

  const handleRemoveTreatment = (diagnosisId: string, treatmentId: string) => {
    const diagnosis = diagnoses.find(d => d.id === diagnosisId)
    if (diagnosis) {
      const updatedTreatments = diagnosis.treatments.filter(t => t.id !== treatmentId)
      if (updatedTreatments.length === 0) {
        removeDiagnosis(diagnosisId)
      } else {
        updateDiagnosis(diagnosisId, { treatments: updatedTreatments })
      }
    }
  }

  const handleSaveObservations = () => {
    if (currentToothDiagnosis) {
      updateDiagnosis(currentToothDiagnosis.id, { observations: toothObservations })
    }
  }

  const handleCompleteDiagnosis = () => {
    if (appointment) {
      updateAppointmentStatus(appointment.id, 'diagnosed')
    }
  }

  const handleReferToTechnician = () => {
    if (!selectedTechnician || !appointment) return
    
    const referral = {
      id: `referral-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      appointmentId: appointment.id,
      patientId: appointment.patientId,
      doctorId: currentUser?.id || '',
      technicianId: selectedTechnician,
      toothDiagnoses: appointmentDiagnoses,
      referredAt: new Date().toISOString(),
      status: 'referred' as const,
    }

    const { addReferral, assignTechnicianToAppointment } = useAppStore.getState()
    addReferral(referral)
    assignTechnicianToAppointment(appointment.id, selectedTechnician)
    updateAppointmentStatus(appointment.id, 'referred')
    setShowReferralDialog(false)
    setView('dashboard')
  }

  // Calculate totals for billing panel
  const totalAmount = appointmentDiagnoses.reduce((sum, d) => {
    return sum + d.treatments.reduce((s, t) => s + t.price, 0)
  }, 0)

  const showBilling = currentUser?.role === 'admin' || currentUser?.role === 'doctor'

  if (!appointment || !patient) {
    return (
      <div className="p-4 lg:p-6">
        <Card className="border-0 shadow-md bg-white">
          <CardContent className="py-12 text-center">
            <AlertCircle className="w-12 h-12 text-[#D4DDD6] mx-auto mb-3" />
            <p className="text-[#8B948B]">No se ha seleccionado una cita</p>
            <Button onClick={() => setView('appointments')} className="mt-4 bg-[#C9B24A] hover:bg-[#A8922F] text-white">
              Ver Citas Pendientes
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col lg:flex-row">
      {/* Main Odontogram Area */}
      <div className={`flex-1 p-4 lg:p-6 space-y-4 overflow-y-auto ${showBilling ? 'lg:max-w-[60%]' : ''}`}>
        {/* Patient Info Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-0 shadow-md bg-gradient-to-r from-[#2C3E2D] to-[#3A5240]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#C9B24A]/20 flex items-center justify-center">
                    <User className="w-6 h-6 text-[#D8C866]" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">{patient.name}</h3>
                    <p className="text-white/60 text-sm">DNI: {patient.dni} • {patient.phone}</p>
                  </div>
                </div>
                <div className="text-right hidden sm:block">
                  <p className="text-white/60 text-xs">Cita: {appointment.date} - {appointment.time}</p>
                  <p className="text-white/60 text-xs">{appointment.reason}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Odontogram */}
        <Card className="border-0 shadow-md bg-white">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-[#2C3E2D] text-base flex items-center gap-2">
                <Smile className="w-5 h-5 text-[#C9B24A]" />
                Odontograma
              </CardTitle>
              <div className="flex items-center gap-2 text-xs text-[#8B948B]">
                <div className="w-3 h-3 rounded-full bg-white border-2 border-[#D4DDD6]" /> Sin diagnóstico
                <div className="w-3 h-3 rounded-full bg-[#C9B24A]/20 border-2 border-[#C9B24A]/40 ml-2" /> Diagnosticado
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Upper Jaw */}
              <div>
                <div className="text-center mb-2">
                  <span className="text-xs font-medium text-[#8B948B] bg-[#F8FAF5] px-3 py-1 rounded-full">MAXILAR SUPERIOR</span>
                </div>
                <div className="flex justify-center">
                  <div className="grid grid-cols-8 gap-1.5 sm:gap-2 max-w-lg">
                    {upperTeeth.map(toothNum => (
                      <ToothButton
                        key={toothNum}
                        toothNumber={toothNum}
                        isSelected={selectedTooth === toothNum}
                        hasDiagnosis={appointmentDiagnoses.some(d => d.toothNumber === toothNum)}
                        onClick={() => handleToothClick(toothNum)}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t-2 border-dashed border-[#C9B24A]/30" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-3 text-[10px] font-bold text-[#C9B24A]">LINEA MEDIA</span>
                </div>
              </div>

              {/* Lower Jaw */}
              <div>
                <div className="flex justify-center">
                  <div className="grid grid-cols-8 gap-1.5 sm:gap-2 max-w-lg">
                    {lowerTeeth.map(toothNum => (
                      <ToothButton
                        key={toothNum}
                        toothNumber={toothNum}
                        isSelected={selectedTooth === toothNum}
                        hasDiagnosis={appointmentDiagnoses.some(d => d.toothNumber === toothNum)}
                        onClick={() => handleToothClick(toothNum)}
                      />
                    ))}
                  </div>
                </div>
                <div className="text-center mt-2">
                  <span className="text-xs font-medium text-[#8B948B] bg-[#F8FAF5] px-3 py-1 rounded-full">MAXILAR INFERIOR</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Diagnosed Teeth Summary */}
        {appointmentDiagnoses.length > 0 && (
          <Card className="border-0 shadow-md bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-[#2C3E2D] text-base flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-[#C9B24A]" />
                Dientes Diagnosticados ({appointmentDiagnoses.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {appointmentDiagnoses.map(diagnosis => {
                  const toothInfo = toothMap.find(t => t.number === diagnosis.toothNumber)
                  return (
                    <div key={diagnosis.id} className="p-3 rounded-xl bg-[#F8FAF5] border border-[#D4DDD6]">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-[#C9B24A]/10 flex items-center justify-center">
                            <span className="text-xs font-bold text-[#C9B24A]">{diagnosis.toothNumber}</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[#2C3E2D]">Diente #{diagnosis.toothNumber} - {toothInfo?.name}</p>
                            {diagnosis.observations && (
                              <p className="text-xs text-[#8B948B] mt-0.5">{diagnosis.observations}</p>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-red-400 hover:text-red-600 hover:bg-red-50"
                          onClick={() => removeDiagnosis(diagnosis.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                      <div className="mt-2 space-y-1.5">
                        {diagnosis.treatments.map(treatment => (
                          <div key={treatment.id} className="flex items-center justify-between bg-white rounded-lg px-3 py-2">
                            <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#C9B24A]" />
                              <span className="text-xs text-[#56635A]">{treatment.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {showBilling && (
                                <span className="text-xs font-semibold text-[#A8922F]">S/ {treatment.price.toFixed(2)}</span>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-5 w-5 text-red-400 hover:text-red-600"
                                onClick={() => handleRemoveTreatment(diagnosis.id, treatment.id)}
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          {appointmentDiagnoses.length > 0 && appointment.status === 'in-progress' && (
            <Button
              onClick={handleCompleteDiagnosis}
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Completar Diagnóstico
            </Button>
          )}
          {appointmentDiagnoses.length > 0 && (appointment.status === 'in-progress' || appointment.status === 'diagnosed') && (
            <Button
              onClick={() => setShowReferralDialog(true)}
              className="bg-gradient-to-r from-[#C9B24A] to-[#A8922F] hover:from-[#D8C866] hover:to-[#C9B24A] text-white shadow-gold"
            >
              <ArrowRightLeft className="w-4 h-4 mr-2" />
              Derivar a Técnico
            </Button>
          )}
        </div>
      </div>

      {/* Right Billing Panel */}
      {showBilling && (
        <div className="w-full lg:w-[40%] lg:min-w-[360px] border-l border-[#D4DDD6] bg-[#F8FAF5]">
          <ScrollArea className="h-full">
            <div className="p-4 lg:p-6 space-y-4">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-[#C9B24A]" />
                <h3 className="text-lg font-bold text-[#2C3E2D]">Panel de Cobros</h3>
              </div>

              {/* Patient Summary */}
              <Card className="border-0 shadow-sm bg-white">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C9B24A] to-[#A8922F] flex items-center justify-center text-white font-bold text-sm">
                      {patient.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-semibold text-[#2C3E2D] text-sm">{patient.name}</p>
                      <p className="text-xs text-[#8B948B]">Cita: {appointment.date}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Items */}
              {appointmentDiagnoses.length === 0 ? (
                <Card className="border-0 shadow-sm bg-white">
                  <CardContent className="py-8 text-center">
                    <FileText className="w-8 h-8 text-[#D4DDD6] mx-auto mb-2" />
                    <p className="text-[#8B948B] text-sm">Sin diagnósticos registrados</p>
                    <p className="text-[#8B948B] text-xs mt-1">Seleccione dientes en el odontograma</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {appointmentDiagnoses.map(diagnosis => {
                    const toothInfo = toothMap.find(t => t.number === diagnosis.toothNumber)
                    const subtotal = diagnosis.treatments.reduce((s, t) => s + t.price, 0)
                    return (
                      <Card key={diagnosis.id} className="border-0 shadow-sm bg-white">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-7 h-7 rounded-lg bg-[#C9B24A]/10 flex items-center justify-center">
                              <span className="text-[10px] font-bold text-[#C9B24A]">{diagnosis.toothNumber}</span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-[#2C3E2D]">Diente #{diagnosis.toothNumber}</p>
                              <p className="text-[10px] text-[#8B948B]">{toothInfo?.name} • {toothInfo?.quadrant}</p>
                            </div>
                          </div>
                          {diagnosis.observations && (
                            <p className="text-xs text-[#8B948B] bg-[#F8FAF5] rounded-lg px-3 py-1.5 mb-2 italic">
                              {diagnosis.observations}
                            </p>
                          )}
                          <div className="space-y-1.5">
                            {diagnosis.treatments.map(treatment => (
                              <div key={treatment.id} className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-[#F8FAF5]">
                                <span className="text-xs text-[#56635A]">{treatment.name}</span>
                                <span className="text-xs font-semibold text-[#A8922F]">S/ {treatment.price.toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                          <Separator className="my-2 bg-[#D4DDD6]" />
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-[#8B948B]">Subtotal</span>
                            <span className="text-sm font-bold text-[#A8922F]">S/ {subtotal.toFixed(2)}</span>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}

              {/* Total */}
              {appointmentDiagnoses.length > 0 && (
                <Card className="border-0 shadow-gold bg-gradient-to-r from-[#2C3E2D] to-[#3A5240]">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/60 text-xs">TOTAL</p>
                        <p className="text-2xl font-bold text-[#D8C866]">S/ {totalAmount.toFixed(2)}</p>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-[#C9B24A]/20 flex items-center justify-center">
                        <DollarSign className="w-6 h-6 text-[#D8C866]" />
                      </div>
                    </div>
                    <div className="mt-2 text-white/40 text-[10px]">
                      {appointmentDiagnoses.length} diente(s) • {appointmentDiagnoses.reduce((s, d) => s + d.treatments.length, 0)} tratamiento(s)
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Diagnosis Dialog */}
      <Dialog open={showDiagnosisDialog} onOpenChange={setShowDiagnosisDialog}>
        <DialogContent className="sm:max-w-[500px] bg-white border-0 shadow-gold-lg">
          <DialogHeader>
            <DialogTitle className="text-[#2C3E2D] flex items-center gap-2">
              <Smile className="w-5 h-5 text-[#C9B24A]" />
              Diagnóstico - Diente #{selectedTooth}
              <span className="text-sm font-normal text-[#8B948B]">
                ({toothMap.find(t => t.number === selectedTooth)?.name})
              </span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Existing Treatments */}
            {currentToothDiagnosis && currentToothDiagnosis.treatments.length > 0 && (
              <div className="space-y-2">
                <Label className="text-[#56635A] text-sm">Tratamientos Asignados</Label>
                {currentToothDiagnosis.treatments.map(t => (
                  <div key={t.id} className="flex items-center justify-between bg-[#F8FAF5] rounded-lg px-3 py-2">
                    <div>
                      <p className="text-sm text-[#2C3E2D]">{t.name}</p>
                      {t.observations && <p className="text-xs text-[#8B948B]">{t.observations}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      {showBilling && <span className="text-sm font-semibold text-[#A8922F]">S/ {t.price.toFixed(2)}</span>}
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-red-400 hover:text-red-600" onClick={() => handleRemoveTreatment(currentToothDiagnosis.id, t.id)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Treatment */}
            <div className="space-y-3 p-4 rounded-xl bg-[#F8FAF5] border border-[#D4DDD6]">
              <Label className="text-[#56635A] text-sm font-medium flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5 text-[#C9B24A]" />
                Agregar Tratamiento
              </Label>
              <div>
                <Select onValueChange={(val) => setNewTreatment(prev => ({ ...prev, name: val }))}>
                  <SelectTrigger className="border-[#D4DDD6] bg-white">
                    <SelectValue placeholder="Seleccionar tratamiento..." />
                  </SelectTrigger>
                  <SelectContent>
                    {commonTreatments.map(t => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {showBilling && (
                <div>
                  <Label className="text-[#56635A] text-xs">Monto a Cobrar (S/)</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={newTreatment.price || ''}
                    onChange={(e) => setNewTreatment(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                    className="border-[#D4DDD6] bg-white"
                    placeholder="0.00"
                  />
                </div>
              )}
              <div>
                <Label className="text-[#56635A] text-xs">Observaciones del Tratamiento</Label>
                <Input
                  value={newTreatment.observations}
                  onChange={(e) => setNewTreatment(prev => ({ ...prev, observations: e.target.value }))}
                  className="border-[#D4DDD6] bg-white"
                  placeholder="Observaciones opcionales..."
                />
              </div>
              <Button onClick={handleAddTreatment} className="w-full bg-[#C9B24A] hover:bg-[#A8922F] text-white" size="sm">
                <Plus className="w-4 h-4 mr-1.5" /> Agregar Tratamiento
              </Button>
            </div>

            {/* Tooth Observations */}
            <div>
              <Label className="text-[#56635A] text-sm">Observaciones Clínicas del Diente</Label>
              <Textarea
                value={toothObservations}
                onChange={(e) => setToothObservations(e.target.value)}
                placeholder="Observaciones clínicas generales para este diente..."
                className="border-[#D4DDD6] bg-white min-h-[80px]"
              />
              <Button onClick={handleSaveObservations} variant="outline" size="sm" className="mt-2 border-[#C9B24A] text-[#A8922F] hover:bg-[#C9B24A]/5">
                Guardar Observaciones
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Referral Dialog */}
      <Dialog open={showReferralDialog} onOpenChange={setShowReferralDialog}>
        <DialogContent className="sm:max-w-[450px] bg-white border-0 shadow-gold-lg">
          <DialogHeader>
            <DialogTitle className="text-[#2C3E2D] flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5 text-[#C9B24A]" />
              Derivar a Técnico
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-[#F8FAF5] border border-[#D4DDD6]">
              <p className="text-sm font-medium text-[#2C3E2D]">{patient.name}</p>
              <p className="text-xs text-[#8B948B] mt-1">
                {appointmentDiagnoses.length} diente(s) diagnosticado(s) • {appointmentDiagnoses.reduce((s, d) => s + d.treatments.length, 0)} tratamiento(s)
              </p>
            </div>

            <div>
              <Label className="text-[#56635A] text-sm">Seleccionar Técnico</Label>
              <Select onValueChange={setSelectedTechnician} value={selectedTechnician}>
                <SelectTrigger className="border-[#D4DDD6] bg-white">
                  <SelectValue placeholder="Seleccionar técnico..." />
                </SelectTrigger>
                <SelectContent>
                  {technicians.map(tech => (
                    <SelectItem key={tech.id} value={tech.id}>
                      {tech.name} - {tech.specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-[#56635A] text-sm">Notas de Derivación</Label>
              <Textarea
                value={referralNotes}
                onChange={(e) => setReferralNotes(e.target.value)}
                placeholder="Instrucciones adicionales para el técnico..."
                className="border-[#D4DDD6] bg-white min-h-[80px]"
              />
            </div>

            {/* Summary of teeth being referred */}
            <div className="space-y-2">
              <Label className="text-[#56635A] text-sm">Dientes a Derivar</Label>
              {appointmentDiagnoses.map(d => (
                <div key={d.id} className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-[#D4DDD6]">
                  <span className="text-sm text-[#2C3E2D]">Diente #{d.toothNumber}</span>
                  <span className="text-xs text-[#8B948B]">{d.treatments.map(t => t.name).join(', ')}</span>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReferralDialog(false)} className="border-[#D4DDD6]">
              Cancelar
            </Button>
            <Button
              onClick={handleReferToTechnician}
              disabled={!selectedTechnician}
              className="bg-gradient-to-r from-[#C9B24A] to-[#A8922F] hover:from-[#D8C866] hover:to-[#C9B24A] text-white"
            >
              <ArrowRightLeft className="w-4 h-4 mr-1.5" /> Derivar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
