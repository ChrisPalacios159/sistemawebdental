'use client'

import React, { useEffect } from 'react'
import { useAppStore } from '@/lib/store'
import { LoginForm } from '@/components/auth/login-form'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { AppHeader } from '@/components/layout/app-header'
import { AdminDashboard, DoctorDashboard, TechnicianDashboard } from '@/components/dashboard/dashboards'
import { AppointmentList } from '@/components/appointments/appointment-list'
import { PatientsList } from '@/components/appointments/patients-list'
import { OdontogramView } from '@/components/odontogram/odontogram-view'
import { ReferralsList } from '@/components/referral/referrals-list'
import { TechnicianPanel } from '@/components/technician/technician-panel'
import { ReviewPanel } from '@/components/review/review-panel'
import { PlaceholderModule } from '@/components/modules/placeholder-module'
import { 
  FileBarChart, UserCog, Package, Settings, Users
} from 'lucide-react'

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#EAF3EA] via-[#F8FAF5] to-[#DCE8DE]">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#C9B24A] to-[#A8922F] flex items-center justify-center mx-auto mb-4 shadow-gold-lg animate-pulse">
          <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-[#2C3E2D]">Marfil Stetic</h2>
        <p className="text-[#8B948B] text-sm mt-1">Cargando sistema...</p>
        <div className="mt-4 w-32 h-1 bg-[#D4DDD6] rounded-full mx-auto overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#C9B24A] to-[#D8C866] rounded-full animate-[loading_1.5s_ease-in-out_infinite]" style={{ width: '60%' }} />
        </div>
      </div>
    </div>
  )
}

function MainContent() {
  const { currentView, currentUser, sidebarOpen } = useAppStore()

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        if (currentUser?.role === 'admin') return <AdminDashboard />
        if (currentUser?.role === 'doctor') return <DoctorDashboard />
        if (currentUser?.role === 'technician') return <TechnicianDashboard />
        return <AdminDashboard />
      case 'appointments':
        return <AppointmentList />
      case 'odontogram':
        return <OdontogramView />
      case 'patients':
        return <PatientsList />
      case 'referrals':
        return <ReferralsList />
      case 'technician-panel':
        return <TechnicianPanel />
      case 'review':
        return <ReviewPanel />
      case 'reports':
        return <PlaceholderModule title="Reportes" description="Módulo de reportes y estadísticas de la clínica. Próximamente estará disponible con gráficos y exportación de datos." icon={<FileBarChart className="w-8 h-8 text-[#C9B24A]" />} />
      case 'staff':
        return <PlaceholderModule title="Personal" description="Gestión del personal de la clínica. Próximamente podrá agregar, editar y gestionar doctores y técnicos." icon={<UserCog className="w-8 h-8 text-[#C9B24A]" />} />
      case 'inventory':
        return <PlaceholderModule title="Inventario" description="Control de inventario de materiales y suministros dentales. Próximamente con seguimiento de stock y alertas." icon={<Package className="w-8 h-8 text-[#C9B24A]" />} />
      case 'settings':
        return <PlaceholderModule title="Configuración" description="Configuración general del sistema. Próximamente con opciones de personalización y ajustes." icon={<Settings className="w-8 h-8 text-[#C9B24A]" />} />
      default:
        return <AdminDashboard />
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAF5]">
      <AppSidebar />
      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-[280px]' : 'lg:ml-[72px]'}`}>
        <AppHeader />
        <main className="min-h-[calc(100vh-4rem)]">
          {renderView()}
        </main>
        {/* Footer */}
        <footer className="bg-white border-t border-[#D4DDD6] py-4 px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#C9B24A] to-[#A8922F] flex items-center justify-center">
                <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="text-xs text-[#8B948B]">Marfil Stetic &copy; 2025</span>
            </div>
            <span className="text-[10px] text-[#8B948B]">Sistema Administrativo v1.0</span>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default function Home() {
  const { isAuthenticated, isHydrated, initializeData } = useAppStore()

  useEffect(() => {
    initializeData()
  }, [initializeData])

  if (!isHydrated) {
    return <LoadingScreen />
  }

  if (!isAuthenticated) {
    return <LoginForm />
  }

  return <MainContent />
}
