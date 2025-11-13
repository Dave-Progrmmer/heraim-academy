import express from 'express'
import 'dotenv/config'
import { connectDB } from './config/db.js'

const app = express()
app.use(express.json())

const PORT = process.env.PORT || 5001

const startServer = async () => {
    await connectDB()
    app.listen(PORT, () => {
        console.log(`Server is listening on PORT: ${PORT}`);
    });
}

startServer();