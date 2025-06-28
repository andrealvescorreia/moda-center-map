import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { useRef } from 'react'
import { createPortal } from 'react-dom'
import { InputField, InputRoot } from '../input'

interface NoteProps {
  defaultNote?: string
  onSave?: (note: string) => void
  onClose?: (note: string) => void
}

export default function Note({ defaultNote, onSave, onClose }: NoteProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const noteRef = useRef<HTMLTextAreaElement>(null)
  const openModal = () => setModalOpen(true)
  const closeModal = () => setModalOpen(false)

  const handleSave = () => {
    if (noteRef.current && onSave) {
      onSave(noteRef.current.value)
    }
    closeModal()
  }
  const handleClose = () => {
    console.log('Fechando nota:', noteRef.current?.value)
    if (noteRef.current && onClose) {
      onClose(noteRef.current.value)
    }
    closeModal()
  }

  return (
    <span className="w-full">
      <InputRoot
        className="rounded-xl border-gray03 bg-gray06"
        onClick={() => openModal()}
      >
        <InputField
          placeholder="Escrever uma nota..."
          defaultValue={defaultNote}
          readOnly
        />
      </InputRoot>
      {createPortal(
        <span>
          {modalOpen && (
            <div className="fixed top-0 left-0 bg-black/50 w-full h-full z-100000">
              <div className="absolute flex items-center justify-center w-full h-full top-0 left-0">
                <div className="absolute top-5 w-[95%] md:w-[55%] bg-white p-4 rounded-lg shadow-lg">
                  <button type="button" className="hover:cursor-pointer">
                    <ArrowLeft
                      className="text-gray04"
                      onClick={() => handleClose()}
                    />
                  </button>
                  <textarea
                    className="w-full h-[38dvh] md:h-90 p-2 border-none rounded-lg focus:outline-none resize-none"
                    placeholder="Escrever uma nota..."
                    // biome-ignore lint/a11y/noAutofocus: <explanation>
                    autoFocus={!defaultNote}
                    defaultValue={defaultNote}
                    ref={noteRef}
                  />
                  <div className="flex justify-end">
                    <button
                      className="hover:cursor-pointer"
                      onClick={() => handleSave()}
                      type="button"
                    >
                      OK
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </span>,
        document.body
      )}
    </span>
  )
}
