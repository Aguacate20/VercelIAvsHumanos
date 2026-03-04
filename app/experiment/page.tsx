'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { saveSituationResponse } from '@/lib/supabase'
import { situations } from '@/lib/situations'

type Screen = 'intro_ai' | 'intro_human' | 'experiment' | 'finished'

const AI_IMAGE = 'https://raw.githubusercontent.com/SebastianFullStack/images/main/IA.png'
const HUMAN_IMAGE = 'https://raw.githubusercontent.com/SebastianFullStack/images/main/Humano.png'

export default function ExperimentPage() {
  const router = useRouter()
  const [screen, setScreen] = useState<Screen>('intro_ai')
  const [situationIndex, setSituationIndex] = useState(0)
  const [sliderValue, setSliderValue] = useState(50)
  const [loading, setLoading] = useState(false)
  const [participantId, setParticipantId] = useState<string | null>(null)
  const startTimeRef = useRef<number>(Date.now())

  useEffect(() => {
    const id = sessionStorage.getItem('participant_id')
    if (!id) { router.replace('/'); return }
    setParticipantId(id)
  }, [router])

  // Reset slider and timer on each new situation
  useEffect(() => {
    if (screen === 'experiment') {
      setSliderValue(50)
      startTimeRef.current = Date.now()
    }
  }, [situationIndex, screen])

  const handleNext = useCallback(async () => {
    if (loading) return
    if (screen === 'intro_ai') { setScreen('intro_human'); return }
    if (screen === 'intro_human') {
      setScreen('experiment')
      startTimeRef.current = Date.now()
      return
    }
    if (screen === 'experiment') {
      if (!participantId) return
      setLoading(true)
      try {
        const elapsed = (Date.now() - startTimeRef.current) / 1000
        await saveSituationResponse(participantId, situationIndex, elapsed, sliderValue)
        const nextIndex = situationIndex + 1
        if (nextIndex >= situations.length) {
          setScreen('finished')
        } else {
          setSituationIndex(nextIndex)
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
  }, [loading, screen, participantId, situationIndex, sliderValue])

  // Update CSS variable for slider gradient
  function handleSliderChange(val: number) {
    setSliderValue(val)
  }

  if (!participantId) return null

  // ─── Finished ───────────────────────────────────────────────────────────────
  if (screen === 'finished') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4"
        style={{ background: 'linear-gradient(160deg, #182a67 0%, #2a4199 100%)' }}>
        <div className="text-center max-w-md fade-in">
          <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-heading text-white mb-4">¡Muchas gracias!</h1>
          <p className="text-white/70 font-body text-base leading-relaxed mb-8">
            Tus respuestas han sido guardadas exitosamente.<br />
            Tu participación es muy valiosa para esta investigación.<br /><br />
            Puedes cerrar esta página.
          </p>
          <div className="bg-white/10 rounded-2xl p-4">
            <p className="text-white/60 text-xs font-body">
              Johan Sebastián Galindez Acosta<br />
              johangalac@unisabana.edu.co · +57 310 381 7021
            </p>
          </div>
        </div>
      </div>
    )
  }

  // ─── Intro screens ──────────────────────────────────────────────────────────
  if (screen === 'intro_ai' || screen === 'intro_human') {
    const isAI = screen === 'intro_ai'
    return (
      <div className="min-h-screen flex flex-col"
        style={{ background: 'linear-gradient(160deg, #182a67 0%, #2a4199 100%)' }}>
        {/* Header */}
        <header className="px-6 py-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs font-heading">US</span>
          </div>
          <p className="text-white/70 text-xs font-body">Universidad de La Sabana · Experimento</p>
        </header>

        {/* Step indicator */}
        <div className="flex justify-center gap-2 mb-6 px-4">
          {['intro_ai', 'intro_human', 'experiment'].map((s, i) => (
            <div key={s} className={`h-1.5 rounded-full transition-all duration-300 ${
              (screen === 'intro_ai' && i === 0) || (screen === 'intro_human' && i === 1)
                ? 'bg-white w-8'
                : i < (['intro_ai', 'intro_human', 'experiment'].indexOf(screen))
                  ? 'bg-white/60 w-4'
                  : 'bg-white/20 w-4'
            }`} />
          ))}
        </div>

        <main className="flex-1 flex flex-col items-center justify-center px-4 pb-8">
          <div className="card w-full max-w-md overflow-hidden fade-in">
            {/* Image area */}
            <div className="relative bg-sabana-blue-muted" style={{ height: '280px' }}>
              <Image
                src={isAI ? AI_IMAGE : HUMAN_IMAGE}
                alt={isAI ? 'Agente IA' : 'Agente Humano'}
                fill
                className="object-contain p-4"
                unoptimized
              />
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="inline-block px-3 py-1 rounded-full text-xs font-body font-medium mb-3"
                style={{ background: '#e8ecf7', color: '#182a67' }}>
                {isAI ? 'Agente 1 de 2' : 'Agente 2 de 2'}
              </div>
              <h2 className="text-2xl font-heading text-sabana-blue mb-2">
                {isAI ? 'Inteligencia Artificial' : 'Asesor Humano'}
              </h2>
              <p className="text-gray-500 font-body text-sm leading-relaxed mb-6">
                {isAI
                  ? 'Este es el agente de Inteligencia Artificial. En las siguientes situaciones, podrás indicar qué tanto confiarías en recibir orientación de una IA.'
                  : 'Este es el agente Humano. En las siguientes situaciones, podrás indicar qué tanto confiarías en recibir orientación de una persona.'}
              </p>
              <button
                onClick={handleNext}
                className="w-full py-3.5 rounded-xl font-body font-semibold text-white text-sm transition-all"
                style={{ background: 'linear-gradient(135deg, #182a67, #2a4199)' }}
              >
                {isAI ? 'Ver siguiente agente →' : 'Comenzar experimento →'}
              </button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // ─── Main experiment screen ─────────────────────────────────────────────────
  const situation = situations[situationIndex]
  const progress = ((situationIndex) / situations.length) * 100
  const sliderPct = sliderValue

  return (
    <div className="min-h-screen bg-[#f7f8fc] flex flex-col">
      {/* Top progress bar */}
      <div className="bg-sabana-blue">
        <div className="flex items-center px-4 py-2.5 gap-3 max-w-3xl mx-auto">
          <span className="text-white/70 text-xs font-body whitespace-nowrap">
            {situationIndex + 1} / {situations.length}
          </span>
          <div className="flex-1 bg-white/20 rounded-full h-1.5">
            <div className="bg-white rounded-full h-1.5 progress-bar" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      <main className="flex-1 flex flex-col items-center px-4 py-6 md:py-10">
        <div className="w-full max-w-3xl">

          {/* Situation card */}
          <div className="card p-6 md:p-8 mb-6 fade-in" key={situationIndex}>
            <div className="text-center mb-6">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-body font-medium mb-4"
                style={{ background: '#e8ecf7', color: '#182a67' }}>
                Situación {situationIndex + 1}
              </span>
              <p className="text-base md:text-lg font-body text-gray-800 leading-relaxed font-medium">
                {situation}
              </p>
            </div>

            {/* Agents + Slider */}
            <div className="mt-6">
              {/* Labels row */}
              <div className="flex justify-between items-end mb-3 px-1">
                <div className="flex flex-col items-center gap-1">
                  <div className="relative w-16 h-16 md:w-20 md:h-20">
                    <Image src={AI_IMAGE} alt="IA" fill className="object-contain" unoptimized />
                  </div>
                  <span className="text-xs font-body font-bold text-sabana-blue">IA</span>
                  <span className="text-xs font-body text-gray-400">0</span>
                </div>

                <div className="flex-1 px-3 md:px-6 flex flex-col items-center gap-1">
                  <div className="w-full relative">
                    {/* Slider value bubble */}
                    <div
                      className="absolute -top-8 transform -translate-x-1/2 bg-sabana-blue text-white text-xs font-body font-bold px-2 py-0.5 rounded-full pointer-events-none transition-all"
                      style={{ left: `${sliderPct}%` }}
                    >
                      {sliderValue}
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={sliderValue}
                      onChange={e => handleSliderChange(Number(e.target.value))}
                      className="custom-slider w-full"
                      style={{ '--slider-pct': `${sliderPct}%` } as React.CSSProperties}
                    />
                  </div>
                  <p className="text-xs text-gray-400 font-body text-center mt-2 leading-tight">
                    Mueve el deslizador hacia quien más confiarías
                  </p>
                </div>

                <div className="flex flex-col items-center gap-1">
                  <div className="relative w-16 h-16 md:w-20 md:h-20">
                    <Image src={HUMAN_IMAGE} alt="Humano" fill className="object-contain" unoptimized />
                  </div>
                  <span className="text-xs font-body font-bold text-sabana-blue">Humano</span>
                  <span className="text-xs font-body text-gray-400">100</span>
                </div>
              </div>

              {/* Semantic labels */}
              <div className="flex justify-between mt-1 px-1">
                <span className="text-xs font-body text-sabana-blue font-medium">← Confío más en IA</span>
                <span className="text-xs font-body text-sabana-blue font-medium">Confío más en Humano →</span>
              </div>
            </div>
          </div>

          {/* Submit button */}
          <button
            onClick={handleNext}
            disabled={loading}
            className="w-full py-4 rounded-2xl font-body font-semibold text-white text-base transition-all duration-200 disabled:opacity-60 shadow-lg"
            style={{ background: loading ? '#94a3b8' : 'linear-gradient(135deg, #182a67, #2a4199)' }}
          >
            {loading
              ? 'Guardando...'
              : situationIndex + 1 >= situations.length
                ? 'Finalizar experimento ✓'
                : 'Siguiente situación →'}
          </button>

        </div>
      </main>
    </div>
  )
}

