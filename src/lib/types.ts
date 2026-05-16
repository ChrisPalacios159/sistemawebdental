// ==================== ROLES ====================
export type Role = 'admin' | 'doctor' | 'technician'

// ==================== USER ====================
export interface User {
  id: string
  name: string
  email: string
  password: string
  role: Role
  specialty?: string
  avatar?: string
}

// ==================== PATIENT ====================
export interface Patient {
  id: string
  name: string
  email: string
  phone: string
  dni: string
  birthDate?: string
  address?: string
  createdAt: string
}

// ==================== APPOINTMENT ====================
export type AppointmentStatus = 
  | 'pending' 
  | 'in-progress' 
  | 'diagnosed' 
  | 'referred' 
  | 'in-attention' 
  | 'completed' 
  | 'cancelled'

export interface Appointment {
  id: string
  patientId: string
  date: string
  time: string
  reason: string
  status: AppointmentStatus
  doctorId?: string
  technicianId?: string
  createdAt: string
}

// ==================== TREATMENT ====================
export type TreatmentStatus = 'pending' | 'in-progress' | 'completed'

export interface Treatment {
  id: string
  name: string
  price: number
  observations: string
  status: TreatmentStatus
}

// ==================== TOOTH DIAGNOSIS ====================
export interface ToothDiagnosis {
  id: string
  appointmentId: string
  patientId: string
  toothNumber: number
  treatments: Treatment[]
  observations: string
  diagnosedAt: string
  diagnosedBy: string
}

// ==================== REFERRAL ====================
export type ReferralStatus = 'referred' | 'in-attention' | 'completed'

export interface Referral {
  id: string
  appointmentId: string
  patientId: string
  doctorId: string
  technicianId: string
  toothDiagnoses: ToothDiagnosis[]
  referredAt: string
  attentionStartedAt?: string
  attentionCompletedAt?: string
  status: ReferralStatus
  technicianNotes?: string
}

// ==================== NAVIGATION ====================
export type ViewMode = 
  | 'login'
  | 'dashboard'
  | 'appointments'
  | 'odontogram'
  | 'patients'
  | 'referrals'
  | 'technician-panel'
  | 'review'
  | 'reports'
  | 'settings'
  | 'staff'
  | 'inventory'

export interface NavItem {
  id: ViewMode
  label: string
  icon: string
  roles: Role[]
}
