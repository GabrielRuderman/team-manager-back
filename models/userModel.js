const pool = require("../config/databaseConfig");

const createUser = async (email, name, password) => {
    const query = "INSERT INTO users (email, name, password) VALUES ($1, $2, $3)";
    const values = [email, name, password];
    const result = await pool.query(query, values);
    return result;
};

const getUserByEmail = async (email) => {
    const query = "SELECT * FROM users WHERE email = $1";
    const values = [email];
    const result = await pool.query(query, values);
    return result;
};

module.exports = {
    createUser,
    getUserByEmail,
};