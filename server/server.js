import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import 'dotenv/config'
import connectDB from './configs/mongodb.js'
import { clerkWebhooks } from './controllers/webhooks.js'

const app = express()

//middlewares
app.use(cors())

//database connection
await connectDB()

//home route
app.get('/', (req, res) => {
    res.send("Home Route")
})

// Clerk webhook route (must use raw body parser, not express.json)
app.post('/clerk', bodyParser.raw({ type: 'application/json' }), clerkWebhooks)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server is Listening on Port : ${PORT}`)
})
