import mysql2 from 'mysql2/promise';
import { config } from '../config.js';

export const connection = mysql2.createPool({
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database,
    waitForConnections: true,
    connectionLimit: config.db.connectionLimit,
    namedPlaceholders: true
});

export async function establishDBConnection() {
    const dbConnection = await connection.getConnection();
    dbConnection.release();
    console.log('Connected to the database');
}

export const stablishDBConnection = establishDBConnection;
export default connection;
