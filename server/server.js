import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import 'dotenv/config'
import connectDB from './configs/mongodb.js'
import { clerkWebhooks } from './controllers/webhooks.js'
import educatorRouter from './routes/educatorRoutes.js'
import { clerkMiddleware } from '@clerk/express'

const app = express()

//middlewares
app.use(cors())
// app.use(clerkMiddleware())

//database connection
await connectDB()

//home route
app.get('/', (req, res) => {
    res.send("Home Route")
})

// Clerk webhook route (must use raw body parser, not express.json)
app.post('/clerk', bodyParser.raw({ type: 'application/json' }), clerkWebhooks)
app.use('/api/educator', clerkMiddleware(), express.json(), educatorRouter)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server is Listening on Port : ${PORT}`)
})
