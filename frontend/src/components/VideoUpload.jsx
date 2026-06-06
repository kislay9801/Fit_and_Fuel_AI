import { useRef, useState, useCallback, useEffect } from 'react'
import { Upload, Film, FastForward, Loader2 } from 'lucide-react'

export default function VideoUpload({
  onFrame,
  onStartAnalysis,
  isSessionActive,
  analysisStatus = 'idle',
  analysisProgress = 0,
  analysisMessage = null,
  children,
}) {
  const fileInputRef = useRef(null)
  const videoRef = useRef(null)
  const [videoSrc, setVideoSrc] = useState(null)
  const [fileName, setFileName] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [status, setStatus] = useState('idle')

  useEffect(() => {
    return () => {
      if (videoSrc) URL.revokeObjectURL(videoSrc)
    }
  }, [videoSrc])

  const handleFile = useCallback((file) => {
    if (!file) return
    if (!file.type.startsWith('video/')) {
      alert('Please upload a video file (.mp4, .mov, .webm)')
      return
    }
    if (videoSrc) URL.revokeObjectURL(videoSrc)
    const url = URL.createObjectURL(file)
    setVideoSrc(url)
    setFileName(file.name)
    setStatus('ready')
  }, [videoSrc])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
    handleFile(e.dataTransfer.files[0])
  }, [handleFile])

  const handleMetadata = useCallback(() => {
    if (videoRef.current && onFrame) onFrame(videoRef.current)
  }, [onFrame])

  const resetVideo = useCallback(() => {
    if (isSessionActive && !window.confirm('Changing the video will discard the current analysis. Continue?')) return
    if (videoSrc) URL.revokeObjectURL(videoSrc)
    setVideoSrc(null)
    setFileName(null)
    setStatus('idle')
  }, [isSessionActive, videoSrc])

  if (!videoSrc) {
    return (
      <div
        onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`w-full aspect-video rounded-2xl flex flex-col items-center justify-center gap-4 cursor-pointer transition-all border-2 border-dashed ${
          isDragging ? 'bg-blue-50/10 border-blue-500' : 'bg-slate-900 border-slate-800 hover:border-slate-700'
        }`}
      >
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${isDragging ? 'bg-blue-500/20' : 'bg-blue-500/10'}`}>
          <Upload className="w-8 h-8 text-blue-500" />
        </div>
        <div className="text-center">
          <p className="text-white font-bold mb-1.5">Drop your video here</p>
          <p className="text-slate-400 text-sm">Supports MP4, MOV, WebM. Click to browse.</p>
          <p className="text-slate-500 text-xs mt-1">Tip: 10-30 second clips work best.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-lg mt-2 text-blue-400 hover:bg-blue-500/20 transition-colors">
          <Film className="w-4 h-4" />
          <span className="text-sm font-semibold tracking-wide">Browse files</span>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={e => handleFile(e.target.files[0])}
        />
      </div>
    )
  }

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Video Container */}
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black ring-1 ring-slate-800">
        <video
          ref={videoRef}
          src={videoSrc}
          crossOrigin="anonymous"
          onLoadedMetadata={handleMetadata}
          playsInline
          muted
          className="w-full h-full object-contain block"
        />

        {children}

        {/* File Name Label */}
        <div className="absolute top-4 left-4 bg-black/75 backdrop-blur rounded-lg px-3 py-1.5 flex items-center gap-2 border border-white/10">
          <Film className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-slate-200 text-xs font-medium max-w-[180px] truncate">
            {fileName}
          </span>
        </div>

        {/* Change Video Button */}
        <button
          onClick={resetVideo}
          disabled={analysisStatus === 'analyzing' || analysisStatus === 'loading_model'}
          className="absolute top-4 right-4 bg-black/75 backdrop-blur border border-white/10 rounded-lg px-3 py-1.5 text-xs font-semibold hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-slate-300 hover:text-white"
        >
          Change video
        </button>

        {/* Analysis Progress Overlay */}
        {(analysisStatus === 'analyzing' || analysisStatus === 'loading_model') && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur p-4 border-t border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-blue-400 text-xs font-bold tracking-wide">
                <Loader2 className="w-4 h-4 animate-spin" />
                {analysisMessage || 'Analyzing frames...'} {analysisProgress}%
              </div>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${analysisProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Done Overlay */}
        {analysisStatus === 'done' && (
          <div className="absolute bottom-0 left-0 right-0 bg-emerald-500/20 backdrop-blur p-4 border-t border-emerald-500/30">
            <span className="text-emerald-400 text-xs font-bold tracking-wide">
              Analysis complete. Click End Session to save and get coaching.
            </span>
          </div>
        )}
      </div>

      {/* Action Buttons (Rendered below the video in Session.jsx) */}
      {status === 'ready' && analysisStatus !== 'analyzing' && analysisStatus !== 'loading_model' && analysisStatus !== 'done' && (
        <div className="flex flex-col gap-3 pt-2">
          <button
            onClick={() => onStartAnalysis?.('fast')}
            className="flex items-center justify-center gap-2 w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-sm transition-colors"
          >
            <FastForward className="w-5 h-5" />
            Start Fast Analysis
          </button>
          
          <button
            onClick={() => onStartAnalysis?.('normal')}
            className="flex items-center justify-center gap-2 w-full py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl font-bold shadow-sm transition-colors"
          >
            Normal Analysis
          </button>
        </div>
      )}
    </div>
  )
}
