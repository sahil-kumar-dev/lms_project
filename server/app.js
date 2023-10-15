import cookieParser from 'cookie-parser'
import express from 'express'
import cors from'cors'
import { config } from 'dotenv';
import morgan from 'morgan';
import userRoute from './routes/user.routes.js'
import errorMiddleware from './middleware/error.middleware.js';

config()

const app = express()

app.use(express.json())

app.use(express.urlencoded({extended:true}))

app.use(cors({
	origin: [process.env.FRONTEND_URL],
	// credential: true
}))

app.use(cookieParser())
app.use(morgan('dev'))

app.use('/ping', function (req, res) {
	res.send('/pong')
})

app.use('/api/v1/user',userRoute)

app.all('*', (req, res) => {
	res.status(404).send('oops!! 404 page not found')
})

app.use(errorMiddleware)

export default app
