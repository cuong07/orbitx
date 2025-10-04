import React, { memo } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import PositionsTable from './PositionsTable'

// Tab configuration for better maintainability
const TAB_CONFIG = [
  { value: 'positions', label: 'Positions (0)', hasContent: true },
  { value: 'open-orders', label: 'Open Orders (0)', hasContent: false },
  { value: 'pending-orders', label: 'Pending Orders (0)', hasContent: false },
  { value: 'order-history', label: 'Order History', hasContent: false },
  { value: 'trade-history', label: 'Trade History', hasContent: false },
  { value: 'balance-fluctuations', label: 'Balance Fluctuations', hasContent: false },
  { value: 'position-history', label: 'Position History', hasContent: false },
]

// Common tab trigger styles
const TAB_TRIGGER_CLASSES = "data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:bg-transparent data-[state=active]:text-white bg-transparent text-gray-400 hover:text-white border-b-2 border-transparent rounded-none py-3 px-4"

export const PositionsTab = memo(() => {
  return (
    <div className="w-full">
      <Tabs defaultValue="positions" className="w-full">
        <TabsList className="grid w-full grid-cols-7 bg-transparent border-b border-gray-700 rounded-none h-auto p-0">
          {TAB_CONFIG.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className={TAB_TRIGGER_CLASSES}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {TAB_CONFIG.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="mt-0">
            {tab.hasContent ? <PositionsTable /> : <EmptyState message={`No ${tab.value.replace('-', ' ')}`} />}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
})

PositionsTab.displayName = 'PositionsTab'

const EmptyState = memo(({ message = "No data available" }) => {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="text-center text-gray-500">
        <p>{message}</p>
      </div>
    </div>
  )
})

EmptyState.displayName = 'EmptyState'