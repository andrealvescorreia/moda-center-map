import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ArrowLeft } from 'lucide-react'
import { type ComponentProps, useRef } from 'react'

interface DialogActionProps extends ComponentProps<'div'> {
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
  ...props
}: DialogActionProps) {
  const dialogRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const dialogElement = dialogRef.current
    gsap.fromTo(
      dialogElement,
      { opacity: 0, y: -50 },
      { opacity: 1, y: 0, duration: 0.2, ease: 'power2.out' }
    )
  })
  return (
    <div
      ref={dialogRef}
      className="w-full flex bg-green-secondary gap-1 p-3 text-white rounded-xl pb-5 items-start"
      {...props}
    >
      <button type="button" className="hover:cursor-pointer" onClick={onCancel}>
        <ArrowLeft className="size-8" />
      </button>
      <div className="flex flex-col gap-1 pl-2">
        <h2 className="text-base">{title}</h2>
        <p className="text-gray05 text-sm">{text}</p>
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
