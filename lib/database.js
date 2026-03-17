import mysql from "mysql2/promise"

let pool;
export async function connectionDatabase() {
    if (!pool) {
        const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

        if (!DB_HOST || !DB_USER || !DB_NAME) {
            throw new Error("Database environment variables are missing");
        }

        pool = mysql.createPool({
            host: DB_HOST,
            user: DB_USER,
            password: DB_PASSWORD,
            database: DB_NAME,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
            enableKeepAlive: true,
        })
    }
    return pool
}
