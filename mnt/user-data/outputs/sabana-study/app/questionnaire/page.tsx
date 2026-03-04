'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { saveQuestionnaireData } from '@/lib/supabase'
import { LIKERT_OPTIONS } from '@/lib/situations'

// ─── Question data ────────────────────────────────────────────────────────────
const SOCIO_DEVICES = [
  "Smartphones", "Computadoras portátiles", "Tablet", "Smart TV", "Consolas de videojuegos",
  "Asistentes de voz", "Dispositivos de streaming", "Altavoces Bluetooth",
  "Cámaras de seguridad inteligentes", "Wearables", "Impresoras multifunción",
  "Dispositivos de realidad virtual (VR)", "Dispositivos de cocina inteligente",
  "Cámaras digitales y videocámaras", "Dispositivos de domótica", "Auriculares inalámbricos",
]

const RUI_QUESTIONS = [
  "La inteligencia artificial utiliza algoritmos para aprender a partir de datos y realizar tareas que requieren inteligencia.",
  "El uso de grandes cantidades de datos ayuda a que algunos algoritmos de inteligencia artificial mejoren su desempeño.",
  "La inteligencia artificial se aplica al reconocimiento del habla humana.",
  "La capacidad de aprender de la experiencia es una característica de la inteligencia.",
  "La inteligencia humana es la única forma de inteligencia que puede considerarse verdadera inteligencia.",
  "La capacidad de usar herramientas y manipular el entorno es una forma de inteligencia.",
  "La inteligencia artificial puede programarse para realizar una amplia variedad de tareas con precisión y consistencia, superando las habilidades específicas de la inteligencia infantil.",
  "Las humanidades (como la filosofía, la literatura, la ética) no tienen lugar dentro de la inteligencia artificial.",
  "La inteligencia artificial es una sola tecnología.",
  "La visión por computadora es un ejemplo de tecnología de inteligencia artificial interdisciplinaria.",
]

const GN_QUESTIONS = [
  "La inteligencia artificial estrecha se refiere a algoritmos que resuelven problemas específicos.",
  "La inteligencia artificial enfocada en tareas concretas se denomina inteligencia artificial estrecha.",
  "La inteligencia artificial puede dividirse en subcampos específicos, como la inteligencia artificial general y la inteligencia artificial estrecha.",
  "Los sistemas de inteligencia artificial estrecha están diseñados para tareas y dominios específicos.",
]

const WHAT_CAN_AI_DO = [
  "La inteligencia artificial se destaca por su buen desempeño en entornos complejos, como conducir en calles con mucho tráfico.",
  "Al ser un tema intercultural, la inteligencia artificial se aplica por igual en todos los países.",
  "Las decisiones de alto impacto es mejor dejarlas en manos de la inteligencia artificial, porque es más neutral que los seres humanos.",
  "Las inteligencias artificiales actuales son plenamente capaces de realizar asociaciones complejas, tal como lo hacen los seres humanos.",
  "La inteligencia artificial es eficiente para resolver problemas que involucran emociones.",
]

const HOW_AI_WORKS = [
  "Algunos sistemas de inteligencia artificial pueden representar patrones visuales o auditivos.",
  "Ejemplos de representación del conocimiento incluyen los árboles de decisión y las redes bayesianas.",
  "La representación del conocimiento cumple un papel fundamental en el aprendizaje automático, ya que permite crear representaciones de características a partir de datos sin procesar.",
  "Los sistemas basados en reglas son un ejemplo de cómo las computadoras pueden razonar.",
  "Las computadoras solo pueden razonar y tomar decisiones de una manera idéntica a la de los seres humanos.",
  "El aprendizaje automático se utiliza para predecir, agrupar y clasificar grandes cantidades de datos.",
  "El aprendizaje profundo es un tipo de aprendizaje automático.",
  "Los algoritmos de aprendizaje automático aprenden a partir de datos.",
  "En el aprendizaje automático, los conjuntos de datos se dividen con frecuencia en un conjunto de entrenamiento y un conjunto de prueba.",
  "La selección del modelo es un paso importante en el proceso de aprendizaje automático.",
  "Los datos sesgados perpetúan los estereotipos sociales.",
  "Los datos están sujetos a interpretación.",
  "Parte de los datos utilizados en la inteligencia artificial se construyen dentro de un contexto cultural particular, lo cual puede influir en los resultados de los modelos que los emplean.",
  "Dado que los datos son objetivos, los modelos de aprendizaje automático no presentan sesgos.",
  "Los datos utilizados para entrenar un modelo de aprendizaje automático pueden estar sesgados.",
  "El sesgo en los datos usados para entrenar un modelo de aprendizaje automático puede generar resultados sesgados.",
  "La supervisión humana es necesaria para garantizar que los sistemas de inteligencia artificial se utilicen de manera ética y responsable.",
  "El papel de los seres humanos en el desarrollo de la inteligencia artificial se limita a supervisar el desempeño del sistema.",
  "La conducción autónoma es un área de aplicación de la inteligencia artificial.",
  "Los robots no solo pueden actuar sobre el mundo, sino también reaccionar.",
  "Los micrófonos son un tipo de sensor que se utiliza en robótica.",
  "Los sensores ayudan al robot a comprender su entorno.",
  "Los sensores son dispositivos que detectan y convierten propiedades físicas medibles en un formato digital.",
]

const HOW_AI_SHOULD_BE_USED = [
  "Para lograr una mayor transparencia, deben comunicarse el código fuente, el uso de los datos, la base de evidencia para el uso de la inteligencia artificial, sus limitaciones y las responsabilidades asociadas.",
  "La inteligencia artificial debe crearse de acuerdo con los principios democráticos y las cuestiones sociales.",
  "Es necesario desarrollar y fortalecer las normas y leyes, incluyendo el derecho a apelar, reclamar o solicitar reparación ante soluciones basadas en inteligencia artificial.",
  "La inteligencia artificial debe informar sobre las razones y procesos subyacentes que puedan conducir a un daño potencial.",
  "Los desarrolladores, diseñadores, instituciones o la industria de la inteligencia artificial deben rendir cuentas por las acciones de la IA.",
  "La privacidad debe garantizarse mediante el diseño de la inteligencia artificial, el control de acceso, la sensibilización pública y los enfoques regulatorios.",
  "El desarrollo de la inteligencia artificial debe estar alineado con los valores humanos y los derechos humanos.",
  "Una inteligencia artificial confiable debe incluir fiabilidad, responsabilidad y procesos para supervisar y evaluar la integridad de los sistemas de IA a lo largo del tiempo.",
  "La inteligencia artificial no debe disminuir ni destruir, sino respetar, preservar e incluso fortalecer la dignidad humana.",
  "Los beneficios de la inteligencia artificial no deben poner en riesgo la cohesión social ni el respeto hacia las personas y grupos potencialmente vulnerables.",
]

// ─── Types ────────────────────────────────────────────────────────────────────
type FormData = Record<string, string | number | string[]>

// ─── Helper components ───────────────────────────────────────────────────────
function LikertQuestion({ index, question, fieldKey, value, onChange }: {
  index: number
  question: string
  fieldKey: string
  value: number | undefined
  onChange: (key: string, val: number) => void
}) {
  return (
    <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
      <p className="text-sm font-body text-gray-800 mb-3 leading-relaxed">
        <span className="font-semibold text-sabana-blue">{index}.</span> {question}
      </p>
      <div className="flex flex-wrap gap-2">
        {LIKERT_OPTIONS.map(opt => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(fieldKey, opt.value)}
            className={`px-3 py-2 rounded-lg text-xs font-body font-medium transition-all duration-150 border-2 ${
              value === opt.value
                ? 'border-sabana-blue bg-sabana-blue text-white'
                : 'border-gray-200 text-gray-600 hover:border-sabana-blue/50 hover:bg-sabana-blue-muted'
            }`}
          >
            {opt.value}
          </button>
        ))}
      </div>
      {value !== undefined && (
        <p className="text-xs text-sabana-blue mt-2 font-body">{LIKERT_OPTIONS.find(o => o.value === value)?.label}</p>
      )}
    </div>
  )
}

function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6 pt-2">
      <div className="w-8 h-1 bg-sabana-blue rounded mb-3" />
      <h2 className="text-xl font-heading text-sabana-blue">{title}</h2>
      {subtitle && <p className="text-sm font-body text-gray-500 mt-1">{subtitle}</p>}
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function QuestionnairePage() {
  const router = useRouter()
  const [form, setForm] = useState<FormData>({})
  const [devices, setDevices] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement
      const pct = (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100
      setScrollProgress(Math.min(pct, 100))
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function setField(key: string, value: string | number) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function toggleDevice(device: string) {
    setDevices(prev =>
      prev.includes(device) ? prev.filter(d => d !== device) : [...prev, device]
    )
  }

  // Build all likert keys for validation
  const allLikertKeys = [
    ...RUI_QUESTIONS.map((_, i) => `rui_${i + 1}`),
    ...GN_QUESTIONS.map((_, i) => `gn_${i + 1}`),
    ...WHAT_CAN_AI_DO.map((_, i) => `what_can_ai_do_${i + 1}`),
    ...HOW_AI_WORKS.map((_, i) => `how_does_ai_work_${i + 1}`),
    ...HOW_AI_SHOULD_BE_USED.map((_, i) => `how_should_ai_be_used_${i + 1}`),
  ]

  async function handleSubmit() {
    setError('')

    // Validate socio fields
    if (!form.nationality) { setError('Por favor completa la nacionalidad.'); window.scrollTo(0,0); return }
    if (!form.birthdate) { setError('Por favor ingresa tu fecha de nacimiento.'); window.scrollTo(0,0); return }
    if (!form.tech_time) { setError('Por favor selecciona cuánto tiempo usas tecnología.'); window.scrollTo(0,0); return }
    if (!form.socio_stratum) { setError('Por favor selecciona tu estrato.'); window.scrollTo(0,0); return }

    // Validate all likert
    const missing = allLikertKeys.filter(k => form[k] === undefined)
    if (missing.length > 0) {
      setError(`Por favor responde todas las preguntas (faltan ${missing.length} respuestas).`)
      return
    }

    setLoading(true)
    try {
      const pendingName = sessionStorage.getItem('pending_name') ?? ''
      const pendingDoc = sessionStorage.getItem('pending_document_id') ?? ''
      const pendingConsent = sessionStorage.getItem('pending_consent') ?? 'Sí'

      const data: Record<string, unknown> = {
        consentimiento: pendingConsent,
        document_id: pendingDoc,
        name: pendingName,
        nationality: form.nationality,
        birthdate: form.birthdate,
        devices: devices.length,
        tech_time: form.tech_time,
        socio_stratum: form.socio_stratum,
        ai_knowledge: form.ai_knowledge ?? 3,
        ai_trust_epistemic: form.ai_trust_epistemic ?? 3,
        ai_trust_social: form.ai_trust_social ?? 3,
        human_trust_epistemic: form.human_trust_epistemic ?? 3,
        human_trust_social: form.human_trust_social ?? 3,
      }
      allLikertKeys.forEach(k => { data[k] = form[k] })

      const participantId = await saveQuestionnaireData(data)
      sessionStorage.setItem('participant_id', participantId)
      sessionStorage.setItem('participant_name', pendingName)
      sessionStorage.setItem('document_id', pendingDoc)
      router.push('/experiment')
    } catch (e) {
      setError('Error al guardar los datos. Intenta de nuevo.')
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-body focus:outline-none focus:border-sabana-blue focus:ring-2 focus:ring-sabana-blue/10 transition-all bg-white"
  const selectClass = `${inputClass} select`

  return (
    <div className="min-h-screen bg-[#f7f8fc]">
      {/* Sticky progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-sabana-blue shadow-md">
        <div className="flex items-center px-4 md:px-8 py-3 gap-4">
          <span className="text-white text-xs font-body opacity-80 whitespace-nowrap">Cuestionario</span>
          <div className="flex-1 bg-white/20 rounded-full h-1.5">
            <div
              className="bg-white rounded-full h-1.5 progress-bar"
              style={{ width: `${scrollProgress}%` }}
            />
          </div>
          <span className="text-white text-xs font-body opacity-80 whitespace-nowrap">{Math.round(scrollProgress)}%</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-20 pb-16">
        {/* Header */}
        <div className="text-center mb-10 fade-in">
          <h1 className="text-2xl md:text-3xl font-heading text-sabana-blue mb-2">Cuestionario</h1>
          <p className="text-gray-500 font-body text-sm">Responde con la mayor fidelidad posible a tu situación</p>
        </div>

        {/* ── Sociodemographic data ── */}
        <div className="card p-6 mb-6 fade-in">
          <SectionTitle title="Datos sociodemográficos" />

          <div className="mb-4">
            <label className="block text-sm font-body font-medium text-gray-700 mb-1.5">Nacionalidad</label>
            <input type="text" className={inputClass} placeholder="Ej: Colombiana"
              value={(form.nationality as string) ?? ''}
              onChange={e => setField('nationality', e.target.value)} />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-body font-medium text-gray-700 mb-1.5">Fecha de nacimiento</label>
            <input type="date" className={inputClass}
              value={(form.birthdate as string) ?? ''}
              onChange={e => setField('birthdate', e.target.value)} />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-body font-medium text-gray-700 mb-2">
              ¿Qué dispositivos tecnológicos tienen en casa?
            </label>
            <div className="flex flex-wrap gap-2">
              {SOCIO_DEVICES.map(d => (
                <button key={d} type="button" onClick={() => toggleDevice(d)}
                  className={`px-3 py-1.5 rounded-full text-xs font-body border-2 transition-all ${
                    devices.includes(d)
                      ? 'bg-sabana-blue border-sabana-blue text-white'
                      : 'border-gray-200 text-gray-600 hover:border-sabana-blue/40'
                  }`}>
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-body font-medium text-gray-700 mb-1.5">
              ¿Cuánto tiempo suele pasar utilizando tecnología en el día?
            </label>
            <select className={selectClass}
              value={(form.tech_time as string) ?? ''}
              onChange={e => setField('tech_time', e.target.value)}>
              <option value="">Selecciona una opción</option>
              {['1 a 2 horas', '3 a 4 horas', '5 a 7 horas', '8 horas o más', 'No sabe'].map(o => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>

          <div className="mb-0">
            <label className="block text-sm font-body font-medium text-gray-700 mb-1.5">
              Estrato socioeconómico de su vivienda
            </label>
            <select className={selectClass}
              value={(form.socio_stratum as string) ?? ''}
              onChange={e => setField('socio_stratum', e.target.value)}>
              <option value="">Selecciona una opción</option>
              {['1', '2', '3', '4', '5', '6', '7', 'Sin estrato'].map(o => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>
        </div>

        {/* ── Trust & knowledge scales ── */}
        <div className="card p-6 mb-6">
          <SectionTitle title="Confianza y conocimiento" subtitle="1 = poco o nada · 5 = mucho" />
          {[
            { key: 'ai_knowledge', label: '¿Qué tanto conocimiento tienes acerca de Inteligencia Artificial?' },
            { key: 'ai_trust_epistemic', label: '¿Qué tanto confías en que la IA puede darte buenas respuestas de información o conocimientos?' },
            { key: 'ai_trust_social', label: '¿Qué tanto confías en que la IA puede ayudarte en situaciones personales o emocionales?' },
            { key: 'human_trust_epistemic', label: '¿Qué tanto confías en que otras personas pueden darte buenas respuestas de información o conocimientos?' },
            { key: 'human_trust_social', label: '¿Qué tanto confías en que otras personas pueden ayudarte en situaciones personales o emocionales?' },
          ].map(q => (
            <div key={q.key} className="mb-4">
              <p className="text-sm font-body text-gray-700 mb-2">{q.label}</p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(v => (
                  <button key={v} type="button"
                    onClick={() => setField(q.key, v)}
                    className={`flex-1 py-2 rounded-xl text-sm font-body font-semibold border-2 transition-all ${
                      form[q.key] === v
                        ? 'bg-sabana-blue border-sabana-blue text-white'
                        : 'border-gray-200 text-gray-500 hover:border-sabana-blue/40'
                    }`}>
                    {v}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ── Likert instruction ── */}
        <div className="bg-sabana-blue text-white rounded-2xl p-4 mb-6">
          <p className="text-sm font-body leading-relaxed">
            <strong>Instrucciones:</strong> Indica qué tan cierta consideras que es cada afirmación.<br />
            <span className="opacity-80">1 = Falso y estoy muy seguro/a · 5 = Verdadero y estoy muy seguro/a</span>
          </p>
        </div>

        {/* ── RUI Section ── */}
        <div className="card p-6 mb-6">
          <SectionTitle title="¿Qué es IA? — RUI" />
          {RUI_QUESTIONS.map((q, i) => (
            <LikertQuestion key={i} index={i + 1} question={q} fieldKey={`rui_${i + 1}`}
              value={form[`rui_${i + 1}`] as number | undefined}
              onChange={setField} />
          ))}
        </div>

        {/* ── GN Section ── */}
        <div className="card p-6 mb-6">
          <SectionTitle title="¿Qué es IA? — GN" />
          {GN_QUESTIONS.map((q, i) => (
            <LikertQuestion key={i} index={i + 1} question={q} fieldKey={`gn_${i + 1}`}
              value={form[`gn_${i + 1}`] as number | undefined}
              onChange={setField} />
          ))}
        </div>

        {/* ── What can AI do ── */}
        <div className="card p-6 mb-6">
          <SectionTitle title="¿Qué puede hacer la IA?" />
          {WHAT_CAN_AI_DO.map((q, i) => (
            <LikertQuestion key={i} index={i + 1} question={q} fieldKey={`what_can_ai_do_${i + 1}`}
              value={form[`what_can_ai_do_${i + 1}`] as number | undefined}
              onChange={setField} />
          ))}
        </div>

        {/* ── How AI works ── */}
        <div className="card p-6 mb-6">
          <SectionTitle title="¿Cómo funciona la IA?" />
          {HOW_AI_WORKS.map((q, i) => (
            <LikertQuestion key={i} index={i + 1} question={q} fieldKey={`how_does_ai_work_${i + 1}`}
              value={form[`how_does_ai_work_${i + 1}`] as number | undefined}
              onChange={setField} />
          ))}
        </div>

        {/* ── How AI should be used ── */}
        <div className="card p-6 mb-6">
          <SectionTitle title="¿Cómo se debería utilizar la IA?" />
          {HOW_AI_SHOULD_BE_USED.map((q, i) => (
            <LikertQuestion key={i} index={i + 1} question={q} fieldKey={`how_should_ai_be_used_${i + 1}`}
              value={form[`how_should_ai_be_used_${i + 1}`] as number | undefined}
              onChange={setField} />
          ))}
        </div>

        {/* ── Submit ── */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm font-body">
            {error}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-4 rounded-2xl font-body font-semibold text-white text-base transition-all duration-200 disabled:opacity-60"
          style={{ background: loading ? '#94a3b8' : 'linear-gradient(135deg, #182a67, #2a4199)' }}
        >
          {loading ? 'Guardando respuestas...' : 'Continuar al experimento →'}
        </button>
      </div>
    </div>
  )
}
