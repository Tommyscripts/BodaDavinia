import { useState } from 'react'
import { uploadImage, API_BASE } from '../services/api'

type Props = {
  multiple?: boolean
  onUploaded?: (data: any) => void
  showActions?: boolean
}

function SubirImagenes({ multiple = true, onUploaded, showActions = true }: Props) {
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

        // Determine a stable filename (prefer backend-provided filename)
        const backendFilename = res?.image?.filename || (res?.image?.path ? String(res.image.path).split('/').pop() : undefined)
        // Prefer fully qualified URL from backend, otherwise construct from API_BASE + /uploads/<filename>
        const maybeUrlFromBackend = res?.image?.url || res?.image?.secure_url
        const imageUrl = maybeUrlFromBackend || (backendFilename ? `${API_BASE.replace(/\/$/, '')}/uploads/${encodeURIComponent(backendFilename)}` : undefined)

        // For immediate preview use object URL, but persist the public URL when available
        const preview = imageUrl || URL.createObjectURL(file)

        results.push({ fileName: file.name, response: res, preview, filename: backendFilename, url: imageUrl })
      }

      setFiles([])
      onUploaded?.(results)

      // persist uploaded images locally so they survive refresh while backend listing is not available
      try {
        const existing = typeof window !== 'undefined' ? localStorage.getItem('uploaded_images') : null
        const parsed = existing ? JSON.parse(existing) : []
        const added = results.map((r: any, i: number) => ({ id: r.response?.image?.filename || r.filename || `user-${Date.now()}-${i}`, src: r.url || r.preview, alt: r.fileName }))
        // avoid duplicates by id
        const existingIds = new Set(parsed.map((p: any) => p.id))
        const uniqueAdded = added.filter((a: any) => !existingIds.has(a.id))
        const merged = [...uniqueAdded, ...parsed]
        localStorage.setItem('uploaded_images', JSON.stringify(merged))
      } catch (e) {
        // ignore storage errors
      }
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
        {showActions && (
          <>
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
          </>
        )}
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </div>
  )
}

export default SubirImagenes
