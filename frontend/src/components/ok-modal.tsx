import { Button, DialogActions, DialogContent } from '@mui/material'
import Dialog from '@mui/material/Dialog'

export default function OkModal(
  text: string,
  onOK?: () => void,
  onClose?: () => void
) {
  return (
    <Dialog
      open={true}
      onClose={onClose}
      sx={{ zIndex: 10000 }} // valor maior que o do Sheet
    >
      <DialogContent>
        <p className="text-gray02">{text}</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={onOK} autoFocus>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  )
}
