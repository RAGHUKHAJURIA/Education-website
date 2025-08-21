import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import 'dotenv/config'
import connectDB from './configs/mongodb.js'
import { clerkWebhooks, stripeWebhooks } from './controllers/webhooks.js'
import educatorRouter from './routes/educatorRoutes.js'
import { clerkMiddleware } from '@clerk/express'
import connectCloudinary from './configs/cloudinary.js'
import courseRouter from './routes/courseRoute.js'
import userRouter from './routes/userRouter.js'

const app = express()

//middlewares
app.use(cors())
// app.use(clerkMiddleware())

//database connection
await connectDB()
await connectCloudinary()

//home route
app.get('/', (req, res) => {
    res.send("Home Route")
})

// Clerk webhook route (must use raw body parser, not express.json)
app.post('/clerk', bodyParser.raw({ type: 'application/json' }), clerkWebhooks)
app.use('/api/educator', clerkMiddleware(), express.json(), educatorRouter)
app.use('/api/course', express.json(), courseRouter)
app.use('/api/user', clerkMiddleware(), express.json(), userRouter)
app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhooks)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server is Listening on Port : ${PORT}`)
})
