import express from 'express'
import payload from 'payload'
import 'dotenv/config'

const app = express()

const start = async () => {
  await payload.init({
    secret: process.env.PAYLOAD_SECRET!,
    express: app,
    onInit: () => {
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`)
    },
  })

  app.listen(Number(process.env.PORT) || 3001, () => {
    console.log(`CMS running on port ${process.env.PORT || 3001}`)
  })
}

start()
