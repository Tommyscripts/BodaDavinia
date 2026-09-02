import { useState } from 'react'
import { login } from '../services/api'

type Props = {
  onSuccess?: (data: any) => void
}

function InicioSesion({ onSuccess }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await login({ email, password })
      // store token in localStorage for later backend calls
      if (res?.token) {
        localStorage.setItem('auth_token', res.token)
      }

      onSuccess?.(res)
    } catch (err: any) {
      setError(err?.message || 'Error iniciando sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-sm">
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700">Correo</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 w-full rounded border px-3 py-2"
        />
      </div>

      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700">Contraseña</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mt-1 w-full rounded border px-3 py-2"
        />
      </div>

      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded bg-[#8f6d35] px-4 py-2 text-white disabled:opacity-50"
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>

        <button
          type="button"
          onClick={() => {
            setEmail('')
            setPassword('')
            setError(null)
          }}
          className="rounded border px-3 py-2"
        >
          Limpiar
        </button>
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </form>
  )
}

export default InicioSesion
