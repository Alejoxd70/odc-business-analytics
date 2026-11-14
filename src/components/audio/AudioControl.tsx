import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { FileText, Pause, Play, RotateCcw } from 'lucide-react'
import availableAudio from 'virtual:audio-manifest'
import { connectAnalyser, getAudioContext } from './audioGraph'
import { Dialog } from '../ui/Dialog'
import { frame } from '../../content/frame'
import { useAudioState } from '../../state/audio'

export type AudioControlProps = {
  /** File name inside public/audio, e.g. "screen-01.mp3". */
  file: string
  transcript?: string
  /** Plays by itself once mounted (first visit to the screen). */
  autoPlay?: boolean
  /** Called the first time the audio starts playing. */
  onStarted?: () => void
}

/** Lets the screen's entrance begin before DataMind starts talking. */
/** Playback speeds the speed button cycles through. */
const RATES = [1, 1.25, 1.5]

const AUTOPLAY_DELAY = 400
/** Long enough for a click or Enter/Space on "Iniciar" to change the screen first. */
const GESTURE_DELAY = 300

const formatTime = (seconds: number) => {
  const s = Number.isFinite(seconds) ? Math.floor(seconds) : 0
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

const roundButton
  = 'flex size-11 shrink-0 items-center justify-center rounded-full transition-[background-color] '
    + 'disabled:cursor-not-allowed disabled:opacity-50'

/**
 * A single instance lives in the bottom bar and remounts on every screen (key),
 * so only one audio plays at a time and it stops when the screen changes.
 */
export const AudioControl = ({ file, transcript, autoPlay = false, onStarted }: AudioControlProps) => {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [failed, setFailed] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [transcriptOpen, setTranscriptOpen] = useState(false)
  const { setIsPlaying, setAnalyser, rate, setRate } = useAudioState()

  const available = availableAudio.includes(file) && !failed

  useEffect(() => {
    const audio = audioRef.current
    return () => {
      audio?.pause()
      setIsPlaying(false)
      setAnalyser(null)
    }
  }, [setIsPlaying, setAnalyser])

  // The speed is the user's choice for the whole resource: every screen's audio takes it.
  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = rate
  }, [rate])

  const updatePlaying = useCallback((value: boolean) => {
    setPlaying(value)
    setIsPlaying(value)
  }, [setIsPlaying])

  /** Resolves to false when the browser refuses to play (autoplay policy). */
  const play = useCallback(async (): Promise<boolean> => {
    const audio = audioRef.current
    if (!audio) return false
    // After a user gesture: connect the analyser that drives DataMind's mouth.
    // Once connected, sound flows through the AudioContext, which must be running.
    const analyser = connectAnalyser(audio)
    try {
      await getAudioContext()?.resume()
    }
    catch {
      // If it cannot resume, the audio still tries to play.
    }
    setAnalyser(analyser)
    try {
      await audio.play()
      return true
    }
    catch {
      updatePlaying(false)
      return false
    }
  }, [setAnalyser, updatePlaying])

  // Starts by itself on the first visit to the screen. Read once: marking the audio as
  // heard while it plays must not stop it.
  const autoPlayOnMount = useRef(autoPlay)
  useEffect(() => {
    if (!autoPlayOnMount.current || !available) return
    let timer: number | undefined
    let disposed = false
    const stopListening = () => {
      document.removeEventListener('click', startOnGesture, true)
      document.removeEventListener('keydown', startOnGesture, true)
    }
    // Without a previous gesture (the cover, just loaded) the browser blocks the audio and
    // an AudioContext would start suspended, so it waits for the first click or key.
    // The short delay lets a gesture that leaves the screen ("Iniciar") unmount this
    // control first, so the cover's audio never sounds.
    function startOnGesture() {
      stopListening()
      timer = window.setTimeout(() => {
        if (audioRef.current?.paused) void play()
      }, GESTURE_DELAY)
    }
    const waitForGesture = () => {
      if (disposed) return
      document.addEventListener('click', startOnGesture, true)
      document.addEventListener('keydown', startOnGesture, true)
    }
    timer = window.setTimeout(() => {
      if (navigator.userActivation?.hasBeenActive === false) waitForGesture()
      else void play().then(started => started || waitForGesture())
    }, AUTOPLAY_DELAY)
    return () => {
      disposed = true
      window.clearTimeout(timer)
      stopListening()
    }
  }, [available, play])

  // Any playback, automatic or with Play, counts as heard.
  const reportedStart = useRef(false)
  const handlePlay = () => {
    updatePlaying(true)
    if (reportedStart.current) return
    reportedStart.current = true
    onStarted?.()
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

  const seek = (seconds: number) => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = seconds
    setTime(seconds)
  }

  const nextRate = () => setRate(RATES[(RATES.indexOf(rate) + 1) % RATES.length])
  const rateLabel = `${rate.toLocaleString('es-CO')}x`

  const progress = duration > 0 ? Math.min(time / duration, 1) : 0

  return (
    // flex-wrap: on mobile, "Audio no disponible" + "Transcripción" do not fit on one row.
    <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 md:gap-x-3">
      {availableAudio.includes(file) && (
        <audio
          ref={audioRef}
          src={`./audio/${file}`}
          preload="metadata"
          onPlay={handlePlay}
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
              {/* A native slider: drag, click or use the arrow keys to move through the audio */}
              <input
                type="range"
                aria-label={frame.audioSeek}
                aria-valuetext={`${formatTime(time)} / ${formatTime(duration)}`}
                min={0}
                max={duration || 0}
                step={1}
                value={Math.min(time, duration || 0)}
                onChange={e => seek(Number(e.currentTarget.value))}
                className="audio-seek hidden w-55 shrink-0 md:block"
                style={{ '--seek': `${progress * 100}%` } as CSSProperties}
              />
              <span className="text-small whitespace-nowrap text-muted tabular-nums">
                {formatTime(time)}
                {' / '}
                {formatTime(duration)}
              </span>
            </>
          )
        : <span className="text-small whitespace-nowrap text-muted">{frame.audioUnavailable}</span>}

      <button
        type="button"
        onClick={nextRate}
        disabled={!available}
        aria-label={frame.audioRate(rateLabel)}
        className={`${roundButton} w-auto min-w-11 px-2 text-small font-medium text-ink tabular-nums hover:enabled:bg-track`}
      >
        {rateLabel}
      </button>

      {transcript && (
        <>
          <button
            type="button"
            aria-haspopup="dialog"
            onClick={() => setTranscriptOpen(true)}
            // Below 640 px only the icon shows, so the row fits; the label stays as its name.
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-1.5 rounded-full px-3 max-sm:w-11 max-sm:px-0 text-small font-medium text-ink transition-[background-color] hover:bg-track"
          >
            <FileText size={18} aria-hidden="true" />
            <span className="max-sm:sr-only">{frame.transcript}</span>
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
