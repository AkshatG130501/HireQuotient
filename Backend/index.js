import express from 'express';
import dotenv from 'dotenv';
import connectToMongoDB from './db/connectToMongoDB.js';
import authRoutes from './routes/authRoutes.routes.js';
import cookieParser from 'cookie-parser';


/* Configurations */
const app = express();
app.use(express.json());
app.use(cookieParser());

dotenv.config();

/* Routes */
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

const PORT = process.env.PORT || 6001;

app.listen(PORT, () => {
    connectToMongoDB();
    console.log(`Server is running on port ${PORT}`);
});
