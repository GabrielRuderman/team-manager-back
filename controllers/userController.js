const { validationResult } = require('express-validator');
const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendRecoverPasswordEmail } = require('../utilities/sendRecoverPasswordEmail');

const createUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    try {
        const { email, name, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const result1 = await userModel.getUserByEmail(email);
        if (result1.rowCount === 0) {
            const result2 = await userModel.createUser(email, name, hashedPassword);
            if (result2.rowCount === 1) {
                const token = jwt.sign({ email }, process.env.secretKey, { expiresIn: '1y' });
                res.send({ code: 1, msg: "user created", token: token });
            } else {
                res.send({ code: -1, msg: "error creating the user"});
            }
        } else {
            res.send({ code: 2, msg: "user already exists" });
        }
    } catch (error) {
        console.error("Error - userController - createUser", error);
        res.status(500).send(error);
    }
};

const recoverPassword = async (req, res) => {
    try {
        const { email } = req.query;

        const result = await userModel.getUserByEmail(email);
        if (result.rowCount > 0) {
            try {
                await sendRecoverPasswordEmail(email);
                res.send({ code: 1, msg: 'Email sent' });
            } catch (error) {
                console.error('Error sending email:', error);
                res.send({ code: -1, msg: error });
            }
        } else {
            res.send({ code: 2, msg: 'The email is not registered' });
        }
    } catch (error) {
        console.error("Error - userController - createUser", error);
        res.status(500).send(error);
    }
};

const validateCredentials = async (req, res) => {
    try {
        const { email, password } = req.body;

        const result = await userModel.getUserByEmail(email);
        if (result.rowCount > 0) {
            const passwordMatch = await bcrypt.compare(password, result.rows[0].password);
            if (passwordMatch) {
                const token = jwt.sign({ email }, process.env.secretKey, { expiresIn: '1y' });
                res.send({ code: 1, msg: "user authenticated", token: token });
            } else {
                res.send({ code: 2, msg: "invalid password" });
            }
        } else {
            res.send({ code: 3, msg: "user already exists" });
        }
    } catch (error) {
        console.error("Error - userController - validateCredentials", error);
        res.status(500).send(error);
    }
}

const validateToken = async (req, res) => {
    try {
        const tokenHeader = req.headers.authorization;
        if (!tokenHeader || !tokenHeader.startsWith("Bearer ")) {
            return res.status(401).send("Token has an incorrect format");
        }
        const token = tokenHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.secretKey);
        return res.json({ code: 1, msg: "token is valid", user: decoded });
    } catch (error) {
        console.error("Error - userController - validateToken", error);
        res.status(500).send(error);
    }
}

module.exports = {
    createUser,
    recoverPassword,
    validateCredentials,
    validateToken,
};