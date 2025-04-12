import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'

export default function DialogModal({
  onCancel,
  onAccept,
  title,
  children,
}: {
  onCancel: () => void
  onAccept: () => void
  title: string
  children?: React.ReactNode
}) {
  const handleClose = () => {
    onCancel()
  }
  const handleAccept = () => {
    onAccept()
  }
  return (
    <Dialog
      open
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Button onClick={handleClose} autoFocus>
          CANCELAR
        </Button>
        <Button onClick={handleAccept} autoFocus>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  )
}
