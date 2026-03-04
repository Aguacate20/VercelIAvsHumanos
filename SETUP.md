# 🎓 Guía de Configuración — Estudio de Toma de Decisiones (Vercel)

## Estructura del proyecto

```
sabana-study/
├── app/
│   ├── globals.css              ← Estilos globales y fuentes
│   ├── layout.tsx               ← Layout raíz con metadatos
│   ├── page.tsx                 ← 🏠 Página de inicio (identificación + consentimiento)
│   ├── questionnaire/
│   │   └── page.tsx             ← 📋 Cuestionario completo (sociodemográfico + escala IA)
│   └── experiment/
│       └── page.tsx             ← 🧪 Experimento (intro IA → intro Humano → slider)
├── lib/
│   ├── supabase.ts              ← Cliente Supabase + funciones de guardado
│   └── situations.ts           ← Lista de situaciones y opciones Likert
├── .env.local.example           ← Plantilla de variables de entorno
├── package.json
├── next.config.mjs
├── tailwind.config.js
└── tsconfig.json
```

---

## Paso 1 — Supabase: nueva columna `document_id`

Necesitas agregar una columna nueva a tu tabla `respuestas` para soportar la búsqueda por documento.

Ejecuta esto en el **SQL Editor** de Supabase:

```sql
ALTER TABLE respuestas ADD COLUMN IF NOT EXISTS document_id TEXT;
CREATE INDEX IF NOT EXISTS idx_respuestas_document_id ON respuestas(document_id);
```

Eso es todo en Supabase. Las demás columnas ya existen.

---

## Paso 2 — Crear el repositorio en GitHub

1. Ve a github.com → **New repository**
2. Nómbralo `sabana-study` (o como prefieras), hazlo **privado**
3. No inicialices con README ni .gitignore

Luego en tu computador:

```bash
# Coloca todos los archivos del proyecto en una carpeta
cd sabana-study

# Inicializa git y sube
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/sabana-study.git
git push -u origin main
```

---

## Paso 3 — Variables de entorno (`.env.local`)

Crea un archivo `.env.local` en la raíz (copia `.env.local.example`):

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

Los valores los encuentras en Supabase → **Project Settings → API**.

> ⚠️ **Nunca subas `.env.local` a GitHub.** Ya está en `.gitignore` por defecto en Next.js.

---

## Paso 4 — Deploy en Vercel

1. Ve a **vercel.com** e inicia sesión con GitHub
2. Click en **Add New → Project**
3. Selecciona tu repositorio `sabana-study`
4. En la sección **Environment Variables**, agrega:
   - `NEXT_PUBLIC_SUPABASE_URL` → tu URL de Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` → tu Anon Key
5. Click **Deploy**

Vercel detecta automáticamente que es un proyecto Next.js.

En ~2 minutos tendrás tu URL, por ejemplo:
`https://sabana-study.vercel.app`

---

## Paso 5 — Logo de la universidad (opcional pero recomendado)

1. Descarga el logo oficial de La Sabana (fondo transparente, PNG)
2. Nómbralo `logo-sabana.png`
3. Colócalo en la carpeta `public/`
4. En `app/page.tsx` y `app/experiment/page.tsx`, reemplaza el bloque del logo:

```tsx
// Reemplaza esto:
<div className="w-10 h-10 bg-white/20 rounded-lg ...">
  <span className="text-white font-bold text-sm">US</span>
</div>

// Por esto:
<img src="/logo-sabana.png" alt="Universidad de La Sabana" className="h-10 w-auto" />
```

---

## Flujo de la aplicación

```
/ (Landing)
├── Nombre + Documento + Consentimiento
├── [Botón "Omitir cuestionario"] → busca en Supabase por document_id
│   ├── Encontrado → va directo a /experiment
│   └── No encontrado → muestra error
└── [Botón "Comenzar cuestionario"] → /questionnaire
    └── Guarda en Supabase → /experiment
        ├── Intro IA
        ├── Intro Humano
        └── Situaciones 1..31 con slider → Guarda cada respuesta → Pantalla final
```

---

## Cómo actualizar el proyecto después

Cada vez que hagas cambios localmente:

```bash
git add .
git commit -m "descripción del cambio"
git push
```

Vercel hace deploy automático en ~1 minuto.

---

## Notas técnicas

- **Estado entre páginas**: se usa `sessionStorage` (se limpia al cerrar el navegador, perfecto para un estudio)
- **Imágenes de IA y Humano**: se cargan desde GitHub raw igual que antes
- **Slider**: usa CSS nativo sin librerías externas, funciona perfecto en móvil y PC
- **Responsive**: todo está diseñado mobile-first con Tailwind CSS
- **Timer**: se mide el tiempo de respuesta por situación usando `Date.now()`
