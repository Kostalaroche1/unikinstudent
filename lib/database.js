import mysql from "mysql2/promise"

let connection;
export async function connectionDatabase() {
    if (!connection) {
        connection = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
        })
    }
    return connection
}