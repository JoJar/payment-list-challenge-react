import path from 'path'
import express from 'express'
import cors from 'cors'
import aspireRoutes from './telemetry'

const app = express()
const port = Number(process.env.PORT || 3000)

app.use(cors())
app.use(express.json({ limit: '5mb' }))

app.use((req, _res, next) => {
  console.log(`${req.method} ${req.path}`)
  next()
})

// health endpoint
app.get('/health', (_req, res) => res.json({ status: 'healthy' }))

// forward telemetry requests to Aspire
app.use('/telemetry', aspireRoutes)

const distDir = path.resolve(process.cwd(), 'dist')

// serve static files (including dist/mockServiceWorker.js)
app.use(express.static(distDir))

// SPA fallback: only for GET navigations and NOT for API/proxy
app.use((req, res, next) => {
  // if (req.method !== 'GET') return next()
  if (req.path.startsWith('/api')) return next()
  if (req.accepts && req.accepts('html')) {
    return res.sendFile(path.join(distDir, 'index.html'))
  }
  next()
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})