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
  ArrowRightLeft, User, Smile, FileText, 
  DollarSign, Calendar, Clock, Eye, CheckCircle2, Play
} from 'lucide-react'
import { toothMap } from '@/lib/mock-data'

export function ReferralsList() {
  const { referrals, patients, currentUser, setView } = useAppStore()
  const [selectedReferralId, setSelectedReferralId] = React.useState<string | null>(null)

  const relevantReferrals = currentUser?.role === 'admin' 
    ? referrals 
    : referrals.filter(r => r.doctorId === currentUser?.id)

  const selectedReferral = relevantReferrals.find(r => r.id === selectedReferralId)
  const showBilling = currentUser?.role === 'admin' || currentUser?.role === 'doctor'

  return (
    <div className="p-4 lg:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#2C3E2D]">Derivaciones</h2>
          <p className="text-[#8B948B] text-sm">{relevantReferrals.length} derivación(es) registrada(s)</p>
        </div>
      </div>

      {relevantReferrals.length === 0 ? (
        <Card className="border-0 shadow-md bg-white">
          <CardContent className="py-12 text-center">
            <ArrowRightLeft className="w-12 h-12 text-[#D4DDD6] mx-auto mb-3" />
            <p className="text-[#8B948B]">No hay derivaciones registradas</p>
            <p className="text-[#8B948B] text-sm mt-1">Las derivaciones aparecerán al derivar citas a técnicos</p>
            {(currentUser?.role === 'doctor' || currentUser?.role === 'admin') && (
              <Button onClick={() => setView('appointments')} className="mt-4 bg-[#C9B24A] hover:bg-[#A8922F] text-white">
                Ir a Citas Pendientes
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          <AnimatePresence>
            {relevantReferrals.map((referral, index) => {
              const patient = patients.find(p => p.id === referral.patientId)
              const technician = useAppStore.getState().getUserById(referral.technicianId)
              const totalAmount = referral.toothDiagnoses.reduce((sum, d) => 
                sum + d.treatments.reduce((s, t) => s + t.price, 0), 0)
              return (
                <motion.div
                  key={referral.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="border-0 shadow-md bg-white hover:shadow-gold transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className="w-12 h-12 rounded-xl bg-[#C9B24A]/10 flex items-center justify-center flex-shrink-0">
                            <ArrowRightLeft className="w-5 h-5 text-[#C9B24A]" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-[#2C3E2D] truncate">{patient?.name}</h3>
                            <p className="text-xs text-[#8B948B]">Téc. {technician?.name}</p>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-[10px] text-[#8B948B] flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(referral.referredAt).toLocaleDateString('es-PE')}
                              </span>
                              <span className="text-[10px] text-[#8B948B]">
                                {referral.toothDiagnoses.length} diente(s)
                              </span>
                              {showBilling && totalAmount > 0 && (
                                <span className="text-[10px] font-semibold text-[#A8922F]">
                                  S/ {totalAmount.toFixed(2)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={`text-[10px] ${
                            referral.status === 'referred' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                            referral.status === 'in-attention' ? 'bg-[#C9B24A]/10 text-[#A8922F] border-[#C9B24A]/30' :
                            'bg-emerald-100 text-emerald-700 border-emerald-200'
                          }`}>
                            {referral.status === 'referred' ? 'Derivada' :
                             referral.status === 'in-attention' ? 'En Atención' : 'Completada'}
                          </Badge>
                          <Button variant="outline" size="sm" onClick={() => setSelectedReferralId(referral.id)} className="border-[#C9B24A]/30 text-[#A8922F] h-8">
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
        <DialogContent className="sm:max-w-[550px] bg-white border-0 shadow-gold-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#2C3E2D] flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5 text-[#C9B24A]" />
              Detalle de Derivación
            </DialogTitle>
          </DialogHeader>
          {selectedReferral && (() => {
            const patient = patients.find(p => p.id === selectedReferral.patientId)
            const technician = useAppStore.getState().getUserById(selectedReferral.technicianId)
            const totalAmount = selectedReferral.toothDiagnoses.reduce((sum, d) => 
              sum + d.treatments.reduce((s, t) => s + t.price, 0), 0)
            return (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#F8FAF5] rounded-xl p-3">
                    <p className="text-[10px] text-[#8B948B] uppercase">Paciente</p>
                    <p className="text-sm font-medium text-[#2C3E2D]">{patient?.name}</p>
                  </div>
                  <div className="bg-[#F8FAF5] rounded-xl p-3">
                    <p className="text-[10px] text-[#8B948B] uppercase">Técnico</p>
                    <p className="text-sm font-medium text-[#2C3E2D]">{technician?.name}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {selectedReferral.toothDiagnoses.map(d => {
                    const info = toothMap.find(t => t.number === d.toothNumber)
                    return (
                      <div key={d.id} className="bg-[#F8FAF5] rounded-xl p-3 border border-[#D4DDD6]">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-[#C9B24A]">#{d.toothNumber}</span>
                          <span className="text-xs text-[#8B948B]">{info?.name}</span>
                        </div>
                        {d.treatments.map(t => (
                          <div key={t.id} className="flex items-center justify-between ml-4 py-0.5">
                            <span className="text-xs text-[#56635A]">{t.name}</span>
                            {showBilling && <span className="text-xs font-semibold text-[#A8922F]">S/ {t.price.toFixed(2)}</span>}
                          </div>
                        ))}
                      </div>
                    )
                  })}
                </div>
                {showBilling && totalAmount > 0 && (
                  <div className="bg-gradient-to-r from-[#2C3E2D] to-[#3A5240] rounded-xl p-4 flex items-center justify-between">
                    <span className="text-white/60 text-sm">Total</span>
                    <span className="text-xl font-bold text-[#D8C866]">S/ {totalAmount.toFixed(2)}</span>
                  </div>
                )}
              </div>
            )
          })()}
        </DialogContent>
      </Dialog>
    </div>
  )
}
