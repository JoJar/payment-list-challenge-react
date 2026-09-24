import express from 'express'
import axios from 'axios'

const aspireRouter = express.Router()

// Default to Aspire's local OTLP/HTTP traces endpoint
const ASPIRE_TRACE_URL = 'http://localhost:18890/v1/traces'
const ASPIRE_LOGS_URL = 'http://localhost:18890/v1/logs'
const ASPIRE_KEY = process.env.ASPIRE_API_KEY

aspireRouter.post('/traces', async (req, res) => {
  try {
    await axios.post(ASPIRE_TRACE_URL, req.body, {
      headers: {
        'Content-Type': 'application/json',
        ...(ASPIRE_KEY ? { Authorization: `Bearer ${ASPIRE_KEY}` } : {})
      },
      timeout: 10000
    })
    res.status(204).end()
  } catch (err) {
    console.error('forward telemetry error', err)
    res.status(502).json({ error: 'forward failed' })
  }
})

aspireRouter.post('/logs', async (req, res) => {
  try {
    await axios.post(ASPIRE_LOGS_URL, req.body, {
      headers: {
        'Content-Type': 'application/json',
        ...(ASPIRE_KEY ? { Authorization: `Bearer ${ASPIRE_KEY}` } : {})
      },
      timeout: 10000
    })
    res.status(204).end()
  } catch (err) {
    console.error('forward telemetry error', err)
    res.status(502).json({ error: 'forward failed' })
  }
})

export default aspireRouter