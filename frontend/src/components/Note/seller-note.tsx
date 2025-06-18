import { useEffect, useState } from 'react'
import Note from '.'
import { getNote, putNote } from '../../http/api'

interface SellerNoteProps {
  seller_id: string
}

export default function SellerNote({ seller_id }: SellerNoteProps) {
  const [sellerNote, setSellerNote] = useState<string>('')
  useEffect(() => {
    getNote(seller_id)
      .then((response) => {
        setSellerNote(response.data.text || '')
      })
      .catch(() => {})
  }, [seller_id])

  const handleSave = (note: string) => {
    if (note === sellerNote) return
    putNote(seller_id, note)
      .then(() => {
        setSellerNote(note)
      })
      .catch((error) => {
        console.error('Erro ao atualizar nota:', error)
      })
  }

  return (
    <Note
      defaultNote={sellerNote}
      onSave={(note) => handleSave(note)}
      onClose={(note) => handleSave(note)}
    />
  )
}
