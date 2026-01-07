const validator = require("validator");

const signupValidation = (req) => {
    const { firstName, lastName, emailId, password } = req.body;

    if (!firstName || !lastName) {
        throw new Error("First name and last name are required!");
    }

    if (!emailId || !validator.isEmail(emailId)) {
        throw new Error("Enter a valid Email ID!");
    }

    if (!password || !validator.isStrongPassword(password)) {
        throw new Error(
            "Password must be strong (min 8 chars, uppercase, lowercase, number, symbol)"
        );
    }
};

module.exports = { signupValidation };
