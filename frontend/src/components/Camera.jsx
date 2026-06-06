import { useEffect, useRef, useState } from 'react'
import { Camera as CameraIcon, AlertCircle, Loader2 } from 'lucide-react'

export default function Camera({ onFrame, isActive, children }) {
  const videoRef = useRef(null)
  const [error, setError] = useState(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!isActive) return

    let stream = null

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720, facingMode: 'user' },
          audio: false,
        })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.onloadeddata = () => setLoaded(true)
        }
      } catch (err) {
        setError('Camera access denied. Please allow camera access and refresh.')
        console.error('Camera error:', err)
      }
    }

    startCamera()

    return () => {
      if (stream) {
        stream.getTracks().forEach(t => t.stop())
      }
      setLoaded(false)
    }
  }, [isActive])

  // Expose video element via callback
  useEffect(() => {
    if (loaded && onFrame && videoRef.current) {
      onFrame(videoRef.current)
    }
  }, [loaded, onFrame])

  if (error) {
    return (
      <div className="w-full aspect-video bg-slate-900 rounded-2xl flex flex-col items-center justify-center gap-3 border border-slate-800">
        <AlertCircle className="w-10 h-10 text-red-500" />
        <p className="text-slate-400 text-sm text-center max-w-[280px]">{error}</p>
      </div>
    )
  }

  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-900">
      {!loaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-900 z-10">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
          <p className="text-slate-400 text-sm font-medium">Initializing camera...</p>
        </div>
      )}

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover block"
        style={{ transform: 'scaleX(-1)' }}
      />

      {children}

      {/* Positioning guide overlay */}
      {loaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-end p-6 pointer-events-none">
          <div className="w-full max-w-[300px] h-full border-2 border-dashed border-white/20 rounded-xl mb-4 flex items-center justify-center relative">
             <div className="absolute top-4 w-12 h-12 border-t-2 border-l-2 border-white/40 left-4 rounded-tl-xl" />
             <div className="absolute top-4 w-12 h-12 border-t-2 border-r-2 border-white/40 right-4 rounded-tr-xl" />
             <div className="absolute bottom-4 w-12 h-12 border-b-2 border-l-2 border-white/40 left-4 rounded-bl-xl" />
             <div className="absolute bottom-4 w-12 h-12 border-b-2 border-r-2 border-white/40 right-4 rounded-br-xl" />
          </div>
          <div className="px-4 py-2 bg-black/60 backdrop-blur rounded-full flex items-center gap-2">
             <CameraIcon className="w-4 h-4 text-blue-400" />
             <span className="text-white text-xs font-bold tracking-wide">Keep full body in frame</span>
          </div>
        </div>
      )}
    </div>
  )
}
