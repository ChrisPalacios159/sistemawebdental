'use client'

import React from 'react'
import { useAppStore } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ClipboardCheck, User, Smile, FileText, 
  Play, CheckCircle2, Clock, AlertCircle, Eye 
} from 'lucide-react'
import { toothMap } from '@/lib/mock-data'

export function TechnicianPanel() {
  const { currentUser, referrals, patients, updateReferral } = useAppStore()
  const [selectedReferralId, setSelectedReferralId] = React.useState<string | null>(null)

  if (!currentUser) return null

  const myReferrals = referrals.filter(r => r.technicianId === currentUser.id)
  const selectedReferral = myReferrals.find(r => r.id === selectedReferralId)

  const handleStartAttention = (referralId: string) => {
    updateReferral(referralId, {
      status: 'in-attention',
      attentionStartedAt: new Date().toISOString(),
    })
    // Also update appointment status
    const referral = referrals.find(r => r.id === referralId)
    if (referral) {
      useAppStore.getState().updateAppointmentStatus(referral.appointmentId, 'in-attention')
    }
  }

  const handleCompleteAttention = (referralId: string) => {
    updateReferral(referralId, {
      status: 'completed',
      attentionCompletedAt: new Date().toISOString(),
    })
    const referral = referrals.find(r => r.id === referralId)
    if (referral) {
      useAppStore.getState().updateAppointmentStatus(referral.appointmentId, 'completed')
    }
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'referred': return 'bg-amber-100 text-amber-700 border-amber-200'
      case 'in-attention': return 'bg-[#C9B24A]/10 text-[#A8922F] border-[#C9B24A]/30'
      case 'completed': return 'bg-emerald-100 text-emerald-700 border-emerald-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'referred': return 'Pendiente'
      case 'in-attention': return 'En Atención'
      case 'completed': return 'Completada'
      default: return status
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'referred': return <Clock className="w-4 h-4" />
      case 'in-attention': return <Play className="w-4 h-4" />
      case 'completed': return <CheckCircle2 className="w-4 h-4" />
      default: return <AlertCircle className="w-4 h-4" />
    }
  }

  return (
    <div className="p-4 lg:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#2C3E2D]">Mis Citas Asignadas</h2>
          <p className="text-[#8B948B] text-sm">{myReferrals.length} cita(s) asignada(s)</p>
        </div>
      </div>

      {myReferrals.length === 0 ? (
        <Card className="border-0 shadow-md bg-white">
          <CardContent className="py-12 text-center">
            <ClipboardCheck className="w-12 h-12 text-[#D4DDD6] mx-auto mb-3" />
            <p className="text-[#8B948B]">No tiene citas asignadas</p>
            <p className="text-[#8B948B] text-sm mt-1">Las citas derivadas aparecerán aquí</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          <AnimatePresence>
            {myReferrals.map((referral, index) => {
              const patient = patients.find(p => p.id === referral.patientId)
              const doctor = useAppStore.getState().getUserById(referral.doctorId)
              return (
                <motion.div
                  key={referral.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className={`border-0 shadow-md bg-white hover:shadow-gold transition-shadow ${referral.status === 'in-attention' ? 'ring-2 ring-[#C9B24A]/30' : ''}`}>
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            referral.status === 'referred' ? 'bg-amber-100' :
                            referral.status === 'in-attention' ? 'bg-[#C9B24A]/15' :
                            'bg-emerald-100'
                          }`}>
                            {getStatusIcon(referral.status)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-[#2C3E2D] truncate">{patient?.name}</h3>
                            <p className="text-xs text-[#8B948B] mt-0.5">
                              Dr. {doctor?.name} • {referral.toothDiagnoses.length} diente(s)
                            </p>
                            <p className="text-xs text-[#8B948B]">
                              Derivado: {new Date(referral.referredAt).toLocaleDateString('es-PE')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <Badge variant="outline" className={`text-[10px] ${getStatusStyle(referral.status)}`}>
                            {getStatusLabel(referral.status)}
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedReferralId(referral.id)}
                            className="border-[#C9B24A]/30 text-[#A8922F] hover:bg-[#C9B24A]/5 h-8"
                          >
                            <Eye className="w-3.5 h-3.5 mr-1" /> Ver
                          </Button>
                          {referral.status === 'referred' && (
                            <Button
                              size="sm"
                              onClick={() => handleStartAttention(referral.id)}
                              className="bg-[#C9B24A] hover:bg-[#A8922F] text-white h-8"
                            >
                              <Play className="w-3.5 h-3.5 mr-1" /> Iniciar
                            </Button>
                          )}
                          {referral.status === 'in-attention' && (
                            <Button
                              size="sm"
                              onClick={() => handleCompleteAttention(referral.id)}
                              className="bg-emerald-500 hover:bg-emerald-600 text-white h-8"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Finalizar
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

      {/* Detail Dialog */}
      <Dialog open={!!selectedReferralId} onOpenChange={() => setSelectedReferralId(null)}>
        <DialogContent className="sm:max-w-[550px] bg-white border-0 shadow-gold-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#2C3E2D] flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-[#C9B24A]" />
              Detalle de Cita Asignada
            </DialogTitle>
          </DialogHeader>

          {selectedReferral && (() => {
            const patient = patients.find(p => p.id === selectedReferral.patientId)
            const doctor = useAppStore.getState().getUserById(selectedReferral.doctorId)
            return (
              <div className="space-y-4">
                {/* Patient Info */}
                <Card className="border border-[#D4DDD6] bg-[#F8FAF5]">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C9B24A] to-[#A8922F] flex items-center justify-center text-white font-bold text-sm">
                        {patient?.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-semibold text-[#2C3E2D]">{patient?.name}</p>
                        <p className="text-xs text-[#8B948B]">DNI: {patient?.dni}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Doctor Info */}
                <div className="flex items-center gap-2 text-sm text-[#56635A]">
                  <User className="w-4 h-4 text-[#C9B24A]" />
                  <span>Derivado por: <strong>{doctor?.name}</strong></span>
                </div>

                {/* Status */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#56635A]">Estado:</span>
                  <Badge variant="outline" className={getStatusStyle(selectedReferral.status)}>
                    {getStatusLabel(selectedReferral.status)}
                  </Badge>
                </div>

                {/* Time tracking */}
                {selectedReferral.attentionStartedAt && (
                  <div className="text-xs text-[#8B948B] bg-[#F8FAF5] rounded-lg p-3">
                    <p>Inicio de atención: {new Date(selectedReferral.attentionStartedAt).toLocaleString('es-PE')}</p>
                    {selectedReferral.attentionCompletedAt && (
                      <p className="mt-1">Fin de atención: {new Date(selectedReferral.attentionCompletedAt).toLocaleString('es-PE')}</p>
                    )}
                  </div>
                )}

                <Separator className="bg-[#D4DDD6]" />

                {/* Teeth and Treatments - NO PRICES */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-[#2C3E2D] flex items-center gap-2">
                    <Smile className="w-4 h-4 text-[#C9B24A]" />
                    Dientes y Tratamientos
                  </h4>
                  {selectedReferral.toothDiagnoses.map(diagnosis => {
                    const toothInfo = toothMap.find(t => t.number === diagnosis.toothNumber)
                    return (
                      <Card key={diagnosis.id} className="border border-[#D4DDD6]">
                        <CardContent className="p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-[#C9B24A]/10 flex items-center justify-center">
                              <span className="text-xs font-bold text-[#C9B24A]">{diagnosis.toothNumber}</span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-[#2C3E2D]">Diente #{diagnosis.toothNumber}</p>
                              <p className="text-[10px] text-[#8B948B]">{toothInfo?.name} • {toothInfo?.quadrant}</p>
                            </div>
                          </div>
                          {diagnosis.observations && (
                            <div className="bg-[#F8FAF5] rounded-lg px-3 py-2 mb-2">
                              <p className="text-xs text-[#8B948B] flex items-start gap-1.5">
                                <FileText className="w-3 h-3 mt-0.5 flex-shrink-0 text-[#C9B24A]" />
                                {diagnosis.observations}
                              </p>
                            </div>
                          )}
                          <div className="space-y-1">
                            {diagnosis.treatments.map(treatment => (
                              <div key={treatment.id} className="flex items-center gap-2 py-1 px-2 rounded-lg bg-[#F8FAF5]">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#C9B24A]" />
                                <span className="text-xs text-[#56635A]">{treatment.name}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>

                {/* Action buttons */}
                <div className="flex gap-3 pt-2">
                  {selectedReferral.status === 'referred' && (
                    <Button
                      onClick={() => { handleStartAttention(selectedReferral.id); setSelectedReferralId(null) }}
                      className="flex-1 bg-[#C9B24A] hover:bg-[#A8922F] text-white"
                    >
                      <Play className="w-4 h-4 mr-2" /> Iniciar Atención
                    </Button>
                  )}
                  {selectedReferral.status === 'in-attention' && (
                    <Button
                      onClick={() => { handleCompleteAttention(selectedReferral.id); setSelectedReferralId(null) }}
                      className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" /> Finalizar Atención
                    </Button>
                  )}
                  {selectedReferral.status === 'completed' && (
                    <div className="flex-1 text-center py-3 bg-emerald-50 rounded-xl">
                      <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
                      <p className="text-sm font-medium text-emerald-700">Atención Completada</p>
                    </div>
                  )}
                </div>
              </div>
            )
          })()}
        </DialogContent>
      </Dialog>
    </div>
  )
}
