import expres from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/mongodb.js'
import { clerkWebhooks } from './controllers/webhooks.js'

const app = expres()

//middlewares
app.use(cors())

//data base connection
await connectDB()

//home route
app.get('/', (req, res) => {
    res.send("Home Route")
})

app.post('/clerk', expres.json(), clerkWebhooks )

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server is Listening on Port : ${PORT}`)
})