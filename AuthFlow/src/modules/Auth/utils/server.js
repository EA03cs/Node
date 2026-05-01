import app from '../../../appcontroller.js';
import { connectDB } from '../db/db.js';
import dotenv from 'dotenv';

dotenv.config();

connectDB();

app.listen(process.env.PORT, () => {
    console.log(`Server running on ${process.env.PORT}`);
});