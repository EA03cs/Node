import mysql2 from 'mysql2';

export const connection = mysql2.createConnection({
    port: '3306',
    user: 'root',
    password: '',
    database: 'users'
});


export function stablishDBConnection() {
    return connection.connect((err) => {
        if (err) {
            console.error('Error connecting to the database:', err);
            return;
        }
        console.log('Connected to the database');
    });
}
export default connection;

