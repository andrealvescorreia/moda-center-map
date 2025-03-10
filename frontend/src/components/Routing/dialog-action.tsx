import { ArrowLeft } from 'lucide-react'

interface DialogActionProps {
  onAccept?: () => void
  onCancel?: () => void
  acceptEnabled?: boolean
  title: string
  text: string
}

export function DialogAction({
  onAccept,
  onCancel,
  acceptEnabled = true,
  title,
  text,
}: DialogActionProps) {
  return (
    <div className="w-full flex bg-green-secondary gap-1 p-3 text-white rounded-xl font-inter pb-5 items-start">
      <button type="button" className="hover:cursor-pointer" onClick={onCancel}>
        <ArrowLeft className="size-8" />
      </button>
      <div className="flex flex-col gap-1 pl-2">
        <h2 className="text-base">{title}</h2>
        <p className="text-gray-500 text-sm">{text}</p>
      </div>
      <button
        className="ml-auto font-bold hover:cursor-pointer  right-2.5 relative text-base disabled:opacity-50"
        type="button"
        onClick={onAccept}
        disabled={!acceptEnabled}
      >
        OK
      </button>
    </div>
  )
}
