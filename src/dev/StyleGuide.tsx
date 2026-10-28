import type { ReactNode } from 'react'
import { ChevronLeft, ChevronRight, CircleHelp, Menu, Play } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Feedback } from '../components/ui/Feedback'
import { InfoChip } from '../components/ui/InfoChip'

// Development-only style guide (#guia). Not part of the ODC.

const colors = [
  { name: 'ink', hex: '#1E2B4A' },
  { name: 'ink-soft', hex: '#3A4660' },
  { name: 'muted', hex: '#56627A' },
  { name: 'control', hex: '#7A869A' },
  { name: 'faint', hex: '#9AA6B8' },
  { name: 'line', hex: '#D6DEE8' },
  { name: 'track', hex: '#EEF2F1' },
  { name: 'paper', hex: '#F3F6F4' },
  { name: 'surface', hex: '#FFFFFF' },
  { name: 'data', hex: '#0F7A63' },
  { name: 'data-deep', hex: '#0B5E4C' },
  { name: 'data-soft', hex: '#DCEFE9' },
  { name: 'data-mint', hex: '#7FD1B9' },
  { name: 'signal', hex: '#E0A21B' },
  { name: 'rule', hex: '#B9CBE3' },
  { name: 'rule-strong', hex: '#9DB4D3' },
  { name: 'ledger-margin', hex: '#E7B3A5' },
  { name: 'state-1', hex: '#E4E9F0' },
  { name: 'state-2', hex: '#CFE6DE' },
  { name: 'state-3', hex: '#A9D8C8' },
  { name: 'state-4', hex: '#0F7A63' },
  { name: 'alert', hex: '#A23B2A' },
  { name: 'alert-soft', hex: '#F6E3DE' },
  { name: 'alert-deep', hex: '#8A2E20' },
]

const Section = ({ title, children }: { title: string, children: ReactNode }) => (
  <section className="flex flex-col gap-5 border-t-[1.5px] border-line pt-8">
    <h2 className="text-h2">{title}</h2>
    {children}
  </section>
)

const Sample = ({ token, children }: { token: string, children: ReactNode }) => (
  <div className="flex flex-col gap-1">
    <code className="text-caption text-muted">{token}</code>
    {children}
  </div>
)

const StyleGuide = () => (
  <main className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-10 sm:px-8">
    <header className="flex flex-col gap-2">
      <p className="text-small text-muted">Solo en desarrollo</p>
      <h1 className="text-h1">Guía de estilo</h1>
    </header>

    <Section title="Color">
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {colors.map(({ name, hex }) => (
          <li key={name} className="flex items-center gap-3">
            <span
              className="size-12 shrink-0 rounded-control border-[1.5px] border-line"
              style={{ background: `var(--color-${name})` }}
            />
            <span className="flex flex-col">
              <code className="text-small font-medium">{name}</code>
              <code className="text-caption text-muted">{hex}</code>
            </span>
          </li>
        ))}
      </ul>
    </Section>

    <Section title="Tipografía">
      <Sample token="text-display, font-display">
        <p className="font-display text-display">Del registro al análisis</p>
      </Sample>
      <Sample token="text-h1">
        <p className="font-display text-h1">¿Por qué los datos o información son muy importantes?</p>
      </Sample>
      <Sample token="text-body">
        <p className="max-w-[65ch] text-body text-ink-soft">
          La analítica de negocio transforma datos en decisiones. Pero antes de cualquier práctica hay una condición: que los datos existan, se puedan leer y sean confiables.
        </p>
      </Sample>
      <Sample token="text-small, muted">
        <p className="text-small text-muted">DANE (2025), Encuesta de Micronegocios 2024</p>
      </Sample>
      <Sample token="text-caption, muted">
        <p className="text-caption text-muted">DANE (2025), Encuesta de Micronegocios 2024</p>
      </Sample>
      <Sample token="marca, font-display italic">
        <p className="font-display text-h3 italic">Del registro al análisis</p>
      </Sample>
      <Sample token="font-hand (solo ilustraciones)">
        <p className="flex gap-8 font-hand text-h2 font-medium">
          <span>fiado don Luis</span>
          <span>caja $ 210.000</span>
        </p>
      </Sample>
    </Section>

    <Section title="Botones">
      <div className="flex flex-wrap items-center gap-4">
        <Button iconLeft={Play}>Iniciar</Button>
        <Button variant="secondary" iconLeft={CircleHelp}>Ayuda</Button>
        <Button variant="secondary" size="sm" iconLeft={ChevronLeft}>Anterior</Button>
        <Button variant="secondary" size="sm" iconLeft={Menu}>Menú</Button>
        <Button size="sm" iconRight={ChevronRight}>Siguiente</Button>
        <Button disabled>Deshabilitado</Button>
      </div>
      <div className="on-dark flex flex-wrap items-center gap-4 rounded-card bg-ink p-6">
        <Button variant="on-dark" iconLeft={Play}>Iniciar</Button>
      </div>
    </Section>

    <Section title="Chips +info">
      <div className="flex flex-wrap gap-3">
        <InfoChip label="Business Analytics" />
        <InfoChip label="¿Qué es EMICRON?" />
      </div>
    </Section>

    <Section title="Tarjeta y retroalimentación">
      <Card className="flex max-w-xl flex-col gap-4 p-6">
        <h3 className="text-h3">Tarjeta de ejemplo</h3>
        <Feedback result="correct">Tener el sistema adecuado no garantiza datos gestionados.</Feedback>
        <Feedback result="review">Tener el sistema adecuado no garantiza datos gestionados.</Feedback>
      </Card>
    </Section>
  </main>
)

export default StyleGuide
