import { CircularProgress } from '@mui/material'
import { ArrowLeft } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useSearchParams } from 'react-router-dom'
import { InputField, InputIcon, InputRoot } from '../input'

interface NoteProps {
  defaultNote?: string
  onSave?: (note: string) => void
  onClose?: (note: string) => void
  loading?: boolean
}

export default function Note({
  defaultNote,
  onSave,
  onClose,
  loading,
}: NoteProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const noteRef = useRef<HTMLTextAreaElement>(null)

  const [searchParams, setSearchParams] = useSearchParams()
  const state = searchParams.get('edit-note')

  const enterEditMode = () => setSearchParams({ 'edit-note': 'true' })
  const clearState = () => setSearchParams({})

  useEffect(() => {
    if (state === 'true') {
      setModalOpen(true)
    } else {
      setModalOpen(false)
    }
  }, [state])

  useEffect(() => {
    if (modalOpen && noteRef.current) {
      noteRef.current.focus()
      // Move o cursor para o final do texto
      const length = noteRef.current.value.length
      noteRef.current.setSelectionRange(length, length)
    }
  }, [modalOpen])

  const openModal = () => {
    setModalOpen(true)
    enterEditMode()
  }
  const closeModal = () => {
    setModalOpen(false)
    clearState()
  }

  const handleSave = () => {
    if (noteRef.current && onSave) {
      onSave(noteRef.current.value)
    }
    closeModal()
  }
  const handleClose = () => {
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
          className={`${loading ? 'opacity-50' : ''}`}
          placeholder="Escrever uma nota..."
          defaultValue={defaultNote}
          readOnly
        />
        {loading && (
          <InputIcon className="pt-2">
            <CircularProgress size={20} style={{ color: 'gray' }} />
          </InputIcon>
        )}
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
                    defaultValue={defaultNote}
                    ref={noteRef}
                  />
                  <div className="flex justify-end">
                    <button
                      className="hover:cursor-pointer p-2.5 font-bold"
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
