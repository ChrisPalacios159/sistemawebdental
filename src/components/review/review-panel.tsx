'use client'

import React from 'react'
import { useAppStore } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ClipboardCheck, User, Smile, FileText, 
  Play, CheckCircle2, Clock, ArrowRightLeft, 
  Eye, DollarSign, Calendar
} from 'lucide-react'
import { toothMap } from '@/lib/mock-data'

export function ReviewPanel() {
  const { referrals, patients, appointments, currentUser } = useAppStore()
  const [selectedReferralId, setSelectedReferralId] = React.useState<string | null>(null)

  const relevantReferrals = currentUser?.role === 'admin' 
    ? referrals 
    : referrals.filter(r => r.doctorId === currentUser?.id)

  const selectedReferral = relevantReferrals.find(r => r.id === selectedReferralId)
  const showBilling = currentUser?.role === 'admin' || currentUser?.role === 'doctor'

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
      case 'referred': return 'Derivada'
      case 'in-attention': return 'En Atención'
      case 'completed': return 'Completada'
      default: return status
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'referred': return <ArrowRightLeft className="w-4 h-4" />
      case 'in-attention': return <Play className="w-4 h-4" />
      case 'completed': return <CheckCircle2 className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  return (
    <div className="p-4 lg:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-[#2C3E2D]">Seguimiento de Atenciones</h2>
          <p className="text-[#8B948B] text-sm">{relevantReferrals.length} derivación(es) registrada(s)</p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="text-[#8B948B]">Derivada</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#C9B24A]" />
            <span className="text-[#8B948B]">En Atención</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-[#8B948B]">Completada</span>
          </div>
        </div>
      </div>

      {relevantReferrals.length === 0 ? (
        <Card className="border-0 shadow-md bg-white">
          <CardContent className="py-12 text-center">
            <ClipboardCheck className="w-12 h-12 text-[#D4DDD6] mx-auto mb-3" />
            <p className="text-[#8B948B]">No hay derivaciones registradas</p>
            <p className="text-[#8B948B] text-sm mt-1">Las derivaciones aparecerán aquí cuando se realicen</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          <AnimatePresence>
            {relevantReferrals.map((referral, index) => {
              const patient = patients.find(p => p.id === referral.patientId)
              const technician = useAppStore.getState().getUserById(referral.technicianId)
              const appointment = appointments.find(a => a.id === referral.appointmentId)
              const totalAmount = referral.toothDiagnoses.reduce((sum, d) => 
                sum + d.treatments.reduce((s, t) => s + t.price, 0), 0)

              return (
                <motion.div
                  key={referral.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className={`border-0 shadow-md bg-white hover:shadow-gold transition-shadow ${referral.status === 'in-attention' ? 'ring-2 ring-[#C9B24A]/20' : ''}`}>
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            referral.status === 'referred' ? 'bg-amber-100 text-amber-600' :
                            referral.status === 'in-attention' ? 'bg-[#C9B24A]/15 text-[#C9B24A]' :
                            'bg-emerald-100 text-emerald-600'
                          }`}>
                            {getStatusIcon(referral.status)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-[#2C3E2D] truncate">{patient?.name}</h3>
                            <p className="text-xs text-[#8B948B] mt-0.5">
                              Téc. {technician?.name} • {referral.toothDiagnoses.length} diente(s)
                            </p>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-[10px] text-[#8B948B] flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                Derivado: {new Date(referral.referredAt).toLocaleDateString('es-PE')}
                              </span>
                              {referral.attentionCompletedAt && (
                                <span className="text-[10px] text-emerald-600 flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" />
                                  Completado: {new Date(referral.attentionCompletedAt).toLocaleDateString('es-PE')}
                                </span>
                              )}
                            </div>
                            {showBilling && totalAmount > 0 && (
                              <p className="text-xs font-semibold text-[#A8922F] mt-1">
                                S/ {totalAmount.toFixed(2)}
                              </p>
                            )}
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
        <DialogContent className="sm:max-w-[600px] bg-white border-0 shadow-gold-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#2C3E2D] flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-[#C9B24A]" />
              Detalle de Derivación
            </DialogTitle>
          </DialogHeader>

          {selectedReferral && (() => {
            const patient = patients.find(p => p.id === selectedReferral.patientId)
            const technician = useAppStore.getState().getUserById(selectedReferral.technicianId)
            const doctor = useAppStore.getState().getUserById(selectedReferral.doctorId)
            const totalAmount = selectedReferral.toothDiagnoses.reduce((sum, d) => 
              sum + d.treatments.reduce((s, t) => s + t.price, 0), 0)

            return (
              <div className="space-y-4">
                {/* Patient & Team Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Card className="border border-[#D4DDD6] bg-[#F8FAF5]">
                    <CardContent className="p-3">
                      <p className="text-[10px] text-[#8B948B] uppercase tracking-wider mb-1">Paciente</p>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C9B24A] to-[#A8922F] flex items-center justify-center text-white font-bold text-[10px]">
                          {patient?.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#2C3E2D]">{patient?.name}</p>
                          <p className="text-[10px] text-[#8B948B]">{patient?.phone}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border border-[#D4DDD6] bg-[#F8FAF5]">
                    <CardContent className="p-3">
                      <p className="text-[10px] text-[#8B948B] uppercase tracking-wider mb-1">Técnico Asignado</p>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-[10px]">
                          {technician?.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#2C3E2D]">{technician?.name}</p>
                          <p className="text-[10px] text-[#8B948B]">{technician?.specialty}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Status & Timeline */}
                <Card className="border border-[#D4DDD6]">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-[#56635A]">Estado</span>
                      <Badge variant="outline" className={getStatusStyle(selectedReferral.status)}>
                        {getStatusLabel(selectedReferral.status)}
                      </Badge>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between text-[#8B948B]">
                        <span>Derivado por Dr. {doctor?.name}</span>
                        <span>{new Date(selectedReferral.referredAt).toLocaleString('es-PE')}</span>
                      </div>
                      {selectedReferral.attentionStartedAt && (
                        <div className="flex items-center justify-between text-[#A8922F]">
                          <span>Atención iniciada</span>
                          <span>{new Date(selectedReferral.attentionStartedAt).toLocaleString('es-PE')}</span>
                        </div>
                      )}
                      {selectedReferral.attentionCompletedAt && (
                        <div className="flex items-center justify-between text-emerald-600">
                          <span>Atención completada</span>
                          <span>{new Date(selectedReferral.attentionCompletedAt).toLocaleString('es-PE')}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Separator className="bg-[#D4DDD6]" />

                {/* Teeth and Treatments */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-[#2C3E2D] flex items-center gap-2">
                    <Smile className="w-4 h-4 text-[#C9B24A]" />
                    Dientes y Tratamientos
                  </h4>
                  {selectedReferral.toothDiagnoses.map(diagnosis => {
                    const toothInfo = toothMap.find(t => t.number === diagnosis.toothNumber)
                    const subtotal = diagnosis.treatments.reduce((s, t) => s + t.price, 0)
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
                              <div key={treatment.id} className="flex items-center justify-between py-1 px-2 rounded-lg bg-[#F8FAF5]">
                                <div className="flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-[#C9B24A]" />
                                  <span className="text-xs text-[#56635A]">{treatment.name}</span>
                                </div>
                                {showBilling && (
                                  <span className="text-xs font-semibold text-[#A8922F]">S/ {treatment.price.toFixed(2)}</span>
                                )}
                              </div>
                            ))}
                          </div>
                          {showBilling && (
                            <>
                              <Separator className="my-2 bg-[#D4DDD6]" />
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-[#8B948B]">Subtotal</span>
                                <span className="text-sm font-bold text-[#A8922F]">S/ {subtotal.toFixed(2)}</span>
                              </div>
                            </>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>

                {/* Total */}
                {showBilling && totalAmount > 0 && (
                  <Card className="border-0 bg-gradient-to-r from-[#2C3E2D] to-[#3A5240] shadow-gold">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white/60 text-xs">TOTAL</p>
                          <p className="text-xl font-bold text-[#D8C866]">S/ {totalAmount.toFixed(2)}</p>
                        </div>
                        <DollarSign className="w-8 h-8 text-[#D8C866]/40" />
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )
          })()}
        </DialogContent>
      </Dialog>
    </div>
  )
}
