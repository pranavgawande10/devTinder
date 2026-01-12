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

const validateEditProfileData = (req)=>{
    const allowedEditFields = ["firstName" , "lastName" ,"emailId","photoUrl" , "age", "gender" , "about" , "skills",];

    const isEditAllowed = Object.keys(req.body).every(field => allowedEditFields.includes(field));
    return isEditAllowed;
};

module.exports = { signupValidation , validateEditProfileData };
