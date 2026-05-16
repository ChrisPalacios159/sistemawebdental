'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { LucideIcon, Inbox } from 'lucide-react'

interface PlaceholderModuleProps {
  title: string
  description?: string
  icon?: React.ReactNode
}

export function PlaceholderModule({ title, description, icon }: PlaceholderModuleProps) {
  return (
    <div className="p-4 lg:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="border-0 shadow-md bg-white">
          <CardContent className="py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#C9B24A]/10 flex items-center justify-center mx-auto mb-4">
              {icon || <Inbox className="w-8 h-8 text-[#C9B24A]" />}
            </div>
            <h3 className="text-lg font-semibold text-[#2C3E2D] mb-2">{title}</h3>
            <p className="text-[#8B948B] text-sm max-w-md mx-auto">
              {description || 'Este módulo aún no tiene información registrada. Las funcionalidades se habilitarán próximamente.'}
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
