import { X } from 'lucide-react'
import { Sheet } from 'react-modal-sheet'

interface SheetHeaderTitleProps {
  children: React.ReactNode
  onDismiss?: () => void
}
export function SheetHeaderTitle({
  children,
  onDismiss,
}: SheetHeaderTitleProps) {
  return (
    <Sheet.Header className="flex justify-center items-center relative">
      <div className="bg-gray05 w-8 rounded-2xl h-1 absolute top-1" />
      <div className="w-full flex justify-between items-center pt-2  text-3xl">
        {children}
        <button
          type="button"
          className="ml-auto size-5 pr-6 hover:cursor-pointer absolute top-0.5 right-0"
          onClick={onDismiss}
        >
          <X size={18} className="hover:cursor-pointer" onClick={onDismiss} />
        </button>
      </div>
    </Sheet.Header>
  )
}
