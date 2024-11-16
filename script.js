const validation = {
    methods: {
        required: (value) => value.trim() !== '',
        email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        minLength: (value, min) => value.length >= min,
        maxLength: (value, max) => value.length <= max,
        numeric: (value) => /^\d+$/.test(value),
        sameAs: (value, field) => value === document.getElementById(field).value
    },
    
    messages: {
        required: 'This field is required',
        email: 'Please enter a valid email address',
        minLength: (min) => `Must be at least ${min} characters`,
        maxLength: (max) => `Must not exceed ${max} characters`,
        numeric: 'Must contain only numbers',
        sameAs: 'Passwords do not match'
    },
    
    validate(value, rules) {
        for (const rule in rules) {
            const params = rules[rule];
            if (typeof this.methods[rule] === 'function' && !this.methods[rule](value, params)) {
                return typeof this.messages[rule] === 'function' 
                    ? this.messages[rule](params)
                    : this.messages[rule];
            }
        }
        return true;
    }
};

const validationRules = {
    email: {
        required: true,
        email: true
    },
    country: {
        required: true,
        minLength: 2
    },
    zip: {
        required: false,
        numeric: true,
        minLength: 5,
        maxLength: 5
    },
    password: {
        required: true,
        minLength: 8
    },
    password2: {
        required: true,
        minLength: 8,
        sameAs: 'password'
    }
};

const addError = (input, message) => {
    const existingError = input.nextElementSibling;
    if (existingError?.classList?.contains('error-message')) {
        existingError.remove();
    }
    
    input.classList.remove('valid');
    input.classList.add('invalid');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message + '🤨';
    input.parentNode.insertBefore(errorDiv, input.nextSibling);
};

const removeError = (input) => {
    const existingError = input.nextElementSibling;
    if (existingError?.classList?.contains('error-message')) {
        existingError.remove();
    }
    input.classList.remove('invalid');
    input.classList.add('valid');
};

// Input blur handler
document.querySelectorAll('form input').forEach(input => {
    input.addEventListener('blur', () => {
        input.classList.add('touched');
        const rules = validationRules[input.id];
        
        if (rules) {
            if (!rules.required && input.value.trim() === '') {
                input.classList.remove('valid', 'invalid', 'touched');
                removeError(input);
                return;
            }
            
            const result = validation.validate(input.value, rules);
            if (result !== true) {
                addError(input, result);
            } else {
                removeError(input);
            }
        }
    });
});

// Form submit handler
document.querySelector('form').addEventListener('submit', (event) => {
    event.preventDefault();
    let formValid = true;
    
    document.querySelectorAll('form input').forEach(input => {
        input.classList.add('touched');
        const rules = validationRules[input.id];
        
        if (rules) {
            if (!rules.required && input.value.trim() === '') {
                removeError(input);
                return;
            }
            
            const result = validation.validate(input.value, rules);
            if (result !== true) {
                formValid = false;
                addError(input, result);
            } else {
                removeError(input);
            }
        }
    });
    
    if (formValid) {
        alert('Form submitted successfully!😆');
    }
});