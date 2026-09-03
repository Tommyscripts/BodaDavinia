const express = require('express')
const cors = require('cors')
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const UPLOAD_DIR = path.join(__dirname, 'uploads')
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true })

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const name = `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`
    cb(null, name)
  }
})

const upload = multer({ storage })

const app = express()
app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(UPLOAD_DIR))

// simple in-memory images list
let images = []

app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file' })

  const url = `/uploads/${req.file.filename}`
  const img = { id: `${Date.now()}`, url, alt: req.file.originalname }
  images.unshift(img)

  res.json(img)
})

app.get('/api/images', (req, res) => {
  res.json(images)
})

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body
  // demo: acepta cualquier credencial y devuelve token falso
  if (!email || !password) return res.status(400).json({ message: 'Missing' })
  return res.json({ token: 'demo-token', user: { email } })
})

app.post('/api/auth/change-password', (req, res) => {
  const { password } = req.body
  if (!password) return res.status(400).json({ message: 'Missing password' })
  // demo: no almacenamos realmente la contraseña, solo aceptamos la petición
  return res.json({ ok: true })
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log('Mock backend listening on', port))
