'use client'

import React from 'react'
import { useAppStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Menu, Bell, Search } from 'lucide-react'

export function AppHeader() {
  const { currentUser, currentView, toggleSidebar, sidebarOpen } = useAppStore()

  if (!currentUser) return null

  const getTitle = () => {
    switch (currentView) {
      case 'dashboard': return 'Dashboard'
      case 'appointments': return 'Citas Pendientes'
      case 'odontogram': return 'Odontograma'
      case 'patients': return 'Pacientes'
      case 'referrals': return 'Derivaciones'
      case 'technician-panel': return 'Mis Citas Asignadas'
      case 'review': return 'Seguimiento de Atenciones'
      case 'reports': return 'Reportes'
      case 'settings': return 'Configuración'
      case 'staff': return 'Personal'
      case 'inventory': return 'Inventario'
      default: return 'Marfil Stetic'
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
            <h1 className="text-lg font-bold text-[#2C3E2D]">{getTitle()}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-[#8B948B] hover:text-[#C9B24A] hover:bg-[#C9B24A]/10 relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-[#C9B24A] rounded-full badge-pulse" />
          </Button>
        </div>
      </div>
    </header>
  )
}
