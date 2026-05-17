'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useAppStore } from '@/lib/store'
import { ToothDiagnosis, Treatment } from '@/lib/types'
import { toothMap, commonTreatments } from '@/lib/mock-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Smile,
  Plus,
  Trash2,
  ArrowRightLeft,
  FileText,
  User,
  CheckCircle,
  AlertCircle,
  X,
  Edit3,
  ReceiptText,
  Save,
  CheckCircle2,
  Send,
  ClipboardCheck,
  Eye,
  PenLine,
  RotateCcw,
  FileCheck2,
  BadgeCheck,
  Sparkles,
  AlertTriangle,
  Info,
  Wallet,
  ShieldCheck,
} from 'lucide-react'

type PendingTreatment = {
  id: string
  name: string
  price: number
  observations: string
  status: Treatment['status']
}

type ReferralSuccessData = {
  patientName: string
  technicianName: string
  technicianSpecialty?: string
  items: {
    toothNumber: number
    toothName?: string
    treatments: string[]
  }[]
}

type PdfMode = 'preview' | 'download'

type UiToast = {
  id: number
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  description?: string
}

function ToothIcon({
  number,
  size = 'md',
}: {
  number: number
  size?: 'sm' | 'md' | 'lg'
}) {
  const sizes = { sm: 20, md: 28, lg: 36 }
  const s = sizes[size]

  const isMolar = [
    1, 2, 3, 14, 15, 16, 17, 18, 19, 30, 31, 32,
  ].includes(number)

  const isPremolar = [4, 5, 12, 13, 20, 21, 28, 29].includes(number)
  const isCanine = [6, 11, 22, 27].includes(number)

  if (isMolar) {
    return (
      <svg width={s} height={s} viewBox="0 0 36 36" fill="none">
        <rect
          x="2"
          y="4"
          width="32"
          height="28"
          rx="6"
          fill="currentColor"
          opacity="0.15"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path d="M10 12 L18 8 L26 12" stroke="currentColor" strokeWidth="1" opacity="0.5" />
        <path d="M8 20 L18 16 L28 20" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      </svg>
    )
  }

  if (isPremolar) {
    return (
      <svg width={s} height={s} viewBox="0 0 36 36" fill="none">
        <rect
          x="4"
          y="6"
          width="28"
          height="24"
          rx="5"
          fill="currentColor"
          opacity="0.15"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path d="M12 14 L18 10 L24 14" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      </svg>
    )
  }

  if (isCanine) {
    return (
      <svg width={s} height={s} viewBox="0 0 36 36" fill="none">
        <path
          d="M12 6 L24 6 L26 12 L22 30 L14 30 L10 12 Z"
          fill="currentColor"
          opacity="0.15"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    )
  }

  return (
    <svg width={s} height={s} viewBox="0 0 36 36" fill="none">
      <rect
        x="8"
        y="4"
        width="20"
        height="28"
        rx="4"
        fill="currentColor"
        opacity="0.15"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <line
        x1="18"
        y1="6"
        x2="18"
        y2="30"
        stroke="currentColor"
        strokeWidth="0.8"
        opacity="0.4"
      />
    </svg>
  )
}

function ToothButton({
  toothNumber,
  isSelected,
  hasDiagnosis,
  onClick,
}: {
  toothNumber: number
  isSelected: boolean
  hasDiagnosis: boolean
  onClick: () => void
}) {
  const toothInfo = toothMap.find((t) => t.number === toothNumber)

  return (
    <motion.button
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
        tooth-btn relative flex flex-col items-center justify-center p-1.5 rounded-xl border-2 cursor-pointer transition-all
        ${
          isSelected
            ? 'border-[#C9B24A] bg-[#C9B24A]/15 selected'
            : hasDiagnosis
              ? 'border-[#C9B24A]/40 bg-[#C9B24A]/8 diagnosed'
              : 'border-[#D4DDD6] bg-white hover:border-[#C9B24A]/40 hover:bg-[#C9B24A]/5'
        }
      `}
      title={`${toothNumber} - ${toothInfo?.name || ''}`}
    >
      <div
        className={`${
          isSelected
            ? 'text-[#C9B24A]'
            : hasDiagnosis
              ? 'text-[#A8922F]'
              : 'text-[#8B948B]'
        }`}
      >
        <ToothIcon number={toothNumber} size="sm" />
      </div>

      <span
        className={`text-[9px] font-bold mt-0.5 ${
          isSelected
            ? 'text-[#C9B24A]'
            : hasDiagnosis
              ? 'text-[#A8922F]'
              : 'text-[#8B948B]'
        }`}
      >
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
    selectedAppointmentId,
    selectedPatientId,
    selectedTooth,
    setSelectedTooth,
    diagnoses,
    addDiagnosis,
    updateDiagnosis,
    removeDiagnosis,
    patients,
    appointments,
    currentUser,
    setView,
    updateAppointmentStatus,
    getTechnicians,
  } = useAppStore()

  const signatureCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const lastPointRef = useRef<{ x: number; y: number } | null>(null)

  const [showDiagnosisDialog, setShowDiagnosisDialog] = useState(false)
  const [showSaveDiagnosisConfirm, setShowSaveDiagnosisConfirm] =
    useState(false)
  const [showReferralDialog, setShowReferralDialog] = useState(false)
  const [showPreviewDialog, setShowPreviewDialog] = useState(false)
  const [showSignatureDialog, setShowSignatureDialog] = useState(false)
  const [showReferralSuccessDialog, setShowReferralSuccessDialog] =
    useState(false)

  const [toasts, setToasts] = useState<UiToast[]>([])
  const [diagnosisValidation, setDiagnosisValidation] = useState('')
  const [referralValidation, setReferralValidation] = useState('')
  const [previewValidation, setPreviewValidation] = useState('')

  const [initialDiagnosisSnapshot, setInitialDiagnosisSnapshot] = useState('')

  const [referralSuccessData, setReferralSuccessData] =
    useState<ReferralSuccessData | null>(null)

  const [selectedTreatmentName, setSelectedTreatmentName] = useState('')
  const [newTreatment, setNewTreatment] = useState({
    name: '',
    price: 0,
    observations: '',
  })

  const [pendingTreatments, setPendingTreatments] = useState<PendingTreatment[]>(
    []
  )

  const [toothObservations, setToothObservations] = useState('')
  const [selectedTechnician, setSelectedTechnician] = useState('')
  const [referralNotes, setReferralNotes] = useState('')
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false)
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false)
  const [budgetDiscount, setBudgetDiscount] = useState(0)
  const [budgetFinalized, setBudgetFinalized] = useState(false)
  const [previewPdfUrl, setPreviewPdfUrl] = useState('')
  const [hasPatientSignature, setHasPatientSignature] = useState(false)
  const [patientSignatureDataUrl, setPatientSignatureDataUrl] = useState('')
  const [previewIncludesSignature, setPreviewIncludesSignature] =
    useState(false)

  const appointment = appointments.find((a) => a.id === selectedAppointmentId)
  const patient = patients.find((p) => p.id === selectedPatientId)

  const appointmentDiagnoses = useMemo(
    () => diagnoses.filter((d) => d.appointmentId === selectedAppointmentId),
    [diagnoses, selectedAppointmentId]
  )

  const currentToothDiagnosis = selectedTooth
    ? appointmentDiagnoses.find((d) => d.toothNumber === selectedTooth)
    : null

  const technicians = getTechnicians()

  const upperTeeth = Array.from({ length: 16 }, (_, i) => i + 1)
  const lowerTeeth = Array.from({ length: 16 }, (_, i) => i + 17)

  const showBilling =
    currentUser?.role === 'admin' || currentUser?.role === 'doctor'

  const totalAmount = appointmentDiagnoses.reduce((sum, diagnosis) => {
    return (
      sum +
      diagnosis.treatments.reduce((subtotal, treatment) => {
        return subtotal + Number(treatment.price || 0)
      }, 0)
    )
  }, 0)

  const normalizedDiscount = Math.min(
    Math.max(Number(budgetDiscount || 0), 0),
    totalAmount
  )

  const finalAmount = Math.max(totalAmount - normalizedDiscount, 0)

  const totalTreatments = appointmentDiagnoses.reduce(
    (sum, d) => sum + d.treatments.length,
    0
  )

  const sortedDiagnoses = useMemo(() => {
    return [...appointmentDiagnoses].sort(
      (a, b) => a.toothNumber - b.toothNumber
    )
  }, [appointmentDiagnoses])

  const formatCurrency = (value: number) => {
    return `S/ ${Number(value || 0).toLocaleString('es-PE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`
  }

  const showToast = (
    type: UiToast['type'],
    title: string,
    description?: string
  ) => {
    const id = Date.now()

    setToasts((prev) => [
      ...prev,
      {
        id,
        type,
        title,
        description,
      },
    ])

    window.setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, 4200)
  }

  const getToastIcon = (type: UiToast['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-600" />
      default:
        return <Info className="w-5 h-5 text-[#C9B24A]" />
    }
  }

  const getToastClass = (type: UiToast['type']) => {
    switch (type) {
      case 'success':
        return 'border-emerald-200 bg-emerald-50'
      case 'error':
        return 'border-red-200 bg-red-50'
      case 'warning':
        return 'border-amber-200 bg-amber-50'
      default:
        return 'border-[#D8C866]/40 bg-[#FFFBE8]'
    }
  }

  const getDiagnosisSnapshot = (
    treatments: PendingTreatment[],
    observations: string
  ) => {
    return JSON.stringify({
      treatments: treatments.map((t) => ({
        id: t.id,
        name: t.name,
        price: Number(t.price || 0),
        observations: t.observations || '',
        status: t.status,
      })),
      observations: observations || '',
    })
  }

  const hasDiagnosisChanges = () => {
    const currentSnapshot = getDiagnosisSnapshot(
      pendingTreatments,
      toothObservations
    )

    const hasDraftTreatment =
      selectedTreatmentName.trim() !== '' ||
      newTreatment.name.trim() !== '' ||
      Number(newTreatment.price || 0) > 0 ||
      newTreatment.observations.trim() !== ''

    return currentSnapshot !== initialDiagnosisSnapshot || hasDraftTreatment
  }

  const getPatientAge = () => {
    const anyPatient = patient as any

    if (anyPatient?.age) return String(anyPatient.age)
    if (anyPatient?.edad) return String(anyPatient.edad)

    return ''
  }

  const getPatientAddress = () => {
    const anyPatient = patient as any

    return anyPatient?.address || anyPatient?.direccion || ''
  }

  const getBudgetDate = () => {
    if (appointment?.date) return appointment.date

    const now = new Date()
    const day = String(now.getDate()).padStart(2, '0')
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const year = now.getFullYear()

    return `${day}/${month}/${year}`
  }

  const invalidateSignedBudget = () => {
    setBudgetFinalized(false)
    setPatientSignatureDataUrl('')
    setPreviewIncludesSignature(false)
  }

  const loadImageAsDataUrl = async (imagePath: string) => {
    const response = await fetch(imagePath)

    if (!response.ok) {
      throw new Error(`No se pudo cargar la imagen: ${imagePath}`)
    }

    const blob = await response.blob()

    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()

      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  }

  const initializeSignatureCanvas = () => {
    const canvas = signatureCanvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d')
    if (!context) return

    context.clearRect(0, 0, canvas.width, canvas.height)
    context.fillStyle = '#FFFFFF'
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.lineCap = 'round'
    context.lineJoin = 'round'
    context.strokeStyle = '#1F2937'
    context.lineWidth = 3

    setHasPatientSignature(false)
    lastPointRef.current = null
  }

  useEffect(() => {
    if (showSignatureDialog) {
      window.setTimeout(() => {
        initializeSignatureCanvas()
      }, 80)
    }
  }, [showSignatureDialog])

  useEffect(() => {
    return () => {
      if (previewPdfUrl) {
        URL.revokeObjectURL(previewPdfUrl)
      }
    }
  }, [previewPdfUrl])

  const getCanvasPoint = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = signatureCanvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY,
    }
  }

  const startSignature = (event: React.PointerEvent<HTMLCanvasElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId)

    const point = getCanvasPoint(event)
    lastPointRef.current = point
  }

  const drawSignature = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = signatureCanvasRef.current
    const context = canvas?.getContext('2d')

    if (!canvas || !context || !lastPointRef.current) return

    const point = getCanvasPoint(event)

    context.beginPath()
    context.moveTo(lastPointRef.current.x, lastPointRef.current.y)
    context.lineTo(point.x, point.y)
    context.stroke()

    lastPointRef.current = point
    setHasPatientSignature(true)
  }

  const finishSignature = () => {
    lastPointRef.current = null
  }

  const clearSignature = () => {
    initializeSignatureCanvas()
    setPatientSignatureDataUrl('')
    setPreviewIncludesSignature(false)
    setBudgetFinalized(false)

    showToast(
      'info',
      'Firma limpiada',
      'El paciente puede volver a firmar dentro del recuadro.'
    )
  }

  const getSignatureDataUrl = () => {
    const canvas = signatureCanvasRef.current
    if (!canvas || !hasPatientSignature) return ''

    return canvas.toDataURL('image/png')
  }

  const handleToothClick = (toothNumber: number) => {
    setSelectedTooth(toothNumber)
    setDiagnosisValidation('')

    const existing = appointmentDiagnoses.find(
      (d) => d.toothNumber === toothNumber
    )

    let loadedTreatments: PendingTreatment[] = []
    let loadedObservations = ''

    if (existing) {
      loadedObservations = existing.observations || ''
      loadedTreatments = existing.treatments.map((t) => ({
        id: t.id,
        name: t.name,
        price: Number(t.price || 0),
        observations: t.observations || '',
        status: (t.status || 'pending') as Treatment['status'],
      }))
    }

    setToothObservations(loadedObservations)
    setPendingTreatments(loadedTreatments)

    setSelectedTreatmentName('')
    setNewTreatment({
      name: '',
      price: 0,
      observations: '',
    })

    setInitialDiagnosisSnapshot(
      getDiagnosisSnapshot(loadedTreatments, loadedObservations)
    )

    setShowDiagnosisDialog(true)
  }

  const closeDiagnosisDialogSafely = () => {
    if (hasDiagnosisChanges()) {
      const message =
        'Tienes cambios sin guardar en este diente. Guarda el diagnóstico o elimina los datos ingresados antes de cerrar.'

      setDiagnosisValidation(message)
      showToast('warning', 'Cambios sin guardar', message)
      return
    }

    setDiagnosisValidation('')
    setShowDiagnosisDialog(false)
  }

  const forceDiscardDiagnosisChanges = () => {
    setDiagnosisValidation('')
    setSelectedTreatmentName('')
    setNewTreatment({
      name: '',
      price: 0,
      observations: '',
    })
    setPendingTreatments([])
    setToothObservations('')
    setShowDiagnosisDialog(false)
  }

  const handleSelectTreatment = (value: string) => {
    setDiagnosisValidation('')
    setSelectedTreatmentName(value)
    setNewTreatment((prev) => ({ ...prev, name: value }))
  }

  const validateNewTreatment = () => {
    if (!newTreatment.name.trim()) {
      return 'Selecciona un tratamiento antes de agregarlo.'
    }

    if (Number(newTreatment.price || 0) <= 0) {
      return 'Ingresa un precio mayor a 0 para el tratamiento seleccionado.'
    }

    return ''
  }

  const handleAddTreatmentToPending = () => {
    const validationMessage = validateNewTreatment()

    if (validationMessage) {
      setDiagnosisValidation(validationMessage)
      showToast('warning', 'Tratamiento incompleto', validationMessage)
      return
    }

    const treatment: PendingTreatment = {
      id: `treatment-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 9)}`,
      name: newTreatment.name.trim(),
      price: Number(newTreatment.price || 0),
      observations: newTreatment.observations.trim(),
      status: 'pending',
    }

    setPendingTreatments((prev) => [...prev, treatment])

    setSelectedTreatmentName('')
    setNewTreatment({
      name: '',
      price: 0,
      observations: '',
    })

    setDiagnosisValidation('')
    showToast(
      'success',
      'Tratamiento agregado',
      'El tratamiento quedó en la lista pendiente de guardar.'
    )
  }

  const handleRemovePendingTreatment = (treatmentId: string) => {
    setPendingTreatments((prev) => prev.filter((t) => t.id !== treatmentId))
  }

  const requestSaveDiagnosis = () => {
    if (!selectedTooth || !selectedAppointmentId || !selectedPatientId) return

    const hasDraftTreatment =
      selectedTreatmentName.trim() !== '' ||
      newTreatment.name.trim() !== '' ||
      Number(newTreatment.price || 0) > 0 ||
      newTreatment.observations.trim() !== ''

    if (hasDraftTreatment) {
      const message =
        'Tienes un tratamiento escrito o seleccionado que aún no fue agregado. Presiona “Agregar Tratamiento” antes de guardar el diagnóstico.'

      setDiagnosisValidation(message)
      showToast('warning', 'Tratamiento pendiente', message)
      return
    }

    if (pendingTreatments.length === 0 && !toothObservations.trim()) {
      const message =
        'Agrega al menos un tratamiento o una observación clínica para guardar el diagnóstico.'

      setDiagnosisValidation(message)
      showToast('warning', 'Diagnóstico vacío', message)
      return
    }

    const invalidTreatment = pendingTreatments.find((t) => Number(t.price) <= 0)

    if (invalidTreatment) {
      const message = `El tratamiento “${invalidTreatment.name}” debe tener un precio mayor a 0.`

      setDiagnosisValidation(message)
      showToast('warning', 'Precio inválido', message)
      return
    }

    setDiagnosisValidation('')
    setShowSaveDiagnosisConfirm(true)
  }

  const persistDiagnosis = () => {
    if (!selectedTooth || !selectedAppointmentId || !selectedPatientId) return

    const treatmentsToSave: Treatment[] = pendingTreatments.map((t) => ({
      id: t.id,
      name: t.name,
      price: Number(t.price || 0),
      observations: t.observations,
      status: t.status,
    })) as Treatment[]

    if (currentToothDiagnosis) {
      updateDiagnosis(currentToothDiagnosis.id, {
        treatments: treatmentsToSave,
        observations: toothObservations,
      })
    } else {
      const diagnosis: ToothDiagnosis = {
        id: `diagnosis-${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 9)}`,
        appointmentId: selectedAppointmentId,
        patientId: selectedPatientId,
        toothNumber: selectedTooth,
        treatments: treatmentsToSave,
        observations: toothObservations,
        diagnosedAt: new Date().toISOString(),
        diagnosedBy: currentUser?.id || '',
      }

      addDiagnosis(diagnosis)
    }

    invalidateSignedBudget()

    setSelectedTreatmentName('')
    setNewTreatment({
      name: '',
      price: 0,
      observations: '',
    })
    setPendingTreatments([])
    setToothObservations('')
    setInitialDiagnosisSnapshot('')
    setDiagnosisValidation('')
    setShowSaveDiagnosisConfirm(false)
    setShowDiagnosisDialog(false)

    showToast(
      'success',
      'Diagnóstico guardado',
      `El diagnóstico del diente #${selectedTooth} fue guardado correctamente.`
    )
  }

  const handleRemoveDiagnosis = (diagnosisId: string) => {
    invalidateSignedBudget()
    removeDiagnosis(diagnosisId)

    showToast(
      'info',
      'Diente retirado',
      'El diente fue retirado del presupuesto actual.'
    )
  }

  const handleRemoveTreatment = (diagnosisId: string, treatmentId: string) => {
    const diagnosis = diagnoses.find((d) => d.id === diagnosisId)

    if (!diagnosis) return

    const updatedTreatments = diagnosis.treatments.filter(
      (t) => t.id !== treatmentId
    )

    invalidateSignedBudget()

    if (updatedTreatments.length === 0) {
      removeDiagnosis(diagnosisId)
    } else {
      updateDiagnosis(diagnosisId, { treatments: updatedTreatments })
    }

    showToast(
      'info',
      'Tratamiento retirado',
      'El tratamiento fue retirado del presupuesto.'
    )
  }

  const handleUpdateTreatmentPrice = (
    diagnosisId: string,
    treatmentId: string,
    value: number
  ) => {
    const diagnosis = diagnoses.find((d) => d.id === diagnosisId)

    if (!diagnosis) return

    const updatedTreatments = diagnosis.treatments.map((t) => {
      if (t.id !== treatmentId) return t

      return {
        ...t,
        price: Number(value || 0),
      } as Treatment
    })

    invalidateSignedBudget()
    updateDiagnosis(diagnosisId, { treatments: updatedTreatments })
  }

  const handleCompleteDiagnosis = () => {
    if (appointment) {
      updateAppointmentStatus(appointment.id, 'diagnosed')
      showToast(
        'success',
        'Diagnóstico completado',
        'La cita fue marcada como diagnosticada.'
      )
    }
  }

  const handleReferToTechnician = () => {
    setReferralValidation('')

    if (!budgetFinalized) {
      const message =
        'Primero debes generar el PDF firmado para habilitar la derivación al técnico.'

      setReferralValidation(message)
      showToast('warning', 'Presupuesto pendiente', message)
      return
    }

    if (!selectedTechnician) {
      const message = 'Selecciona un técnico antes de realizar la derivación.'

      setReferralValidation(message)
      showToast('warning', 'Técnico no seleccionado', message)
      return
    }

    if (!appointment || !patient) return

    const technician = technicians.find((tech) => tech.id === selectedTechnician)

    const referral = {
      id: `referral-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 9)}`,
      appointmentId: appointment.id,
      patientId: appointment.patientId,
      doctorId: currentUser?.id || '',
      technicianId: selectedTechnician,
      toothDiagnoses: appointmentDiagnoses,
      referredAt: new Date().toISOString(),
      status: 'referred' as const,
      notes: referralNotes,
      budget: {
        subtotal: totalAmount,
        discount: normalizedDiscount,
        total: finalAmount,
      },
    }

    const { addReferral, assignTechnicianToAppointment } =
      useAppStore.getState()

    addReferral(referral as any)
    assignTechnicianToAppointment(appointment.id, selectedTechnician)
    updateAppointmentStatus(appointment.id, 'referred')

    setReferralSuccessData({
      patientName: patient.name,
      technicianName: technician?.name || 'Técnico seleccionado',
      technicianSpecialty: technician?.specialty,
      items: appointmentDiagnoses.map((diagnosis) => {
        const toothInfo = toothMap.find(
          (t) => t.number === diagnosis.toothNumber
        )

        return {
          toothNumber: diagnosis.toothNumber,
          toothName: toothInfo?.name,
          treatments: diagnosis.treatments.map((t) => t.name),
        }
      }),
    })

    setShowReferralDialog(false)
    setShowReferralSuccessDialog(true)

    showToast(
      'success',
      'Derivación realizada',
      'La atención fue enviada correctamente al técnico.'
    )
  }

  const buildBudgetPdf = async ({
    mode,
    signatureDataUrl = '',
  }: {
    mode: PdfMode
    signatureDataUrl?: string
  }) => {
    if (!patient || !appointment) return ''

    const { default: jsPDF } = await import('jspdf')

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    })

    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()

    const marginX = 14
    let y = 18

    let logoDataUrl = ''
    let doctorSignatureDataUrl = ''

    try {
      logoDataUrl = await loadImageAsDataUrl('/images/logodental.png')
    } catch (error) {
      console.warn('No se pudo cargar el logo para el PDF:', error)
    }

    try {
      doctorSignatureDataUrl = await loadImageAsDataUrl('/images/firmadoctora.jpg')
    } catch (error) {
      console.warn('No se pudo cargar la firma de la doctora:', error)
    }

    const drawHeaderLogo = () => {
      if (logoDataUrl) {
        doc.addImage(logoDataUrl, 'PNG', pageWidth - 58, 8, 18, 18)
      }

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(12)
      doc.setTextColor(154, 132, 39)
      doc.text('MARFIL STETIC', pageWidth - 58, 31)
      doc.setTextColor(0, 0, 0)
    }

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(18)
    doc.setTextColor(35, 35, 35)
    doc.text('PRESUPUESTO ODONTOLOGICO', marginX, y)

    drawHeaderLogo()

    y += 12

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.text(`Nombre completo: ${patient.name}`, marginX, y)
    y += 6
    doc.text(`Edad: ${getPatientAge()}`, marginX, y)
    y += 6
    doc.text(`DNI: ${(patient as any).dni || ''}`, marginX, y)
    y += 6
    doc.text(`Teléfono: ${(patient as any).phone || ''}`, marginX, y)
    y += 6
    doc.text(`Dirección: ${getPatientAddress()}`, marginX, y)
    y += 6
    doc.text(`Fecha: ${getBudgetDate()}`, marginX, y)

    y += 12

    const colX = {
      unid: marginX,
      treatment: marginX + 16,
      price: marginX + 118,
      subtotal: marginX + 155,
    }

    const tableWidth = pageWidth - marginX * 2

    const drawTableHeader = () => {
      doc.setDrawColor(70, 70, 70)
      doc.setLineWidth(0.2)

      doc.setFillColor(245, 246, 241)
      doc.rect(marginX, y - 5, tableWidth, 9, 'FD')

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(8.5)
      doc.text('UNID', colX.unid + 2, y)
      doc.text('TRATAMIENTO INTEGRAL Y ESTETICO', colX.treatment, y)
      doc.text('PRECIO', colX.price, y)
      doc.text('SUB TOTAL', colX.subtotal, y)

      y += 6
      doc.line(marginX, y, pageWidth - marginX, y)
    }

    drawTableHeader()

    const rows = appointmentDiagnoses.flatMap((diagnosis) =>
      diagnosis.treatments.map((treatment) => {
        const price = Number(treatment.price || 0)

        return {
          unit: 1,
          tooth: diagnosis.toothNumber,
          name: treatment.name,
          observations: treatment.observations || '',
          price,
          subtotal: price,
        }
      })
    )

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8.5)

    rows.forEach((row) => {
      const treatmentText = `Diente ${row.tooth}: ${row.name}${
        row.observations ? ` (${row.observations})` : ''
      }`

      const lines = doc.splitTextToSize(treatmentText, 96)
      const rowHeight = Math.max(10, lines.length * 4.4 + 4)

      if (y + rowHeight > pageHeight - 55) {
        doc.addPage()
        y = 18
        drawHeaderLogo()
        y = 42
        drawTableHeader()
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(8.5)
      }

      const rowTop = y
      doc.rect(marginX, rowTop, tableWidth, rowHeight)

      doc.text(String(row.unit), colX.unid + 4, rowTop + 6)
      doc.text(lines, colX.treatment, rowTop + 6)
      doc.text(formatCurrency(row.price), colX.price, rowTop + 6)
      doc.text(formatCurrency(row.subtotal), colX.subtotal, rowTop + 6)

      y += rowHeight
    })

    y += 8

    if (y > pageHeight - 80) {
      doc.addPage()
      y = 24
    }

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.text('SUBTOTAL DEL PRESUPUESTO EN SOLES', marginX, y)
    doc.text(formatCurrency(totalAmount), pageWidth - marginX - 42, y)

    y += 7

    doc.text('DESCUENTO', marginX, y)
    doc.text(
      `- ${formatCurrency(normalizedDiscount)}`,
      pageWidth - marginX - 42,
      y
    )

    y += 7

    doc.setFontSize(11)
    doc.text('TOTAL FINAL DEL PRESUPUESTO EN SOLES', marginX, y)
    doc.text(formatCurrency(finalAmount), pageWidth - marginX - 42, y)

    y += 36

    if (y > pageHeight - 35) {
      doc.addPage()
      y = 60
    }

    const patientLineStart = marginX + 22
    const patientLineEnd = marginX + 70
    const doctorLineStart = pageWidth - marginX - 72
    const doctorLineEnd = pageWidth - marginX - 22

    if (signatureDataUrl) {
      doc.addImage(
        signatureDataUrl,
        'PNG',
        patientLineStart + 2,
        y - 22,
        44,
        18
      )
    }

    if (doctorSignatureDataUrl) {
      doc.addImage(
        doctorSignatureDataUrl,
        'JPEG',
        doctorLineStart + 2,
        y - 22,
        44,
        18
      )
    }

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(0, 0, 0)

    doc.line(patientLineStart, y, patientLineEnd, y)
    doc.line(doctorLineStart, y, doctorLineEnd, y)

    y += 6

    doc.text('Firma de Paciente', marginX + 28, y)
    doc.text('Firma de Dr(a)', pageWidth - marginX - 62, y)

    doc.setFontSize(8.5)
    doc.setTextColor(80, 80, 80)
    doc.text(
      'Dirección al pie: Calle Brea y Pariñas 102 - Santiago de Surco',
      marginX,
      pageHeight - 12
    )

    const safePatientName = patient.name
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '_')

    if (mode === 'download') {
      doc.save(`presupuesto_${safePatientName || 'paciente'}.pdf`)
      return ''
    }

    const blob = doc.output('blob')
    return URL.createObjectURL(blob)
  }

  const createPreviewPdf = async ({
    signatureDataUrl = '',
  }: {
    signatureDataUrl?: string
  }) => {
    setPreviewValidation('')

    if (!patient || !appointment) {
      const message = 'No se encontró una cita o paciente seleccionado.'
      setPreviewValidation(message)
      showToast('error', 'No se puede previsualizar', message)
      return
    }

    if (appointmentDiagnoses.length === 0) {
      const message = 'Agrega al menos un diagnóstico antes de previsualizar el presupuesto.'
      setPreviewValidation(message)
      showToast('warning', 'Presupuesto vacío', message)
      return
    }

    const invalidTreatment = appointmentDiagnoses
      .flatMap((d) => d.treatments)
      .find((t) => Number(t.price || 0) <= 0)

    if (invalidTreatment) {
      const message = `El tratamiento “${invalidTreatment.name}” tiene precio 0. Corrige el precio antes de previsualizar.`

      setPreviewValidation(message)
      showToast('warning', 'Precio pendiente', message)
      return
    }

    setIsGeneratingPreview(true)

    try {
      if (previewPdfUrl) {
        URL.revokeObjectURL(previewPdfUrl)
        setPreviewPdfUrl('')
      }

      const url = await buildBudgetPdf({
        mode: 'preview',
        signatureDataUrl,
      })

      setPreviewPdfUrl(url)
      setPreviewIncludesSignature(Boolean(signatureDataUrl))
      setShowPreviewDialog(true)
    } catch (error) {
      console.error('Error generando previsualización:', error)
      const message = 'No se pudo generar la previsualización del PDF.'

      setPreviewValidation(message)
      showToast('error', 'Error de previsualización', message)
    } finally {
      setIsGeneratingPreview(false)
    }
  }

  const handleOpenBudgetPreview = async () => {
    await createPreviewPdf({
      signatureDataUrl: '',
    })
  }

  const handlePreviewSignedBudget = async () => {
    const signatureDataUrl = getSignatureDataUrl()

    if (!signatureDataUrl) {
      const message = 'Debe registrar la firma del paciente antes de previsualizar el PDF firmado.'
      showToast('warning', 'Firma requerida', message)
      return
    }

    setPatientSignatureDataUrl(signatureDataUrl)
    setShowSignatureDialog(false)

    await createPreviewPdf({
      signatureDataUrl,
    })
  }

  const handleGenerateSignedPdf = async () => {
    if (!patient || !appointment) return

    if (!patientSignatureDataUrl) {
      const message = 'Debe registrar y previsualizar la firma antes de generar el PDF.'

      showToast('warning', 'Firma pendiente', message)
      return
    }

    if (!previewIncludesSignature) {
      const message = 'Primero previsualiza el PDF con la firma incrustada antes de generar el documento final.'

      showToast('warning', 'Previsualización requerida', message)
      return
    }

    setIsGeneratingPdf(true)

    try {
      await buildBudgetPdf({
        mode: 'download',
        signatureDataUrl: patientSignatureDataUrl,
      })

      updateAppointmentStatus(appointment.id, 'diagnosed')
      setBudgetFinalized(true)
      setShowPreviewDialog(false)

      showToast(
        'success',
        'PDF firmado generado',
        'Ahora puedes derivar la atención al técnico.'
      )
    } catch (error) {
      console.error('Error generando PDF firmado:', error)
      showToast(
        'error',
        'Error al generar PDF',
        'Verifique que jspdf esté instalado y que las imágenes existan en public/images.'
      )
    } finally {
      setIsGeneratingPdf(false)
    }
  }

  if (!appointment || !patient) {
    return (
      <div className="p-4 lg:p-6">
        <Card className="border-0 shadow-md bg-white">
          <CardContent className="py-12 text-center">
            <AlertCircle className="w-12 h-12 text-[#D4DDD6] mx-auto mb-3" />
            <p className="text-[#8B948B]">No se ha seleccionado una cita</p>
            <Button
              onClick={() => setView('appointments')}
              className="mt-4 bg-[#C9B24A] hover:bg-[#A8922F] text-white"
            >
              Ver Citas Pendientes
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="relative h-full flex flex-col lg:flex-row">
      <div className="fixed top-4 right-4 z-[9999] space-y-3 w-[340px] max-w-[calc(100vw-2rem)]">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 40, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.96 }}
              className={`rounded-2xl border p-4 shadow-[0_18px_60px_rgba(44,62,45,0.16)] backdrop-blur-xl ${getToastClass(toast.type)}`}
            >
              <div className="flex gap-3">
                <div className="flex-shrink-0">{getToastIcon(toast.type)}</div>
                <div>
                  <p className="text-sm font-bold text-[#2C3E2D]">{toast.title}</p>
                  {toast.description && (
                    <p className="text-xs text-[#56635A] mt-1 leading-relaxed">
                      {toast.description}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div
        className={`flex-1 p-4 lg:p-6 space-y-4 overflow-y-auto ${
          showBilling ? 'lg:max-w-[60%]' : ''
        }`}
      >
        <Card className="border-0 shadow-md bg-gradient-to-r from-[#2C3E2D] to-[#3A5240]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#C9B24A]/20 flex items-center justify-center">
                  <User className="w-6 h-6 text-[#D8C866]" />
                </div>

                <div>
                  <h3 className="text-white font-semibold text-lg">
                    {patient.name}
                  </h3>
                  <p className="text-white/60 text-sm">
                    DNI: {(patient as any).dni || ''} •{' '}
                    {(patient as any).phone || ''}
                  </p>
                </div>
              </div>

              <div className="text-right hidden sm:block">
                <p className="text-white/60 text-xs">
                  Cita: {appointment.date} - {appointment.time}
                </p>
                <p className="text-white/60 text-xs">{appointment.reason}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-white">
          <CardHeader className="pb-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="text-[#2C3E2D] text-base flex items-center gap-2">
                <Smile className="w-5 h-5 text-[#C9B24A]" />
                Odontograma
              </CardTitle>

              <div className="flex flex-wrap items-center gap-2 text-xs text-[#8B948B]">
                <div className="w-3 h-3 rounded-full bg-white border-2 border-[#D4DDD6]" />
                Sin diagnóstico

                <div className="w-3 h-3 rounded-full bg-[#C9B24A]/20 border-2 border-[#C9B24A]/40 ml-2" />
                Diagnosticado
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="text-center mb-2">
                  <span className="text-xs font-medium text-[#8B948B] bg-[#F8FAF5] px-3 py-1 rounded-full">
                    MAXILAR SUPERIOR
                  </span>
                </div>

                <div className="flex justify-center">
                  <div className="grid grid-cols-8 gap-1.5 sm:gap-2 max-w-lg">
                    {upperTeeth.map((toothNum) => (
                      <ToothButton
                        key={toothNum}
                        toothNumber={toothNum}
                        isSelected={selectedTooth === toothNum}
                        hasDiagnosis={appointmentDiagnoses.some(
                          (d) => d.toothNumber === toothNum
                        )}
                        onClick={() => handleToothClick(toothNum)}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t-2 border-dashed border-[#C9B24A]/30" />
                </div>

                <div className="relative flex justify-center">
                  <span className="bg-white px-3 text-[10px] font-bold text-[#C9B24A]">
                    LINEA MEDIA
                  </span>
                </div>
              </div>

              <div>
                <div className="flex justify-center">
                  <div className="grid grid-cols-8 gap-1.5 sm:gap-2 max-w-lg">
                    {lowerTeeth.map((toothNum) => (
                      <ToothButton
                        key={toothNum}
                        toothNumber={toothNum}
                        isSelected={selectedTooth === toothNum}
                        hasDiagnosis={appointmentDiagnoses.some(
                          (d) => d.toothNumber === toothNum
                        )}
                        onClick={() => handleToothClick(toothNum)}
                      />
                    ))}
                  </div>
                </div>

                <div className="text-center mt-2">
                  <span className="text-xs font-medium text-[#8B948B] bg-[#F8FAF5] px-3 py-1 rounded-full">
                    MAXILAR INFERIOR
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-white">
          <CardContent className="p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-bold text-[#2C3E2D]">
                  Acciones del diagnóstico
                </p>
                <p className="text-xs text-[#8B948B] mt-0.5">
                  Previsualiza, firma, revisa nuevamente y genera el PDF firmado.
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                {appointmentDiagnoses.length > 0 &&
                  appointment.status === 'in-progress' && (
                    <Button
                      onClick={handleCompleteDiagnosis}
                      className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-md"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Completar Diagnóstico
                    </Button>
                  )}

                {appointmentDiagnoses.length > 0 && (
                  <Button
                    onClick={() => {
                      if (!budgetFinalized) {
                        showToast(
                          'warning',
                          'Derivación bloqueada',
                          'Primero genera el PDF firmado para habilitar la derivación.'
                        )
                      }
                      setShowReferralDialog(true)
                    }}
                    disabled={!budgetFinalized}
                    className={
                      budgetFinalized
                        ? 'group h-11 rounded-xl bg-gradient-to-r from-[#C9B24A] via-[#D8C866] to-[#A8922F] hover:from-[#D8C866] hover:to-[#C9B24A] text-white shadow-[0_12px_28px_rgba(201,178,74,0.34)] transition-all duration-300'
                        : 'h-11 rounded-xl bg-[#E5E8E2] text-[#8B948B] cursor-not-allowed border border-[#D4DDD6]'
                    }
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className={
                          budgetFinalized
                            ? 'w-7 h-7 rounded-lg bg-white/18 flex items-center justify-center'
                            : 'w-7 h-7 rounded-lg bg-white/60 flex items-center justify-center'
                        }
                      >
                        <ArrowRightLeft className="w-4 h-4" />
                      </span>
                      Derivar a Técnico
                    </span>
                  </Button>
                )}
              </div>
            </div>

            {!budgetFinalized && appointmentDiagnoses.length > 0 && (
              <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
                Para derivar al técnico primero debes generar el PDF firmado.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {showBilling && (
        <aside className="w-full lg:w-[40%] lg:min-w-[410px] border-l border-[#D4DDD6] bg-[#F8FAF5] lg:h-[calc(100vh-64px)] flex flex-col">
          <div className="p-4 lg:p-5 border-b border-[#D4DDD6] bg-white/90 backdrop-blur-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#C9B24A]/20 to-[#2C3E2D]/10 flex items-center justify-center border border-[#D8C866]/30">
                  <ReceiptText className="w-5 h-5 text-[#A8922F]" />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-[#2C3E2D]">
                    Panel de Cobros
                  </h3>
                  <p className="text-xs text-[#8B948B]">
                    {appointmentDiagnoses.length} diente(s) • {totalTreatments}{' '}
                    tratamiento(s)
                  </p>
                </div>
              </div>

              {appointmentDiagnoses.length > 0 && (
                <Button
                  onClick={handleOpenBudgetPreview}
                  disabled={isGeneratingPreview}
                  className="group h-12 rounded-2xl px-4 bg-gradient-to-r from-[#2C3E2D] via-[#3A5240] to-[#1E2D20] hover:from-[#3A5240] hover:via-[#2C3E2D] hover:to-[#3A5240] text-white shadow-[0_16px_34px_rgba(44,62,45,0.24)] border border-white/10 transition-all duration-300"
                  size="sm"
                >
                  {isGeneratingPreview ? (
                    <>
                      <div className="w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Cargando
                    </>
                  ) : (
                    <>
                      <span className="w-8 h-8 rounded-xl bg-[#D8C866]/20 flex items-center justify-center mr-2 group-hover:bg-[#D8C866]/30 transition-colors">
                        <Eye className="w-4 h-4 text-[#D8C866]" />
                      </span>
                      <span className="leading-tight text-left">
                        <span className="block text-xs font-bold">
                          Previsualizar
                        </span>
                        <span className="block text-[10px] text-white/60">
                          PDF del presupuesto
                        </span>
                      </span>
                    </>
                  )}
                </Button>
              )}
            </div>

            {previewValidation && (
              <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
                {previewValidation}
              </div>
            )}

            {budgetFinalized && (
              <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700 flex items-center gap-2">
                <BadgeCheck className="w-4 h-4" />
                PDF firmado generado. Ya puedes derivar al técnico.
              </div>
            )}
          </div>

          <div className="flex-1 overflow-hidden">
            {appointmentDiagnoses.length === 0 ? (
              <div className="p-4 lg:p-6">
                <Card className="border-0 shadow-sm bg-white">
                  <CardContent className="py-8 text-center">
                    <FileText className="w-8 h-8 text-[#D4DDD6] mx-auto mb-2" />
                    <p className="text-[#8B948B] text-sm">
                      Sin diagnósticos registrados
                    </p>
                    <p className="text-[#8B948B] text-xs mt-1">
                      Seleccione dientes en el odontograma
                    </p>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <ScrollArea className="h-full">
                <div className="p-4 lg:p-5 space-y-3 pb-6">
                  <Card className="border-0 shadow-sm bg-white">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C9B24A] to-[#A8922F] flex items-center justify-center text-white font-bold text-sm">
                          {patient.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .slice(0, 2)}
                        </div>

                        <div>
                          <p className="font-semibold text-[#2C3E2D] text-sm">
                            {patient.name}
                          </p>
                          <p className="text-xs text-[#8B948B]">
                            Cita: {appointment.date}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {sortedDiagnoses.map((diagnosis) => {
                    const toothInfo = toothMap.find(
                      (t) => t.number === diagnosis.toothNumber
                    )

                    const subtotal = diagnosis.treatments.reduce(
                      (s, t) => s + Number(t.price || 0),
                      0
                    )

                    return (
                      <details
                        key={diagnosis.id}
                        open={sortedDiagnoses.length <= 4}
                        className="group rounded-2xl border border-[#D4DDD6] bg-white shadow-sm overflow-hidden"
                      >
                        <summary className="cursor-pointer list-none p-4 hover:bg-[#F8FAF5] transition-colors">
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-9 h-9 rounded-xl bg-[#C9B24A]/10 flex items-center justify-center flex-shrink-0">
                                <span className="text-xs font-bold text-[#C9B24A]">
                                  {diagnosis.toothNumber}
                                </span>
                              </div>

                              <div className="min-w-0">
                                <p className="text-sm font-bold text-[#2C3E2D] truncate">
                                  Diente #{diagnosis.toothNumber}
                                </p>
                                <p className="text-[10px] text-[#8B948B] truncate">
                                  {toothInfo?.name} •{' '}
                                  {diagnosis.treatments.length} tratamiento(s)
                                </p>
                              </div>
                            </div>

                            <div className="text-right flex-shrink-0">
                              <p className="text-sm font-bold text-[#A8922F]">
                                {formatCurrency(subtotal)}
                              </p>
                              <p className="text-[10px] text-[#8B948B]">
                                Ver detalle
                              </p>
                            </div>
                          </div>
                        </summary>

                        <div className="px-4 pb-4 border-t border-[#D4DDD6] bg-[#FBFCFA]">
                          <div className="flex justify-end pt-3">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-red-400 hover:text-red-600 hover:bg-red-50"
                              onClick={() => handleRemoveDiagnosis(diagnosis.id)}
                            >
                              <Trash2 className="w-3.5 h-3.5 mr-1" />
                              Quitar diente
                            </Button>
                          </div>

                          {diagnosis.observations && (
                            <p className="text-xs text-[#8B948B] bg-white rounded-lg px-3 py-2 mb-3 italic border border-[#D4DDD6]">
                              {diagnosis.observations}
                            </p>
                          )}

                          <div className="space-y-2">
                            {diagnosis.treatments.map((treatment) => (
                              <div
                                key={treatment.id}
                                className="rounded-xl border border-[#D4DDD6] bg-white p-3"
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <div className="min-w-0">
                                    <p className="text-xs text-[#56635A] leading-relaxed">
                                      Tratamiento:{' '}
                                      <span className="font-bold text-[#2C3E2D]">
                                        {treatment.name}
                                      </span>
                                    </p>

                                    {treatment.observations && (
                                      <p className="text-[10px] text-[#8B948B] mt-0.5">
                                        {treatment.observations}
                                      </p>
                                    )}
                                  </div>

                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 text-red-400 hover:text-red-600"
                                    onClick={() =>
                                      handleRemoveTreatment(
                                        diagnosis.id,
                                        treatment.id
                                      )
                                    }
                                  >
                                    <X className="w-3 h-3" />
                                  </Button>
                                </div>

                                <div className="mt-3 grid grid-cols-[1fr_auto] gap-2 items-end">
                                  <div>
                                    <Label className="text-[10px] text-[#8B948B] flex items-center gap-1">
                                      <Edit3 className="w-3 h-3" />
                                      Precio
                                    </Label>
                                    <Input
                                      type="number"
                                      min="0"
                                      step="0.01"
                                      value={Number(treatment.price || 0)}
                                      onChange={(e) =>
                                        handleUpdateTreatmentPrice(
                                          diagnosis.id,
                                          treatment.id,
                                          parseFloat(e.target.value) || 0
                                        )
                                      }
                                      className="h-8 text-xs bg-white border-[#D4DDD6]"
                                    />
                                  </div>

                                  <div className="text-right pb-1">
                                    <p className="text-[10px] text-[#8B948B]">
                                      Subtotal
                                    </p>
                                    <p className="text-xs font-bold text-[#A8922F]">
                                      {formatCurrency(
                                        Number(treatment.price || 0)
                                      )}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </details>
                    )
                  })}
                </div>
              </ScrollArea>
            )}
          </div>

          {appointmentDiagnoses.length > 0 && (
            <div className="border-t border-[#D4DDD6] bg-white p-4 lg:p-5 shadow-[0_-12px_30px_rgba(44,62,45,0.08)]">
              <div className="mb-3">
                <Label className="text-xs font-semibold text-[#56635A]">
                  Descuento general del presupuesto
                </Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={budgetDiscount || ''}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0

                    setBudgetDiscount(value)
                    invalidateSignedBudget()

                    if (value > totalAmount) {
                      showToast(
                        'warning',
                        'Descuento mayor al subtotal',
                        'El sistema ajustará el descuento al máximo permitido.'
                      )
                    }
                  }}
                  className="mt-1 border-[#D4DDD6] bg-[#F8FAF5]"
                  placeholder="Ingrese descuento en soles"
                />
              </div>

              <div className="rounded-xl bg-[#F8FAF5] border border-[#D4DDD6] p-3 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#8B948B]">Subtotal</span>
                  <span className="font-semibold text-[#2C3E2D]">
                    {formatCurrency(totalAmount)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#8B948B]">Descuento</span>
                  <span className="font-semibold text-red-500">
                    - {formatCurrency(normalizedDiscount)}
                  </span>
                </div>

                <Separator className="bg-[#D4DDD6]" />

                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[#2C3E2D]">
                    Total final
                  </span>
                  <span className="text-xl font-bold text-[#A8922F]">
                    {formatCurrency(finalAmount)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </aside>
      )}

      <Dialog
        open={showDiagnosisDialog}
        onOpenChange={(open) => {
          if (!open) {
            closeDiagnosisDialogSafely()
            return
          }

          setShowDiagnosisDialog(true)
        }}
      >
        <DialogContent className="sm:max-w-[560px] bg-white border-0 shadow-gold-lg">
          <DialogHeader>
            <DialogTitle className="text-[#2C3E2D] flex items-center gap-2">
              <Smile className="w-5 h-5 text-[#C9B24A]" />
              Diagnóstico - Diente #{selectedTooth}
              <span className="text-sm font-normal text-[#8B948B]">
                ({toothMap.find((t) => t.number === selectedTooth)?.name})
              </span>
            </DialogTitle>
          </DialogHeader>

          {diagnosisValidation && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{diagnosisValidation}</span>
            </div>
          )}

          <div className="space-y-4">
            {pendingTreatments.length > 0 && (
              <div className="space-y-2">
                <Label className="text-[#56635A] text-sm">
                  Tratamientos por guardar
                </Label>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {pendingTreatments.map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center justify-between bg-[#F8FAF5] rounded-lg px-3 py-2 border border-[#D4DDD6]"
                    >
                      <div>
                        <p className="text-sm text-[#56635A]">
                          Tratamiento:{' '}
                          <span className="font-bold text-[#2C3E2D]">
                            {t.name}
                          </span>
                        </p>
                        {t.observations && (
                          <p className="text-xs text-[#8B948B]">
                            {t.observations}
                          </p>
                        )}
                        {showBilling && (
                          <p className="text-xs font-semibold text-[#A8922F] mt-0.5">
                            Precio: {formatCurrency(t.price)}
                          </p>
                        )}
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-red-400 hover:text-red-600"
                        onClick={() => handleRemovePendingTreatment(t.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3 p-4 rounded-xl bg-[#F8FAF5] border border-[#D4DDD6]">
              <Label className="text-[#56635A] text-sm font-medium flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5 text-[#C9B24A]" />
                Agregar Tratamiento
              </Label>

              <Select
                value={selectedTreatmentName}
                onValueChange={handleSelectTreatment}
              >
                <SelectTrigger className="border-[#D4DDD6] bg-white">
                  <SelectValue placeholder="Seleccionar tratamiento..." />
                </SelectTrigger>

                <SelectContent>
                  {commonTreatments.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {showBilling && (
                <div>
                  <Label className="text-[#56635A] text-xs">
                    Precio normal (S/)
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={newTreatment.price || ''}
                    onChange={(e) => {
                      setDiagnosisValidation('')
                      setNewTreatment((prev) => ({
                        ...prev,
                        price: parseFloat(e.target.value) || 0,
                      }))
                    }}
                    className="border-[#D4DDD6] bg-white"
                    placeholder="0.00"
                  />
                </div>
              )}

              <div>
                <Label className="text-[#56635A] text-xs">
                  Observaciones del Tratamiento
                </Label>
                <Input
                  value={newTreatment.observations}
                  onChange={(e) => {
                    setDiagnosisValidation('')
                    setNewTreatment((prev) => ({
                      ...prev,
                      observations: e.target.value,
                    }))
                  }}
                  className="border-[#D4DDD6] bg-white"
                  placeholder="Observaciones opcionales..."
                />
              </div>

              <Button
                onClick={handleAddTreatmentToPending}
                className="w-full bg-[#C9B24A] hover:bg-[#A8922F] text-white"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Agregar Tratamiento
              </Button>
            </div>

            <div>
              <Label className="text-[#56635A] text-sm">
                Observaciones Clínicas del Diente
              </Label>

              <Textarea
                value={toothObservations}
                onChange={(e) => {
                  setDiagnosisValidation('')
                  setToothObservations(e.target.value)
                }}
                placeholder="Observaciones clínicas generales para este diente..."
                className="border-[#D4DDD6] bg-white min-h-[80px]"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={closeDiagnosisDialogSafely}
              className="border-[#D4DDD6]"
            >
              Cancelar
            </Button>

            {diagnosisValidation && hasDiagnosisChanges() && (
              <Button
                variant="outline"
                onClick={forceDiscardDiagnosisChanges}
                className="border-red-200 text-red-500 hover:bg-red-50"
              >
                Descartar cambios
              </Button>
            )}

            <Button
              onClick={requestSaveDiagnosis}
              className="bg-gradient-to-r from-[#C9B24A] to-[#A8922F] hover:from-[#D8C866] hover:to-[#C9B24A] text-white"
            >
              <Save className="w-4 h-4 mr-1.5" />
              Guardar Diagnóstico
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showSaveDiagnosisConfirm}
        onOpenChange={setShowSaveDiagnosisConfirm}
      >
        <DialogContent className="sm:max-w-[460px] bg-white border-0 shadow-gold-lg">
          <DialogHeader>
            <DialogTitle className="text-[#2C3E2D] flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-[#C9B24A]" />
              Confirmar Diagnóstico
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="rounded-xl border border-[#D4DDD6] bg-[#F8FAF5] p-4">
              <p className="text-sm text-[#56635A]">
                ¿Deseas guardar definitivamente el diagnóstico del diente #
                {selectedTooth}?
              </p>

              <div className="mt-4 space-y-2">
                <p className="text-xs font-semibold text-[#2C3E2D]">
                  Tratamientos:
                </p>

                {pendingTreatments.map((t) => (
                  <div
                    key={t.id}
                    className="rounded-lg bg-white px-3 py-2 text-xs text-[#56635A] border border-[#D4DDD6]"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span>
                        Tratamiento:{' '}
                        <span className="font-bold text-[#2C3E2D]">
                          {t.name}
                        </span>
                      </span>
                      <span className="font-bold text-[#A8922F]">
                        {formatCurrency(t.price)}
                      </span>
                    </div>
                    {t.observations && (
                      <p className="mt-1 text-[10px] text-[#8B948B]">
                        {t.observations}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {toothObservations && (
                <div className="mt-3 rounded-lg bg-white px-3 py-2 border border-[#D4DDD6]">
                  <p className="text-[10px] font-semibold text-[#8B948B]">
                    Observación clínica
                  </p>
                  <p className="text-xs text-[#56635A]">{toothObservations}</p>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowSaveDiagnosisConfirm(false)}
              className="border-[#D4DDD6]"
            >
              Cancelar
            </Button>

            <Button
              onClick={persistDiagnosis}
              className="bg-gradient-to-r from-[#C9B24A] to-[#A8922F] hover:from-[#D8C866] hover:to-[#C9B24A] text-white"
            >
              <CheckCircle2 className="w-4 h-4 mr-1.5" />
              Sí, guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="max-w-[95vw] lg:max-w-6xl h-[92vh] bg-white border-0 shadow-gold-lg flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-[#2C3E2D] flex items-center gap-2">
              <Eye className="w-5 h-5 text-[#C9B24A]" />
              {previewIncludesSignature
                ? 'Previsualización del Presupuesto Firmado'
                : 'Previsualización del Presupuesto'}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 flex-1 min-h-0">
            <div className="rounded-2xl border border-[#D4DDD6] bg-[#F8FAF5] overflow-hidden min-h-0">
              {previewPdfUrl ? (
                <iframe
                  src={previewPdfUrl}
                  className="w-full h-full min-h-[520px]"
                  title="Previsualización del presupuesto odontológico"
                />
              ) : (
                <div className="h-full min-h-[520px] flex items-center justify-center text-[#8B948B]">
                  Generando previsualización...
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-[#D4DDD6] bg-[#F8FAF5] p-4 space-y-4">
              <div>
                <p className="text-sm font-bold text-[#2C3E2D]">
                  Resumen del presupuesto
                </p>
                <p className="text-xs text-[#8B948B] mt-1">
                  {previewIncludesSignature
                    ? 'Revisa la firma incrustada antes de generar el PDF final.'
                    : 'Revisa el documento antes de capturar la firma.'}
                </p>
              </div>

              <div className="rounded-xl bg-white border border-[#D4DDD6] p-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#8B948B]">Paciente</span>
                  <span className="font-semibold text-[#2C3E2D] text-right">
                    {patient.name}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-[#8B948B]">Dientes</span>
                  <span className="font-semibold text-[#2C3E2D]">
                    {appointmentDiagnoses.length}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-[#8B948B]">Tratamientos</span>
                  <span className="font-semibold text-[#2C3E2D]">
                    {totalTreatments}
                  </span>
                </div>

                <Separator />

                <div className="flex justify-between text-sm">
                  <span className="text-[#8B948B]">Subtotal</span>
                  <span className="font-semibold text-[#2C3E2D]">
                    {formatCurrency(totalAmount)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-[#8B948B]">Descuento</span>
                  <span className="font-semibold text-red-500">
                    - {formatCurrency(normalizedDiscount)}
                  </span>
                </div>

                <Separator />

                <div className="flex justify-between">
                  <span className="text-sm font-bold text-[#2C3E2D]">
                    Total final
                  </span>
                  <span className="text-lg font-bold text-[#A8922F]">
                    {formatCurrency(finalAmount)}
                  </span>
                </div>
              </div>

              {previewIncludesSignature ? (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-700">
                  Esta previsualización ya contiene la firma del paciente y la
                  firma predeterminada de la doctora.
                </div>
              ) : (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-700">
                  Si necesitas cambiar tratamientos, precios o descuento, cierra
                  esta ventana, modifica el panel de cobros y vuelve a
                  previsualizar.
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowPreviewDialog(false)}
              className="border-[#D4DDD6]"
              disabled={isGeneratingPdf}
            >
              {previewIncludesSignature ? 'Cerrar' : 'Cerrar y modificar'}
            </Button>

            {!previewIncludesSignature ? (
              <Button
                onClick={() => {
                  setShowPreviewDialog(false)
                  setShowSignatureDialog(true)
                }}
                className="bg-gradient-to-r from-[#C9B24A] to-[#A8922F] hover:from-[#D8C866] hover:to-[#C9B24A] text-white"
              >
                <PenLine className="w-4 h-4 mr-1.5" />
                Continuar a firma
              </Button>
            ) : (
              <Button
                onClick={handleGenerateSignedPdf}
                disabled={isGeneratingPdf}
                className="bg-gradient-to-r from-[#2C3E2D] to-[#3A5240] hover:from-[#3A5240] hover:to-[#2C3E2D] text-white"
              >
                {isGeneratingPdf ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generando...
                  </>
                ) : (
                  <>
                    <FileCheck2 className="w-4 h-4 mr-1.5" />
                    Generar PDF firmado
                  </>
                )}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showSignatureDialog} onOpenChange={setShowSignatureDialog}>
        <DialogContent className="sm:max-w-[720px] bg-white border-0 shadow-gold-lg">
          <DialogHeader>
            <DialogTitle className="text-[#2C3E2D] flex items-center gap-2">
              <PenLine className="w-5 h-5 text-[#C9B24A]" />
              Firma del Paciente
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="rounded-xl border border-[#D4DDD6] bg-[#F8FAF5] p-4">
              <p className="text-sm text-[#56635A]">
                Solicita al paciente firmar dentro del recuadro. Luego podrás
                previsualizar nuevamente el PDF con la firma incrustada.
              </p>
            </div>

            <div className="rounded-2xl border-2 border-dashed border-[#C9B24A]/50 bg-white p-3">
              <canvas
                ref={signatureCanvasRef}
                width={700}
                height={220}
                onPointerDown={startSignature}
                onPointerMove={drawSignature}
                onPointerUp={finishSignature}
                onPointerLeave={finishSignature}
                className="w-full h-[220px] touch-none rounded-xl bg-white cursor-crosshair"
              />
            </div>

            <div className="flex items-center justify-between gap-3 rounded-xl bg-[#F8FAF5] border border-[#D4DDD6] p-3">
              <div>
                <p className="text-xs font-semibold text-[#2C3E2D]">
                  Estado de firma
                </p>
                <p className="text-xs text-[#8B948B]">
                  {hasPatientSignature
                    ? 'Firma capturada correctamente.'
                    : 'Aún no se ha registrado una firma.'}
                </p>
              </div>

              <Button
                variant="outline"
                onClick={clearSignature}
                className="border-[#D4DDD6]"
              >
                <RotateCcw className="w-4 h-4 mr-1.5" />
                Limpiar
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowSignatureDialog(false)
                handleOpenBudgetPreview()
              }}
              className="border-[#D4DDD6]"
            >
              Volver al PDF sin firma
            </Button>

            <Button
              onClick={handlePreviewSignedBudget}
              disabled={!hasPatientSignature || isGeneratingPreview}
              className={
                hasPatientSignature
                  ? 'bg-gradient-to-r from-[#C9B24A] to-[#A8922F] hover:from-[#D8C866] hover:to-[#C9B24A] text-white'
                  : 'bg-[#D4DDD6] text-[#8B948B] cursor-not-allowed'
              }
            >
              {isGeneratingPreview ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generando...
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-1.5" />
                  Previsualizar con firma
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showReferralDialog} onOpenChange={setShowReferralDialog}>
        <DialogContent className="sm:max-w-[520px] bg-white border-0 shadow-gold-lg">
          <DialogHeader>
            <DialogTitle className="text-[#2C3E2D] flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5 text-[#C9B24A]" />
              Derivar a Técnico
            </DialogTitle>
          </DialogHeader>

          {referralValidation && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{referralValidation}</span>
            </div>
          )}

          {!budgetFinalized ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
              Primero debes previsualizar, capturar la firma, revisar el PDF
              firmado y generar el PDF final. Luego podrás realizar la
              derivación al técnico.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#F8FAF5] to-white border border-[#D4DDD6]">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-[#C9B24A]/12 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-[#A8922F]" />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-[#2C3E2D]">
                      {patient.name}
                    </p>
                    <p className="text-xs text-[#8B948B] mt-0.5">
                      Presupuesto firmado • Total final:{' '}
                      <span className="font-bold text-[#A8922F]">
                        {formatCurrency(finalAmount)}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-[#56635A] text-sm">
                  Seleccionar Técnico
                </Label>

                <Select
                  onValueChange={(value) => {
                    setReferralValidation('')
                    setSelectedTechnician(value)
                  }}
                  value={selectedTechnician}
                >
                  <SelectTrigger className="border-[#D4DDD6] bg-white h-11">
                    <SelectValue placeholder="Seleccionar técnico..." />
                  </SelectTrigger>

                  <SelectContent>
                    {technicians.map((tech) => (
                      <SelectItem key={tech.id} value={tech.id}>
                        {tech.name} - {tech.specialty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-[#56635A] text-sm">
                  Notas de Derivación
                </Label>

                <Textarea
                  value={referralNotes}
                  onChange={(e) => setReferralNotes(e.target.value)}
                  placeholder="Instrucciones adicionales para el técnico..."
                  className="border-[#D4DDD6] bg-white min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[#56635A] text-sm">
                  Dientes a Derivar
                </Label>

                <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
                  {appointmentDiagnoses.map((d) => (
                    <div
                      key={d.id}
                      className="bg-white rounded-lg px-3 py-2 border border-[#D4DDD6]"
                    >
                      <p className="text-sm font-semibold text-[#2C3E2D]">
                        Diente #{d.toothNumber}
                      </p>
                      <p className="text-xs text-[#8B948B]">
                        {d.treatments.map((t) => t.name).join(', ')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowReferralDialog(false)}
              className="border-[#D4DDD6]"
            >
              Cancelar
            </Button>

            <Button
              onClick={handleReferToTechnician}
              disabled={!budgetFinalized}
              className={
                budgetFinalized
                  ? 'h-11 rounded-xl bg-gradient-to-r from-[#C9B24A] via-[#D8C866] to-[#A8922F] hover:from-[#D8C866] hover:to-[#C9B24A] text-white shadow-[0_12px_28px_rgba(201,178,74,0.34)]'
                  : 'h-11 rounded-xl bg-[#D4DDD6] text-[#8B948B] cursor-not-allowed'
              }
            >
              <Send className="w-4 h-4 mr-1.5" />
              Derivar al Técnico
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showReferralSuccessDialog}
        onOpenChange={setShowReferralSuccessDialog}
      >
        <DialogContent className="sm:max-w-[560px] bg-white border-0 shadow-gold-lg">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 className="h-9 w-9 text-emerald-600" />
            </div>

            <DialogTitle className="text-2xl font-bold text-[#2C3E2D]">
              Derivación Exitosa
            </DialogTitle>

            <p className="mt-2 text-sm text-[#8B948B]">
              La atención fue derivada correctamente al técnico seleccionado.
            </p>
          </div>

          {referralSuccessData && (
            <div className="space-y-4">
              <div className="rounded-xl border border-[#D4DDD6] bg-[#F8FAF5] p-4">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-[#8B948B]">
                      Paciente
                    </p>
                    <p className="text-sm font-bold text-[#2C3E2D]">
                      {referralSuccessData.patientName}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-[#8B948B]">
                      Técnico asignado
                    </p>
                    <p className="text-sm font-bold text-[#2C3E2D]">
                      {referralSuccessData.technicianName}
                    </p>
                    {referralSuccessData.technicianSpecialty && (
                      <p className="text-xs text-[#8B948B]">
                        {referralSuccessData.technicianSpecialty}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="rounded-lg bg-white p-3 border border-[#D4DDD6]">
                    <p className="text-[10px] text-[#8B948B]">Subtotal</p>
                    <p className="text-sm font-bold text-[#2C3E2D]">
                      {formatCurrency(totalAmount)}
                    </p>
                  </div>

                  <div className="rounded-lg bg-white p-3 border border-[#D4DDD6]">
                    <p className="text-[10px] text-[#8B948B]">Descuento</p>
                    <p className="text-sm font-bold text-red-500">
                      - {formatCurrency(normalizedDiscount)}
                    </p>
                  </div>

                  <div className="rounded-lg bg-white p-3 border border-[#D4DDD6]">
                    <p className="text-[10px] text-[#8B948B]">Total final</p>
                    <p className="text-sm font-bold text-[#A8922F]">
                      {formatCurrency(finalAmount)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-bold text-[#2C3E2D]">
                  Dientes y tratamientos derivados
                </p>

                <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
                  {referralSuccessData.items.map((item) => (
                    <div
                      key={item.toothNumber}
                      className="rounded-xl border border-[#D4DDD6] bg-white p-3"
                    >
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#C9B24A]/10 text-xs font-bold text-[#A8922F]">
                          {item.toothNumber}
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-[#2C3E2D]">
                            Diente #{item.toothNumber}
                          </p>
                          {item.toothName && (
                            <p className="text-xs text-[#8B948B]">
                              {item.toothName}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {item.treatments.map((treatment) => (
                          <span
                            key={`${item.toothNumber}-${treatment}`}
                            className="rounded-full bg-[#F8FAF5] px-2 py-1 text-[10px] font-medium text-[#56635A] border border-[#D4DDD6]"
                          >
                            {treatment}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {referralNotes && (
                <div className="rounded-xl border border-[#D4DDD6] bg-[#F8FAF5] p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-[#8B948B]">
                    Nota de derivación
                  </p>
                  <p className="text-xs text-[#56635A]">{referralNotes}</p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              onClick={() => {
                setShowReferralSuccessDialog(false)
                setSelectedTechnician('')
                setReferralNotes('')
                setReferralSuccessData(null)
                setView('dashboard')
              }}
              className="w-full bg-gradient-to-r from-[#2C3E2D] to-[#3A5240] hover:from-[#3A5240] hover:to-[#2C3E2D] text-white"
            >
              Aceptar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}