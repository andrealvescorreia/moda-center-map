import { CircularProgress } from '@mui/material'

export default function LoadingOverlay() {
  return (
    <div className="absolute ui z-[99999] top-0 left-0 w-[100dvw] h-[100dvh] flex justify-center items-center bg-[#ffffff7f]">
      <CircularProgress />
    </div>
  )
}
