'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { loginUser, getAllData } from '@/lib/data'
import type { Control, Modelo, Reemplazo, Usuario } from '@/lib/types'

// ──────────────────────────────────────────────
// HELPERS
// ──────────────────────────────────────────────
function imgPath(id: string) {
  return `/img/${id}.png`
}

function getControl(controles: Control[], id: string): Control | undefined {
  return controles.find(c => c.id === String(id))
}

function getReemplazosIds(reemplazos: Reemplazo[], id: string): string[] {
  return reemplazos.find(r => r.id === String(id))?.reemplazos || []
}

// ──────────────────────────────────────────────
// SUB-COMPONENTS
// ──────────────────────────────────────────────
function ControlImg({ id, size = 70, className = '' }: { id: string; size?: number; className?: string }) {
  const [err, setErr] = useState(false)
  return err
    ? <div style={{ width: size, height: size * 1.3, background: 'var(--surface2)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: 'var(--muted)', flexShrink: 0 }}>sin img</div>
    : <img src={imgPath(id)} alt={id} width={size} style={{ objectFit: 'contain', flexShrink: 0 }} className={className} onError={() => setErr(true)} />
}

function WaFloat() {
  return (
    <a
      href="https://wa.me/543415851441?text=Hola%2C%20necesito%20soporte%20con%20CONTROLADOS"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: 'fixed', bottom: '1.5rem', right: '1.5rem',
        width: 52, height: 52, background: '#25d366', borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 4px 20px rgba(37,211,102,0.4)', zIndex: 500,
        textDecoration: 'none', transition: 'transform 0.2s',
      }}
      onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.1)')}
      onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    </a>
  )
}

// ──────────────────────────────────────────────
// MODAL
// ──────────────────────────────────────────────
function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  if (!open) return null
  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000, padding: '1rem', backdropFilter: 'blur(4px)',
        animation: 'fadeIn 0.2s ease',
      }}
    >
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 24, maxWidth: 480, width: '100%', maxHeight: '85vh',
        overflowY: 'auto', padding: '1.8rem', position: 'relative',
        animation: 'modalIn 0.25s ease',
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '1rem', right: '1rem',
            background: 'var(--surface2)', border: '1px solid var(--border)',
            borderRadius: 8, color: 'var(--text)', width: 32, height: 32,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', fontSize: '1.1rem',
          }}
        >✕</button>
        {children}
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes modalIn { from { transform:scale(0.93) translateY(20px);opacity:0 } to { transform:none;opacity:1 } }
      `}</style>
    </div>
  )
}

// ──────────────────────────────────────────────
// PAGES
// ──────────────────────────────────────────────

// LOGIN
function LoginPage({ onLogin }: { onLogin: (u: Usuario) => void }) {
  const [dni, setDni] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    if (!dni.trim()) return
    setLoading(true)
    setError('')
    const user = await loginUser(dni.trim())
    setLoading(false)
    if (user) {
      onLogin(user)
    } else {
      setError('DNI no registrado. ¿Querés registrarte?')
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'radial-gradient(ellipse at 60% 0%, #1a1040 0%, var(--bg) 70%)',
      padding: '2rem',
    }}>
      <div style={{ width: '100%', maxWidth: 400, textAlign: 'center' }}>
        {/* Logo */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>📡</div>
          <div style={{
            fontFamily: "'Bebas Neue', sans-serif", fontSize: '3.8rem', letterSpacing: '0.12em',
            background: 'linear-gradient(135deg, #a78bfa, #6c63ff, #818cf8)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1,
          }}>CONTROLADOS</div>
          <div style={{ color: 'var(--muted)', fontSize: '0.85rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: '0.4rem' }}>
            Tu catálogo de controles
          </div>
        </div>

        {/* Card */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, padding: '2rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--muted)', marginBottom: '1.5rem', letterSpacing: '0.05em' }}>
            Ingresá con tu DNI
          </h2>
          <input
            type="number"
            value={dni}
            onChange={e => setDni(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder="Ej: 36004936"
            style={{
              width: '100%', padding: '0.9rem 1.2rem',
              background: 'var(--surface2)', border: '1.5px solid var(--border)',
              borderRadius: 12, color: 'var(--text)', fontSize: '1.1rem',
              letterSpacing: '0.1em', outline: 'none', marginBottom: '0.5rem',
            }}
          />
          {error && <p style={{ color: 'var(--accent2)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>{error}</p>}
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: '100%', padding: '0.95rem',
              background: 'linear-gradient(135deg, #6c63ff, #818cf8)',
              border: 'none', borderRadius: 12, color: '#fff',
              fontSize: '1rem', fontWeight: 600, letterSpacing: '0.05em',
              marginTop: '0.5rem', opacity: loading ? 0.7 : 1,
            }}
          >{loading ? 'Verificando…' : 'Ingresar →'}</button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.2rem 0', color: 'var(--muted)', fontSize: '0.8rem' }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            o
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>

          <a
            href="https://wa.me/543415851441?text=Hola%2C%20quiero%20registrarme%20en%20CONTROLADOS"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
              width: '100%', padding: '0.85rem',
              border: '1.5px solid #25d366', borderRadius: 12, color: '#25d366',
              fontSize: '0.95rem', fontWeight: 500, textDecoration: 'none',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Quiero registrarme
          </a>
        </div>
      </div>
    </div>
  )
}

// HOME
function HomePage({ user, onNav, onLogout }: { user: Usuario; onNav: (p: string) => void; onLogout: () => void }) {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'radial-gradient(ellipse at 30% 20%, #110e2b 0%, var(--bg) 60%)',
      padding: '2rem',
    }}>
      <div style={{ width: '100%', maxWidth: 500 }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.2rem', letterSpacing: '0.12em',
            background: 'linear-gradient(135deg, #a78bfa, #6c63ff)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.8rem',
          }}>CONTROLADOS</div>
          <div style={{ color: 'var(--muted)', fontSize: '1.05rem' }}>
            Hola, <strong style={{ color: 'var(--text)', fontWeight: 600, fontSize: '1.15rem' }}>{user.name}</strong> 👋
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 600, marginTop: '0.3rem' }}>¿Qué hacemos hoy?</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {[
            { icon: '🔍', title: 'Buscar Controles', desc: 'Por modelo de TV', page: 'buscar', color: '#6c63ff', shadow: 'rgba(108,99,255,0.2)' },
            { icon: '🔄', title: 'Buscar Reemplazo', desc: 'Ver compatibles', page: 'reemplazos', color: '#2dd4a0', shadow: 'rgba(45,212,160,0.2)' },
          ].map(card => (
            <div
              key={card.page}
              onClick={() => onNav(card.page)}
              style={{
                background: 'var(--surface)', border: `1.5px solid var(--border)`,
                borderRadius: 20, padding: '2rem 1.5rem', cursor: 'pointer',
                textAlign: 'center', transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLDivElement
                el.style.borderColor = card.color
                el.style.boxShadow = `0 8px 30px ${card.shadow}`
                el.style.transform = 'translateY(-3px)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLDivElement
                el.style.borderColor = 'var(--border)'
                el.style.boxShadow = 'none'
                el.style.transform = 'none'
              }}
            >
              <div style={{ fontSize: '2.8rem', marginBottom: '0.8rem' }}>{card.icon}</div>
              <div style={{ fontWeight: 600, fontSize: '1rem', lineHeight: 1.3 }}>{card.title}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: '0.4rem' }}>{card.desc}</div>
            </div>
          ))}
        </div>

        <button
          onClick={onLogout}
          style={{
            marginTop: '1.5rem', width: '100%', padding: '0.7rem',
            background: 'transparent', border: '1px solid var(--border)',
            borderRadius: 10, color: 'var(--muted)', fontSize: '0.85rem',
          }}
        >Cerrar sesión</button>
      </div>
      <WaFloat />
    </div>
  )
}

// BUSCAR CONTROLES
function BuscarPage({
  controles, modelos, reemplazos, onBack,
}: {
  controles: Control[]; modelos: Modelo[]; reemplazos: Reemplazo[]; onBack: () => void
}) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<Modelo[]>([])
  const [selected, setSelected] = useState<Modelo | null>(null)
  const [zoomCtrl, setZoomCtrl] = useState<Control | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleInput(val: string) {
    setQuery(val)
    setSelected(null)
    if (val.length < 4) { setSuggestions([]); return }
    const q = val.toLowerCase()
    setSuggestions(modelos.filter(m => m.modelo.toLowerCase().includes(q)))
  }

  function selectModelo(m: Modelo) {
    setQuery(m.modelo)
    setSuggestions([])
    setSelected(m)
  }

  const mainCtrl = selected ? getControl(controles, selected.equivalencia) : null
  const rIds = mainCtrl ? getReemplazosIds(reemplazos, mainCtrl.id) : []

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '1.2rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', position: 'sticky', top: 0, zIndex: 10 }}>
        <button onClick={onBack} style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text)', padding: '0.5rem 1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>← Volver</button>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.5rem', letterSpacing: '0.08em', background: 'linear-gradient(135deg, #a78bfa, #6c63ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Buscar Controles</div>
      </div>

      <div style={{ padding: '1.5rem', flex: 1, maxWidth: 640, margin: '0 auto', width: '100%' }}>
        {/* Search */}
        <div style={{ position: 'relative', marginBottom: '2rem' }}>
          <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', pointerEvents: 'none' }}>🔍</span>
          <input
            ref={inputRef}
            value={query}
            onChange={e => handleInput(e.target.value)}
            placeholder="Ingresá el modelo de tu TV…"
            style={{
              width: '100%', padding: '1rem 1.2rem 1rem 3rem',
              background: 'var(--surface)', border: '1.5px solid var(--border)',
              borderRadius: 14, color: 'var(--text)', fontSize: '1rem', outline: 'none',
            }}
          />
          {suggestions.length > 0 && (
            <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', zIndex: 100, boxShadow: '0 16px 40px rgba(0,0,0,0.5)' }}>
              {suggestions.map(m => {
                const ctrl = getControl(controles, m.equivalencia)
                return (
                  <div key={m.modelo} onClick={() => selectModelo(m)} style={{ padding: '0.8rem 1.2rem', cursor: 'pointer', borderBottom: '1px solid var(--border)' }}
                    onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = 'var(--surface2)'}
                    onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}
                  >
                    <div style={{ fontWeight: 600 }}>{m.modelo}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>Control: {ctrl?.nombre || m.equivalencia}</div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Result */}
        {query.length >= 4 && !selected && suggestions.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--muted)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
            <p>No encontramos resultados para <strong style={{ color: 'var(--text)' }}>"{query}"</strong>.<br />Verificá el modelo e intentá de nuevo.</p>
          </div>
        )}

        {selected && mainCtrl && (
          <>
            <div style={{ fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '0.8rem', fontWeight: 600 }}>
              Control compatible con {selected.modelo}
            </div>
            {/* Main control card */}
            <div
              onClick={() => setZoomCtrl(mainCtrl)}
              style={{ background: 'var(--card-bg)', border: '1.5px solid var(--accent)', borderRadius: 18, padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 0 30px rgba(108,99,255,0.12)', cursor: 'pointer' }}
            >
              <ControlImg id={mainCtrl.id} size={80} />
              <div>
                <div style={{ fontSize: '1.3rem', fontWeight: 700, fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.06em' }}>{mainCtrl.nombre}</div>
                <div style={{ display: 'inline-block', background: 'rgba(108,99,255,0.15)', border: '1px solid rgba(108,99,255,0.3)', color: 'var(--accent)', fontSize: '0.78rem', padding: '0.2rem 0.6rem', borderRadius: 6, marginTop: '0.4rem' }}>ID: {mainCtrl.id}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.5rem' }}>Tap para ampliar 🔎</div>
              </div>
            </div>

            <div style={{ fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '0.8rem', fontWeight: 600 }}>Reemplazos</div>
            {rIds.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--muted)', background: 'var(--surface)', borderRadius: 12 }}>
                😔 Aún no tenemos reemplazos disponibles para este control.
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                {rIds.map(rid => {
                  const rc = getControl(controles, rid)
                  if (!rc) return null
                  return (
                    <div key={rid} onClick={() => setZoomCtrl(rc)}
                      style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 14, padding: '1rem', textAlign: 'center', cursor: 'pointer' }}
                      onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = 'var(--green)'; el.style.transform = 'translateY(-2px)' }}
                      onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = 'var(--border)'; el.style.transform = 'none' }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.6rem' }}>
                        <ControlImg id={rc.id} size={55} />
                      </div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{rc.nombre}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>ID: {rc.id}</div>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* Zoom modal */}
      <Modal open={!!zoomCtrl} onClose={() => setZoomCtrl(null)}>
        {zoomCtrl && (
          <div style={{ textAlign: 'center', paddingTop: '1rem' }}>
            <ControlImg id={zoomCtrl.id} size={180} />
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2rem', letterSpacing: '0.06em', marginTop: '1rem' }}>{zoomCtrl.nombre}</div>
            <div style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>ID: {zoomCtrl.id}</div>
          </div>
        )}
      </Modal>
      <WaFloat />
    </div>
  )
}

// BUSCAR REEMPLAZO
function ReemplazosPage({
  controles, reemplazos, onBack,
}: {
  controles: Control[]; reemplazos: Reemplazo[]; onBack: () => void
}) {
  const [selectedCtrl, setSelectedCtrl] = useState<Control | null>(null)

  const rIds = selectedCtrl ? getReemplazosIds(reemplazos, selectedCtrl.id) : []

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '1.2rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', position: 'sticky', top: 0, zIndex: 10 }}>
        <button onClick={onBack} style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text)', padding: '0.5rem 1rem', fontSize: '0.85rem' }}>← Volver</button>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.5rem', letterSpacing: '0.08em', background: 'linear-gradient(135deg, #a78bfa, #6c63ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Buscar Reemplazo</div>
      </div>

      <div style={{ padding: '1.5rem', flex: 1, maxWidth: 700, margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '1.2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
          Presioná un control para ver su reemplazo disponible
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
          {controles.map(ctrl => (
            <div key={ctrl.id} onClick={() => setSelectedCtrl(ctrl)}
              style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 16, padding: '1.2rem 1rem', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = 'var(--accent)'; el.style.transform = 'translateY(-2px)'; el.style.boxShadow = '0 8px 24px rgba(108,99,255,0.18)' }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = 'var(--border)'; el.style.transform = 'none'; el.style.boxShadow = 'none' }}
            >
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 80, marginBottom: '0.7rem' }}>
                <ControlImg id={ctrl.id} size={70} />
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>{ctrl.nombre}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.2rem' }}>ID: {ctrl.id}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal reemplazos */}
      <Modal open={!!selectedCtrl} onClose={() => setSelectedCtrl(null)}>
        {selectedCtrl && (
          <>
            <div style={{ textAlign: 'center', marginBottom: '1.2rem', paddingTop: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.8rem' }}>
                <ControlImg id={selectedCtrl.id} size={110} />
              </div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2rem', letterSpacing: '0.06em' }}>{selectedCtrl.nombre}</div>
              <div style={{ color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '1.5rem' }}>ID: {selectedCtrl.id}</div>
            </div>
            <div style={{ fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--accent)', fontWeight: 600, marginBottom: '0.8rem' }}>Reemplazos disponibles</div>
            {rIds.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--muted)', background: 'var(--surface2)', borderRadius: 12, fontSize: '0.9rem' }}>
                😔 Aún no tenemos reemplazos disponibles para este control.
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.7rem' }}>
                {rIds.map(rid => {
                  const rc = getControl(controles, rid)
                  if (!rc) return null
                  return (
                    <div key={rid} style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 12, padding: '0.9rem', textAlign: 'center' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
                        <ControlImg id={rc.id} size={50} />
                      </div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{rc.nombre}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>ID: {rc.id}</div>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}
      </Modal>
      <WaFloat />
    </div>
  )
}

// ──────────────────────────────────────────────
// ROOT APP
// ──────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState<Usuario | null>(null)
  const [page, setPage] = useState<'home' | 'buscar' | 'reemplazos'>('home')
  const [controles, setControles] = useState<Control[]>([])
  const [modelos, setModelos] = useState<Modelo[]>([])
  const [reemplazos, setReemplazos] = useState<Reemplazo[]>([])
  const [dataLoaded, setDataLoaded] = useState(false)

  useEffect(() => {
    // Load persisted session
    const saved = localStorage.getItem('controlados_user')
    if (saved) setUser(JSON.parse(saved))
    // Load all data once
    getAllData().then(({ controles, modelos, reemplazos }) => {
      setControles(controles)
      setModelos(modelos)
      // Parse reemplazos: field stored as "522,2553" string
      const parsed = reemplazos.map(r => ({
        id: String(r.id),
        reemplazos: String(r.reemplazos).split(',').map(s => s.trim()).filter(Boolean),
      }))
      setReemplazos(parsed)
      setDataLoaded(true)
    })
  }, [])

  function handleLogin(u: Usuario) {
    setUser(u)
    localStorage.setItem('controlados_user', JSON.stringify(u))
    setPage('home')
  }

  function handleLogout() {
    setUser(null)
    localStorage.removeItem('controlados_user')
    setPage('home')
  }

  if (!user) return <LoginPage onLogin={handleLogin} />
  if (!dataLoaded) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem', color: 'var(--muted)' }}>
      <div style={{ fontSize: '2rem' }}>📡</div>
      <div>Cargando catálogo…</div>
    </div>
  )

  if (page === 'buscar') return <BuscarPage controles={controles} modelos={modelos} reemplazos={reemplazos} onBack={() => setPage('home')} />
  if (page === 'reemplazos') return <ReemplazosPage controles={controles} reemplazos={reemplazos} onBack={() => setPage('home')} />
  return <HomePage user={user} onNav={p => setPage(p as any)} onLogout={handleLogout} />
}
