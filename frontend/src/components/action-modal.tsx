import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material'

interface ActionModalProps {
  title?: string
  content: string
  onConfirm?: () => void
  onCancel?: () => void
}
export default function ActionModal({
  title,
  content,
  onConfirm,
  onCancel,
}: ActionModalProps) {
  return (
    <Dialog
      open={true}
      onClose={onCancel}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      sx={{ zIndex: 10000 }} // valor maior que o do Sheet
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <p className="text-gray02">{content}</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>CANCELAR</Button>
        <Button onClick={onConfirm}>OK</Button>
      </DialogActions>
    </Dialog>
  )
}
