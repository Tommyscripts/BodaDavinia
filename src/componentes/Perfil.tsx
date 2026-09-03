import { useState } from 'react'
import { changePassword } from '../services/api'

type Props = {
  onClose: () => void
  onLogout: () => void
}

function Perfil({ onClose, onLogout }: Props) {
  const stored = localStorage.getItem('auth_user')
  const user = stored ? JSON.parse(stored) : { email: '' }
  const [editing, setEditing] = useState(false)
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      await changePassword(password)
      setMessage('Contraseña actualizada')
      setPassword('')
      setEditing(false)
    } catch (err: any) {
      setMessage(err?.message || 'Error actualizando contraseña')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h3 className="mb-4 text-xl font-semibold text-[#8f6d35]">Mi perfil</h3>

      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700">Correo</label>
        <div className="mt-1">{user.email || '-'}</div>
      </div>

      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700">Contraseña</label>
        <div className="mt-1 flex items-center gap-2">
          <span className="select-all">••••••••</span>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="rounded border px-3 py-1 text-sm"
          >
            Modificar
          </button>
        </div>
      </div>

      {editing && (
        <form onSubmit={handleChangePassword} className="mb-3">
          <div className="mb-2">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nueva contraseña"
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
              {loading ? 'Guardando...' : 'Guardar'}
            </button>

            <button
              type="button"
              onClick={() => {
                setEditing(false)
                setPassword('')
              }}
              className="rounded border px-3 py-2"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {message && <p className="mt-3 text-sm text-green-600">{message}</p>}

      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={onLogout}
          className="rounded border px-3 py-2 text-sm text-red-600"
        >
          Cerrar sesión
        </button>

        <button
          type="button"
          onClick={onClose}
          className="rounded bg-[#eee] px-3 py-2 text-sm"
        >
          Cerrar
        </button>
      </div>
    </div>
  )
}

export default Perfil
