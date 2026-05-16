'use client'

import React from 'react'
import { useAppStore } from '@/lib/store'
import { ViewMode } from '@/lib/types'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Calendar,
  Smile,
  Users,
  ArrowRightLeft,
  ClipboardCheck,
  FileBarChart,
  Settings,
  UserCog,
  Package,
  LogOut,
  ChevronLeft,
  Sparkles,
  X,
} from 'lucide-react'

const navItems: { id: ViewMode; label: string; icon: React.ReactNode; roles: string[] }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, roles: ['admin', 'doctor', 'technician'] },
  { id: 'appointments', label: 'Citas Pendientes', icon: <Calendar className="w-5 h-5" />, roles: ['admin', 'doctor'] },
  { id: 'odontogram', label: 'Odontograma', icon: <Smile className="w-5 h-5" />, roles: ['admin', 'doctor'] },
  { id: 'patients', label: 'Pacientes', icon: <Users className="w-5 h-5" />, roles: ['admin', 'doctor'] },
  { id: 'referrals', label: 'Derivaciones', icon: <ArrowRightLeft className="w-5 h-5" />, roles: ['admin', 'doctor'] },
  { id: 'technician-panel', label: 'Mis Citas', icon: <ClipboardCheck className="w-5 h-5" />, roles: ['technician'] },
  { id: 'review', label: 'Seguimiento', icon: <ClipboardCheck className="w-5 h-5" />, roles: ['admin', 'doctor'] },
  { id: 'reports', label: 'Reportes', icon: <FileBarChart className="w-5 h-5" />, roles: ['admin'] },
  { id: 'staff', label: 'Personal', icon: <UserCog className="w-5 h-5" />, roles: ['admin'] },
  { id: 'inventory', label: 'Inventario', icon: <Package className="w-5 h-5" />, roles: ['admin'] },
  { id: 'settings', label: 'Configuración', icon: <Settings className="w-5 h-5" />, roles: ['admin', 'doctor'] },
]

export function AppSidebar() {
  const { currentUser, currentView, setView, sidebarOpen, toggleSidebar, setSidebarOpen, logout } = useAppStore()

  if (!currentUser) return null

  const filteredItems = navItems.filter(item => item.roles.includes(currentUser.role))

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrador'
      case 'doctor': return 'Doctor'
      case 'technician': return 'Técnico'
      default: return role
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500/20 text-red-300'
      case 'doctor': return 'bg-[#C9B24A]/20 text-[#D8C866]'
      case 'technician': return 'bg-emerald-500/20 text-emerald-300'
      default: return ''
    }
  }

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={cn(
          "fixed top-0 left-0 h-full z-50 sidebar-gradient flex flex-col transition-all duration-300 ease-in-out",
          "w-[280px]",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-[72px]"
        )}
      >
        {/* Logo area */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-white/10">
          <div className={cn("flex items-center gap-3", !sidebarOpen && "lg:justify-center")}>
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-[#C9B24A] to-[#A8922F] flex items-center justify-center shadow-gold">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <AnimatePresence>
              {sidebarOpen && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="overflow-hidden"
                >
                  <h2 className="text-white font-bold text-lg leading-tight whitespace-nowrap">Marfil Stetic</h2>
                  <p className="text-[#8B948B] text-[10px] whitespace-nowrap">Clínica Dental Estética</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button
            onClick={toggleSidebar}
            className="hidden lg:flex w-7 h-7 items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-colors"
          >
            <ChevronLeft className={cn("w-4 h-4 transition-transform", !sidebarOpen && "rotate-180")} />
          </button>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden w-7 h-7 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User info */}
        <div className={cn("px-4 py-4 border-b border-white/10", !sidebarOpen && "lg:px-2")}>
          <div className={cn("flex items-center gap-3", !sidebarOpen && "lg:flex-col lg:gap-1")}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C9B24A] to-[#A8922F] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <AnimatePresence>
              {sidebarOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="min-w-0"
                >
                  <p className="text-white text-sm font-medium truncate">{currentUser.name}</p>
                  <span className={cn("inline-block px-2 py-0.5 rounded-full text-[10px] font-medium mt-0.5", getRoleColor(currentUser.role))}>
                    {getRoleLabel(currentUser.role)}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
          {filteredItems.map((item) => {
            const isActive = currentView === item.id
            return (
              <button
                key={item.id}
                onClick={() => { setView(item.id); setSidebarOpen(false) }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                  !sidebarOpen && "lg:justify-center lg:px-2",
                  isActive
                    ? "bg-[#C9B24A]/20 text-[#D8C866] shadow-sm"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                )}
                title={!sidebarOpen ? item.label : undefined}
              >
                <span className={cn("flex-shrink-0", isActive && "text-[#C9B24A]")}>{item.icon}</span>
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {isActive && sidebarOpen && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#C9B24A] badge-pulse" />
                )}
              </button>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="px-2 py-3 border-t border-white/10">
          <button
            onClick={logout}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:bg-red-500/20 hover:text-red-300 transition-all duration-200",
              !sidebarOpen && "lg:justify-center lg:px-2"
            )}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <AnimatePresence>
              {sidebarOpen && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="whitespace-nowrap"
                >
                  Cerrar Sesión
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.aside>
    </>
  )
}
