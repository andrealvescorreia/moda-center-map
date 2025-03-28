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
    <Sheet.Header className="flex justify-center items-center">
      <div className="bg-gray05 w-8 rounded-2xl h-1 absolute top-1" />
      <div className="w-full flex justify-between items-center pt-2  text-3xl">
        {children}
        <button
          type="button"
          className="ml-auto w-2 pr-6 hover:cursor-pointer -mt-3.5"
          onClick={onDismiss}
        >
          <X size={18} />
        </button>
      </div>
    </Sheet.Header>
  )
}
