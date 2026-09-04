// If VITE_API_BASE is set, use it; otherwise default to the deployed backend (HTTPS).
const DEFAULT_API = 'https://bodadaviniabackend-production.up.railway.app'
export const API_BASE = (import.meta.env.VITE_API_BASE as string) || DEFAULT_API

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
    // If the backend doesn't implement a listing endpoint, return an empty array
    if (res.status === 404) return []
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

export async function changePassword(
  password: string,
  changePath = '/api/auth/change-password'
) {
  const token = localStorage.getItem('auth_token')
  const res = await fetch(fullUrl(changePath), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ password }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || res.statusText)
  }

  return res.json()
}

export async function deleteImage(
  filename: string,
  deletePathBase = '/api/images'
) {
  if (!filename) throw new Error('filename required')
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
  const encoded = encodeURIComponent(filename)
  const res = await fetch(fullUrl(`${deletePathBase}/${encoded}`), {
    method: 'DELETE',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })

  if (!res.ok) {
    const text = await res.text()
    const err: any = new Error(text || res.statusText)
    err.status = res.status
    throw err
  }

  return res.json()
}
