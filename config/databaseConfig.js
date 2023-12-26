const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'TeamManagerDB',
    password: 'putaso96',
    port: 5432,
});

pool.on('error', (err) => {
    console.error('Error inesperado en el cliente PostgreSQL', err);
    process.exit(-1);
});

module.exports = pool;