const { Pool } = require('pg')

const pool = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: '61346134',
    database: 'dindin',
})

module.exports = pool;