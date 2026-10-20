import { useEffect, useRef, useState } from 'react'
import { FileText, Pause, Play, RotateCcw } from 'lucide-react'
import availableAudio from 'virtual:audio-manifest'
import { connectAnalyser, getAudioContext } from './audioGraph'
import { Dialog } from '../ui/Dialog'
import { frame } from '../../content/frame'
import { useAudioState } from '../../state/audio'

export type AudioControlProps = {
  /** Nombre del archivo en public/audio, p. ej. «pantalla-01.mp3». */
  file: string
  transcript?: string
}

const formatTime = (seconds: number) => {
  const s = Number.isFinite(seconds) ? Math.floor(seconds) : 0
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

const roundButton
  = 'flex size-11 shrink-0 items-center justify-center rounded-full transition-[background-color] '
    + 'disabled:cursor-not-allowed disabled:opacity-50'

/**
 * Una sola instancia vive en la barra inferior y se monta de nuevo en cada pantalla
 * (key), así que solo suena un audio a la vez y se detiene al cambiar de pantalla.
 */
export const AudioControl = ({ file, transcript }: AudioControlProps) => {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [failed, setFailed] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [transcriptOpen, setTranscriptOpen] = useState(false)
  const { setIsPlaying, setAnalyser } = useAudioState()

  const available = availableAudio.includes(file) && !failed

  useEffect(() => {
    const audio = audioRef.current
    return () => {
      audio?.pause()
      setIsPlaying(false)
      setAnalyser(null)
    }
  }, [setIsPlaying, setAnalyser])

  const updatePlaying = (value: boolean) => {
    setPlaying(value)
    setIsPlaying(value)
  }

  const play = async () => {
    const audio = audioRef.current
    if (!audio) return
    // Dentro del gesto del usuario: conectar el analizador para la boca de DataMind.
    // Una vez conectado, el sonido pasa por el AudioContext, que debe estar activo.
    const analyser = connectAnalyser(audio)
    try {
      await getAudioContext()?.resume()
    }
    catch {
      // Si no se puede reanudar, el audio intentará sonar igual.
    }
    setAnalyser(analyser)
    audio.play().catch(() => updatePlaying(false))
  }

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) void play()
    else audio.pause()
  }

  const replay = () => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = 0
    void play()
  }

  const progress = duration > 0 ? Math.min(time / duration, 1) : 0

  return (
    <div className="flex min-w-0 items-center gap-3">
      {availableAudio.includes(file) && (
        <audio
          ref={audioRef}
          src={`./audio/${file}`}
          preload="metadata"
          onPlay={() => updatePlaying(true)}
          onPause={() => updatePlaying(false)}
          onEnded={() => updatePlaying(false)}
          onTimeUpdate={e => setTime(e.currentTarget.currentTime)}
          onLoadedMetadata={e => setDuration(e.currentTarget.duration)}
          onError={() => {
            setFailed(true)
            updatePlaying(false)
          }}
        />
      )}

      <button
        type="button"
        onClick={toggle}
        disabled={!available}
        aria-label={playing ? frame.audioPause : frame.audioPlay}
        className={`${roundButton} bg-ink text-white hover:enabled:bg-ink-soft`}
      >
        {playing
          ? <Pause size={20} fill="currentColor" aria-hidden="true" />
          : <Play size={20} fill="currentColor" className="translate-x-px" aria-hidden="true" />}
      </button>

      <button
        type="button"
        onClick={replay}
        disabled={!available}
        aria-label={frame.audioReplay}
        className={`${roundButton} text-ink hover:enabled:bg-track`}
      >
        <RotateCcw size={20} aria-hidden="true" />
      </button>

      <span className="hidden text-small text-ink-soft md:inline">{frame.audioName}</span>

      {available
        ? (
            <>
              <div
                role="progressbar"
                aria-label={frame.audioProgress}
                aria-valuemin={0}
                aria-valuemax={Math.floor(duration || 0)}
                aria-valuenow={Math.floor(time)}
                aria-valuetext={`${formatTime(time)} / ${formatTime(duration)}`}
                className="hidden h-1.5 w-55 shrink-0 overflow-hidden rounded-full bg-track md:block"
              >
                <div className="h-full rounded-full bg-data" style={{ width: `${progress * 100}%` }} />
              </div>
              <span className="text-small whitespace-nowrap text-muted tabular-nums">
                {formatTime(time)}
                {' / '}
                {formatTime(duration)}
              </span>
            </>
          )
        : <span className="text-small whitespace-nowrap text-muted">{frame.audioUnavailable}</span>}

      {transcript && (
        <>
          <button
            type="button"
            aria-haspopup="dialog"
            onClick={() => setTranscriptOpen(true)}
            className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full px-3 text-small font-medium text-ink transition-[background-color] hover:bg-track"
          >
            <FileText size={18} aria-hidden="true" />
            {frame.transcript}
          </button>
          <Dialog
            open={transcriptOpen}
            onClose={() => setTranscriptOpen(false)}
            title={frame.transcript}
          >
            <p>{transcript}</p>
          </Dialog>
        </>
      )}
    </div>
  )
}
