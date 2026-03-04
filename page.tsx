'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { findParticipantByDocument } from '@/lib/supabase'

export default function LandingPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [documentId, setDocumentId] = useState('')
  const [consent, setConsent] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(false)
  const [skipLoading, setSkipLoading] = useState(false)
  const [error, setError] = useState('')

  function saveSession(participantId: string, participantName: string, docId: string) {
    sessionStorage.setItem('participant_id', participantId)
    sessionStorage.setItem('participant_name', participantName)
    sessionStorage.setItem('document_id', docId)
  }

  async function handleStart() {
    setError('')
    if (!name.trim()) { setError('Por favor ingresa tu nombre completo.'); return }
    if (!documentId.trim() || !/^\d+$/.test(documentId)) {
      setError('Por favor ingresa un número de documento válido (solo números, sin puntos ni comas).')
      return
    }
    if (consent === null) { setError('Por favor selecciona una opción de consentimiento.'); return }
    if (!consent) { setError('Debes aceptar el consentimiento para participar.'); return }

    setLoading(true)
    // Store name + doc in session for questionnaire to use
    sessionStorage.setItem('pending_name', name.trim())
    sessionStorage.setItem('pending_document_id', documentId.trim())
    sessionStorage.setItem('pending_consent', 'Sí')
    router.push('/questionnaire')
  }

  async function handleSkip() {
    setError('')
    if (!documentId.trim() || !/^\d+$/.test(documentId)) {
      setError('Ingresa tu número de documento para identificarte y continuar al experimento.')
      return
    }
    setSkipLoading(true)
    try {
      const participant = await findParticipantByDocument(documentId.trim())
      if (!participant) {
        setError('No encontramos un registro previo con ese documento. Completa el cuestionario primero.')
        setSkipLoading(false)
        return
      }
      saveSession(participant.id, participant.name ?? name, documentId.trim())
      router.push('/experiment')
    } catch {
      setError('Error al buscar tu registro. Intenta de nuevo.')
      setSkipLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(160deg, #182a67 0%, #1e3580 40%, #2a4199 100%)' }}>
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          {/* Logo placeholder — reemplaza con <img src="/logo-sabana.png" ...> si tienes el logo */}
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm font-heading">US</span>
          </div>
          <div>
            <p className="text-white/90 text-xs font-body font-medium tracking-wide uppercase">Universidad de La Sabana</p>
            <p className="text-white/60 text-xs font-body">Doctorado en Psicología</p>
          </div>
        </div>

        {/* Skip button — top right */}
        <button
          onClick={handleSkip}
          disabled={skipLoading}
          className="text-xs text-white/70 hover:text-white border border-white/20 hover:border-white/40 px-3 py-1.5 rounded-full transition-all duration-200 font-body disabled:opacity-50"
        >
          {skipLoading ? 'Buscando...' : 'Omitir cuestionario →'}
        </button>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg">
          {/* Title card */}
          <div className="text-center mb-8 fade-in">
            <h1 className="text-3xl md:text-4xl font-heading text-white mb-3 leading-tight">
              Estudio de Toma<br />de Decisiones
            </h1>
            <p className="text-white/70 font-body text-sm md:text-base leading-relaxed">
              Decisiones emocionales, morales e Inteligencia Artificial
            </p>
          </div>

          {/* Form card */}
          <div className="card p-6 md:p-8 fade-in" style={{ animationDelay: '0.1s' }}>
            {/* Identification */}
            <div className="mb-6">
              <h2 className="text-lg font-heading text-sabana-blue mb-4">Identificación</h2>

              <div className="mb-4">
                <label className="block text-sm font-body font-medium text-gray-700 mb-1.5">
                  Nombre completo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Ej: María García Rodríguez"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-body focus:outline-none focus:border-sabana-blue focus:ring-2 focus:ring-sabana-blue/10 transition-all"
                />
              </div>

              <div className="mb-0">
                <label className="block text-sm font-body font-medium text-gray-700 mb-1.5">
                  Número de documento de identidad <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={documentId}
                  onChange={e => setDocumentId(e.target.value.replace(/\D/g, ''))}
                  placeholder="Ej: 1012345678 (sin puntos ni comas)"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-body focus:outline-none focus:border-sabana-blue focus:ring-2 focus:ring-sabana-blue/10 transition-all"
                />
                <p className="text-xs text-gray-400 mt-1.5 font-body">Solo números, sin puntos, comas ni espacios</p>
              </div>
            </div>

            {/* Consent */}
            <div className="mb-6">
              <h2 className="text-lg font-heading text-sabana-blue mb-3">Consentimiento informado</h2>
              <div className="bg-sabana-blue-muted rounded-xl p-4 max-h-48 overflow-y-auto mb-4">
                <p className="text-xs text-gray-600 font-body leading-relaxed">
                  Muchas gracias por participar en el proyecto del Doctorado en Psicología acerca de decisiones emocionales y morales e Inteligencia Artificial. El presente cuestionario busca conocer sus datos sociodemográficos y forma de contacto, con el fin de generar un perfil completo de los participantes en el estudio. Agradecemos diligenciar todo el cuestionario.<br /><br />
                  Esta actividad se realiza como parte de un ejercicio académico. Toda la información aquí consolidada se manejará bajo principios de <strong>confidencialidad y anonimato</strong>. Los datos se codificarán para que sea imposible el manejo por parte de terceros ajenos al estudio.<br /><br />
                  En cualquier momento puede decidir si continúa o se retira de participar en el estudio, sin ningún tipo de sanción o perjuicio.<br /><br />
                  <strong>Investigador principal:</strong> Johan Sebastián Galindez Acosta<br />
                  Celular: +57 310 381 7021 · johangalac@unisabana.edu.co
                </p>
              </div>

              <div className="flex flex-col gap-2">
                {[
                  { value: true, label: 'Sí, acepto participar en la recolección de datos' },
                  { value: false, label: 'No acepto participar' },
                ].map(opt => (
                  <label
                    key={String(opt.value)}
                    className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all font-body text-sm ${
                      consent === opt.value
                        ? 'border-sabana-blue bg-sabana-blue-muted'
                        : 'border-gray-200 hover:border-sabana-blue/30'
                    }`}
                  >
                    <input
                      type="radio"
                      name="consent"
                      className="mt-0.5 accent-sabana-blue flex-shrink-0"
                      checked={consent === opt.value}
                      onChange={() => setConsent(opt.value)}
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm font-body">
                {error}
              </div>
            )}

            <button
              onClick={handleStart}
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-body font-semibold text-white text-sm transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ background: loading ? '#94a3b8' : 'linear-gradient(135deg, #182a67, #2a4199)' }}
            >
              {loading ? 'Iniciando...' : 'Comenzar cuestionario →'}
            </button>
          </div>

          <p className="text-center text-white/40 text-xs font-body mt-6">
            ¿Ya completaste el cuestionario? Usa el botón &quot;Omitir cuestionario&quot; en la parte superior derecha.
          </p>
        </div>
      </main>
    </div>
  )
}
