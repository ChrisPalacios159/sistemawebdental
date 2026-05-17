'use client'

import React from 'react'
import { useAppStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Menu, Bell, LogOut } from 'lucide-react'

export function AppHeader() {
  const {
    currentUser,
    currentView,
    toggleSidebar,
    logout,
  } = useAppStore()

  if (!currentUser) return null

  const getTitle = () => {
    switch (currentView) {
      case 'dashboard':
        return 'Dashboard'
      case 'appointments':
        return 'Citas Pendientes'
      case 'odontogram':
        return 'Odontograma'
      case 'patients':
        return 'Pacientes'
      case 'referrals':
        return 'Derivaciones'
      case 'technician-panel':
        return 'Mis Citas Asignadas'
      case 'review':
        return 'Seguimiento de Atenciones'
      case 'reports':
        return 'Reportes'
      case 'settings':
        return 'Configuración'
      case 'staff':
        return 'Personal'
      case 'inventory':
        return 'Inventario'
      default:
        return 'Marfil Stetic'
    }
  }

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-[#D4DDD6] h-16">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="lg:hidden text-[#56635A] hover:text-[#C9B24A] hover:bg-[#C9B24A]/10"
          >
            <Menu className="w-5 h-5" />
          </Button>

          <div>
            <h1 className="text-lg font-bold text-[#2C3E2D]">
              {getTitle()}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-[#8B948B] hover:text-[#C9B24A] hover:bg-[#C9B24A]/10 relative"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-[#C9B24A] rounded-full badge-pulse" />
          </Button>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#F7F5EA] border border-[#E8D982]/50">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C9B24A] to-[#A8922F] flex items-center justify-center text-white font-bold text-xs">
              {currentUser.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)}
            </div>

            <div className="leading-tight max-w-[150px]">
              <p className="text-xs font-semibold text-[#2C3E2D] truncate">
                {currentUser.name}
              </p>
              <p className="text-[10px] text-[#8B948B] truncate">
                {currentUser.role === 'admin'
                  ? 'Administrador'
                  : currentUser.role === 'doctor'
                    ? 'Doctor'
                    : currentUser.role === 'technician'
                      ? 'Técnico'
                      : currentUser.role}
              </p>
            </div>
          </div>

          <Button
            onClick={logout}
            variant="ghost"
            className="h-10 px-3 text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            <LogOut className="w-5 h-5 sm:mr-2" />
            <span className="hidden sm:inline text-sm font-medium">
              Cerrar Sesión
            </span>
          </Button>
        </div>
      </div>
    </header>
  )
}