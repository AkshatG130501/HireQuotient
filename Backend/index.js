import express from 'express';
import dotenv from 'dotenv';
import connectToMongoDB from './db/connectToMongoDB.js';


/* Configurations */
const app = express();

dotenv.config();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

const PORT = process.env.PORT || 6001;

app.listen(PORT, () => {
    connectToMongoDB();
    console.log(`Server is running on port ${PORT}`);
});
