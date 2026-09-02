export async function uploadImage(file: File, uploadUrl = '/api/upload', fieldName = 'file') {
  const fd = new FormData()
  fd.append(fieldName, file)

  const res = await fetch(uploadUrl, {
    method: 'POST',
    body: fd,
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || res.statusText)
  }

  return res.json()
}

export async function login(
  credentials: { email: string; password: string },
  loginUrl = '/api/auth/login'
) {
  const res = await fetch(loginUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  })

  const json = await res.json()
  if (!res.ok) throw new Error(json?.message || res.statusText)
  return json
}
