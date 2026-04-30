export const config = {
    port: Number(process.env.PORT) || 3000,
    db: {
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'users',
        connectionLimit: Number(process.env.DB_CONNECTION_LIMIT) || 10
    }
};
