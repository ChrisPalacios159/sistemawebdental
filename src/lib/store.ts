import { create } from 'zustand'
import { User, Patient, Appointment, ToothDiagnosis, Referral, ViewMode, Role } from './types'
import { mockUsers, mockPatients, mockAppointments } from './mock-data'

// ==================== LOCAL STORAGE HELPERS ====================
const STORAGE_KEYS = {
  users: 'marfil-users',
  patients: 'marfil-patients',
  appointments: 'marfil-appointments',
  diagnoses: 'marfil-diagnoses',
  referrals: 'marfil-referrals',
  session: 'marfil-session',
  initialized: 'marfil-initialized',
}

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : fallback
  } catch {
    return fallback
  }
}

function saveToStorage<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (e) {
    console.error('Failed to save to localStorage:', e)
  }
}

// ==================== STORE INTERFACE ====================
interface AppState {
  // Auth
  currentUser: User | null
  isAuthenticated: boolean
  
  // Data
  users: User[]
  patients: Patient[]
  appointments: Appointment[]
  diagnoses: ToothDiagnosis[]
  referrals: Referral[]
  
  // UI State
  currentView: ViewMode
  selectedAppointmentId: string | null
  selectedPatientId: string | null
  selectedTooth: number | null
  showBillingPanel: boolean
  sidebarOpen: boolean
  isHydrated: boolean

  // Auth Actions
  login: (email: string, password: string) => boolean
  logout: () => void
  initializeData: () => void

  // Navigation Actions
  setView: (view: ViewMode) => void
  setSelectedAppointment: (id: string | null) => void
  setSelectedPatient: (id: string | null) => void
  setSelectedTooth: (tooth: number | null) => void
  setShowBillingPanel: (show: boolean) => void
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void

  // Appointment Actions
  updateAppointmentStatus: (id: string, status: Appointment['status']) => void
  assignDoctorToAppointment: (appointmentId: string, doctorId: string) => void
  assignTechnicianToAppointment: (appointmentId: string, technicianId: string) => void

  // Diagnosis Actions
  addDiagnosis: (diagnosis: ToothDiagnosis) => void
  updateDiagnosis: (id: string, diagnosis: Partial<ToothDiagnosis>) => void
  removeDiagnosis: (id: string) => void
  getDiagnosesForAppointment: (appointmentId: string) => ToothDiagnosis[]
  getDiagnosesForPatient: (patientId: string) => ToothDiagnosis[]

  // Referral Actions
  addReferral: (referral: Referral) => void
  updateReferral: (id: string, referral: Partial<Referral>) => void
  getReferralsForTechnician: (technicianId: string) => Referral[]
  getReferralsForAppointment: (appointmentId: string) => Referral | undefined

  // Patient Actions
  addPatient: (patient: Patient) => void
  updatePatient: (id: string, patient: Partial<Patient>) => void

  // Helpers
  getPatientById: (id: string) => Patient | undefined
  getUserById: (id: string) => User | undefined
  getPendingAppointments: () => Appointment[]
  getReferredAppointments: () => Appointment[]
  getDoctors: () => User[]
  getTechnicians: () => User[]
}

// ==================== STORE ====================
export const useAppStore = create<AppState>((set, get) => ({
  // Initial State
  currentUser: null,
  isAuthenticated: false,
  users: [],
  patients: [],
  appointments: [],
  diagnoses: [],
  referrals: [],
  currentView: 'login',
  selectedAppointmentId: null,
  selectedPatientId: null,
  selectedTooth: null,
  showBillingPanel: true,
  sidebarOpen: true,
  isHydrated: false,

  // Initialize Data from localStorage or mock
  initializeData: () => {
    const initialized = loadFromStorage(STORAGE_KEYS.initialized, false)
    
    if (!initialized) {
      // First time - save mock data
      saveToStorage(STORAGE_KEYS.users, mockUsers)
      saveToStorage(STORAGE_KEYS.patients, mockPatients)
      saveToStorage(STORAGE_KEYS.appointments, mockAppointments)
      saveToStorage(STORAGE_KEYS.diagnoses, [])
      saveToStorage(STORAGE_KEYS.referrals, [])
      saveToStorage(STORAGE_KEYS.initialized, true)
    }

    const session = loadFromStorage<User | null>(STORAGE_KEYS.session, null)
    
    set({
      users: loadFromStorage(STORAGE_KEYS.users, mockUsers),
      patients: loadFromStorage(STORAGE_KEYS.patients, mockPatients),
      appointments: loadFromStorage(STORAGE_KEYS.appointments, mockAppointments),
      diagnoses: loadFromStorage(STORAGE_KEYS.diagnoses, []),
      referrals: loadFromStorage(STORAGE_KEYS.referrals, []),
      currentUser: session,
      isAuthenticated: !!session,
      currentView: session ? 'dashboard' : 'login',
      isHydrated: true,
    })
  },

  // Auth
  login: (email: string, password: string) => {
    const { users } = get()
    const user = users.find(u => u.email === email && u.password === password)
    if (user) {
      saveToStorage(STORAGE_KEYS.session, user)
      set({
        currentUser: user,
        isAuthenticated: true,
        currentView: 'dashboard',
      })
      return true
    }
    return false
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.session)
    set({
      currentUser: null,
      isAuthenticated: false,
      currentView: 'login',
      selectedAppointmentId: null,
      selectedPatientId: null,
      selectedTooth: null,
    })
  },

  // Navigation
  setView: (view) => set({ currentView: view, selectedTooth: null }),
  setSelectedAppointment: (id) => set({ selectedAppointmentId: id }),
  setSelectedPatient: (id) => set({ selectedPatientId: id }),
  setSelectedTooth: (tooth) => set({ selectedTooth: tooth }),
  setShowBillingPanel: (show) => set({ showBillingPanel: show }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  // Appointment Actions
  updateAppointmentStatus: (id, status) => {
    set((state) => {
      const appointments = state.appointments.map(a => 
        a.id === id ? { ...a, status } : a
      )
      saveToStorage(STORAGE_KEYS.appointments, appointments)
      return { appointments }
    })
  },

  assignDoctorToAppointment: (appointmentId, doctorId) => {
    set((state) => {
      const appointments = state.appointments.map(a => 
        a.id === appointmentId ? { ...a, doctorId } : a
      )
      saveToStorage(STORAGE_KEYS.appointments, appointments)
      return { appointments }
    })
  },

  assignTechnicianToAppointment: (appointmentId, technicianId) => {
    set((state) => {
      const appointments = state.appointments.map(a => 
        a.id === appointmentId ? { ...a, technicianId } : a
      )
      saveToStorage(STORAGE_KEYS.appointments, appointments)
      return { appointments }
    })
  },

  // Diagnosis Actions
  addDiagnosis: (diagnosis) => {
    set((state) => {
      const diagnoses = [...state.diagnoses, diagnosis]
      saveToStorage(STORAGE_KEYS.diagnoses, diagnoses)
      return { diagnoses }
    })
  },

  updateDiagnosis: (id, updates) => {
    set((state) => {
      const diagnoses = state.diagnoses.map(d => 
        d.id === id ? { ...d, ...updates } : d
      )
      saveToStorage(STORAGE_KEYS.diagnoses, diagnoses)
      return { diagnoses }
    })
  },

  removeDiagnosis: (id) => {
    set((state) => {
      const diagnoses = state.diagnoses.filter(d => d.id !== id)
      saveToStorage(STORAGE_KEYS.diagnoses, diagnoses)
      return { diagnoses }
    })
  },

  getDiagnosesForAppointment: (appointmentId) => {
    return get().diagnoses.filter(d => d.appointmentId === appointmentId)
  },

  getDiagnosesForPatient: (patientId) => {
    return get().diagnoses.filter(d => d.patientId === patientId)
  },

  // Referral Actions
  addReferral: (referral) => {
    set((state) => {
      const referrals = [...state.referrals, referral]
      saveToStorage(STORAGE_KEYS.referrals, referrals)
      return { referrals }
    })
  },

  updateReferral: (id, updates) => {
    set((state) => {
      const referrals = state.referrals.map(r => 
        r.id === id ? { ...r, ...updates } : r
      )
      saveToStorage(STORAGE_KEYS.referrals, referrals)
      return { referrals }
    })
  },

  getReferralsForTechnician: (technicianId) => {
    return get().referrals.filter(r => r.technicianId === technicianId)
  },

  getReferralsForAppointment: (appointmentId) => {
    return get().referrals.find(r => r.appointmentId === appointmentId)
  },

  // Patient Actions
  addPatient: (patient) => {
    set((state) => {
      const patients = [...state.patients, patient]
      saveToStorage(STORAGE_KEYS.patients, patients)
      return { patients }
    })
  },

  updatePatient: (id, updates) => {
    set((state) => {
      const patients = state.patients.map(p => 
        p.id === id ? { ...p, ...updates } : p
      )
      saveToStorage(STORAGE_KEYS.patients, patients)
      return { patients }
    })
  },

  // Helpers
  getPatientById: (id) => get().patients.find(p => p.id === id),
  getUserById: (id) => get().users.find(u => u.id === id),
  
  getPendingAppointments: () => {
    return get().appointments.filter(a => a.status === 'pending')
  },

  getReferredAppointments: () => {
    return get().appointments.filter(a => 
      a.status === 'referred' || a.status === 'in-attention' || a.status === 'completed'
    )
  },

  getDoctors: () => get().users.filter(u => u.role === 'doctor'),
  getTechnicians: () => get().users.filter(u => u.role === 'technician'),
}))
