// If VITE_API_BASE is set, use it; otherwise use relative paths so Vite dev proxy works.
export const API_BASE = (import.meta.env.VITE_API_BASE as string) || ''

function fullUrl(path: string) {
  if (!path) return API_BASE || path
  if (path.startsWith('http')) return path

  if (API_BASE) {
    const base = API_BASE.replace(/\/$/, '')
    return `${base}${path.startsWith('/') ? '' : '/'}${path}`
  }

  // Return relative path (e.g. `/api/upload`) to allow Vite proxy to handle it
  return path
}

export async function uploadImage(file: File, uploadPath = '/api/upload', fieldName = 'file') {
  const fd = new FormData()
  fd.append(fieldName, file)

  const res = await fetch(fullUrl(uploadPath), {
    method: 'POST',
    body: fd,
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || res.statusText)
  }

  return res.json()
}

export async function fetchImages(imagesPath = '/api/images') {
  const res = await fetch(fullUrl(imagesPath))
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || res.statusText)
  }

  return res.json()
}

export async function login(
  credentials: { email: string; password: string },
  loginPath = '/api/auth/login'
) {
  const res = await fetch(fullUrl(loginPath), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  })

  const json = await res.json()
  if (!res.ok) throw new Error(json?.message || res.statusText)
  return json
}
