import { useState } from 'react'
import { uploadImage } from '../services/api'

type Props = {
  multiple?: boolean
  onUploaded?: (data: any) => void
}

function SubirImagenes({ multiple = true, onUploaded }: Props) {
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState<Record<string, number>>({})

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files
    if (!selected) return
    setFiles(Array.from(selected))
    setError(null)
  }

  const handleUpload = async () => {
    if (files.length === 0) return
    setUploading(true)
    setError(null)

    try {
      const results = []
      for (const file of files) {
        // track fake progress locally (since fetch doesn't provide progress)
        setProgress((p) => ({ ...p, [file.name]: 0 }))

        // naive interval to show progress UI — removed when done
        const interval = setInterval(() => {
          setProgress((p) => {
            const cur = p[file.name] ?? 0
            const next = Math.min(90, cur + Math.floor(Math.random() * 20) + 5)
            return { ...p, [file.name]: next }
          })
        }, 250)

        const res = await uploadImage(file)

        clearInterval(interval)
        setProgress((p) => ({ ...p, [file.name]: 100 }))
        results.push(res)
      }

      setFiles([])
      onUploaded?.(results)
    } catch (err: any) {
      setError(err?.message || 'Error al subir las imágenes')
    } finally {
      setUploading(false)
      setTimeout(() => setProgress({}), 700)
    }
  }

  return (
    <div className="max-w-xl">
      <label className="mb-2 block text-sm font-medium text-gray-700">Seleccionar imágenes</label>
      <input
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={handleFileChange}
        className="mb-3"
      />

      {files.length > 0 && (
        <div className="mb-3 space-y-2">
          {files.map((f) => (
            <div key={f.name} className="flex items-center justify-between gap-3">
              <div className="truncate text-sm">{f.name}</div>
              <div className="w-40">
                <div className="h-2 w-full rounded-full bg-gray-200">
                  <div
                    style={{ width: `${progress[f.name] ?? 0}%` }}
                    className="h-2 rounded-full bg-emerald-500 transition-all"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleUpload}
          disabled={uploading || files.length === 0}
          className="rounded bg-[#c59c54] px-4 py-2 text-white disabled:opacity-50"
        >
          {uploading ? 'Subiendo...' : 'Subir'}
        </button>

        <button
          type="button"
          onClick={() => setFiles([])}
          disabled={uploading}
          className="rounded border px-3 py-2"
        >
          Limpiar
        </button>
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </div>
  )
}

export default SubirImagenes
