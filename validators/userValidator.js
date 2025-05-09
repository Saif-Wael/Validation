const validator = {
    // Username validation
    validateUsername: (username) => {
        const errors = [];
        if (!username) {
            errors.push('Username is required');
        } else {
            if (username.length < 3) {
                errors.push('Username must be at least 3 characters long');
            }
            if (username.length > 30) {
                errors.push('Username must be less than 30 characters');
            }
            if (!/^[a-zA-Z0-9_]+$/.test(username)) {
                errors.push('Username can only contain letters, numbers, and underscores');
            }
        }
        return errors;
    },

    // Email validation
    validateEmail: (email) => {
        const errors = [];
        if (!email) {
            errors.push('Email is required');
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                errors.push('Invalid email format');
            }
        }
        return errors;
    },

    // Password validation
    validatePassword: (password) => {
        const errors = [];
        if (!password) {
            errors.push('Password is required');
        } else {
            if (password.length < 8) {
                errors.push('Password must be at least 8 characters long');
            }
            if (!/[A-Z]/.test(password)) {
                errors.push('Password must contain at least one uppercase letter');
            }
            if (!/[a-z]/.test(password)) {
                errors.push('Password must contain at least one lowercase letter');
            }
            if (!/[0-9]/.test(password)) {
                errors.push('Password must contain at least one number');
            }
            if (!/[!@#$%^&*]/.test(password)) {
                errors.push('Password must contain at least one special character (!@#$%^&*)');
            }
        }
        return errors;
    },

    // Name validation
    validateName: (name, fieldName) => {
        const errors = [];
        if (!name) {
            errors.push(`${fieldName} is required`);
        } else {
            if (name.length < 2) {
                errors.push(`${fieldName} must be at least 2 characters long`);
            }
            if (name.length > 50) {
                errors.push(`${fieldName} must be less than 50 characters`);
            }
            if (!/^[a-zA-Z\s-']+$/.test(name)) {
                errors.push(`${fieldName} can only contain letters, spaces, hyphens, and apostrophes`);
            }
        }
        return errors;
    },

    // Mobile number validation
    validateMobileNumber: (mobileNumber) => {
        const errors = [];
        if (!mobileNumber) {
            errors.push('Mobile number is required');
        } else {
            if (!/^\+?[0-9]{10,15}$/.test(mobileNumber)) {
                errors.push('Invalid mobile number format');
            }
        }
        return errors;
    },

    // Gender validation
    validateGender: (gender) => {
        const errors = [];
        if (!gender) {
            errors.push('Gender is required');
        } else {
            const validGenders = ['male', 'female', 'other'];
            if (!validGenders.includes(gender.toLowerCase())) {
                errors.push('Invalid gender value');
            }
        }
        return errors;
    },

    // Validate all user data
    validateUserData: (userData) => {
        const errors = {
            username: validator.validateUsername(userData.username),
            email: validator.validateEmail(userData.email),
            password: validator.validatePassword(userData.password),
            firstName: validator.validateName(userData.firstName, 'First name'),
            lastName: validator.validateName(userData.lastName, 'Last name'),
            mobileNumber: validator.validateMobileNumber(userData.mobileNumber),
            gender: validator.validateGender(userData.gender)
        };

        // Check if passwords match
        if (userData.password !== userData.confirmPassword) {
            errors.password.push('Passwords do not match');
        }

        // Check if there are any errors
        const hasErrors = Object.values(errors).some(errorArray => errorArray.length > 0);
        
        return {
            isValid: !hasErrors,
            errors: errors
        };
    }
};

module.exports = validator; 