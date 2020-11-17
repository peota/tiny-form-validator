function FormValidator(form = null, userOptions = {}) {

    // check if form element provided
    (function() {
        if (form === null) {
            throw new Error("Form element does not exist! failed to initialize.");
        }
    })();

    // global settings
    let options = {

        checkRequired: userOptions.checkRequired === undefined ? true : userOptions.checkRequired,
        validateEmail: userOptions.validateEmail === undefined ? true : userOptions.validate,
        validatePhone: userOptions.validatePhone === undefined ? false : userOptions.validatePhone,
        validateCreditCard: userOptions.validateCreditCard === undefined ? false : userOptions.validateCreditCard,
        validateDate: userOptions.validateDate === undefined ? true : userOptions.validateDate,
        ignoreClassName: userOptions.ignoreClassName === undefined ? "ignore" : userOptions.ignoreClassName,
        displayErrors: userOptions.displayErrors === undefined ? true : userOptions.displayErrors

    };

    let valid = true; // will determine if the form is valid or not

    /*
        extract all fields from the form, return only input fields,
        NOT including buttons and ignored fields
    */
    const fields = [...form.elements].filter((field) => {
        return field.tagName !== "BUTTON" &&
            field.classList.contains(options.ignoreClassName) === false
    });

    /*
        extract all the unique fields on object initialization
        in order to user HTML structure manipulation
    */
    const customFields = {

        required: fields.filter(field => field.hasAttribute('required')),
        email: fields.filter(field => field.type === 'email'),
        phone: fields.filter(field => field.type === 'tel'),
        creditCard: fields.filter(field => field.name === options.validateCreditCard.fieldName),
        date: fields.filter((field) => field.type === 'date')

    }

    /*
     * this array will contains custom validation methods added on the fly
     * .... how (?)
     */
    let customMethods = [];


    // storing regex codes
    const regex = {

        email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        phone: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
        creditCards: [
            { regex: /^(?:4[0-9]{12}(?:[0-9]{3})?)$/, cardName: "visa" },
            { regex: /^(?:5[1-5][0-9]{14})$/, cardName: "master card" },
            { regex: /^(?:3[47][0-9]{13})$/, cardName: "american express" },
            { regex: /^(?:6(?:011|5[0-9][0-9])[0-9]{12})$/, cardName: "discover" },
        ],
        date: /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/
    };

    function showError(field, message) {
        if (options.displayErrors === false) return;
        const inputParent = field.type === 'checkbox' ? field.parentElement.parentElement : field.parentElement;
        inputParent.classList.add('error');
        inputParent.querySelector("small").innerHTML = message;
    }

    function resetErrors() {
        const errors = form.querySelectorAll("small");
        [...errors].forEach((error) => { error.innerHTML = ""; });
    }

    function checkRequired() {
        customFields.required.forEach((field) => {
            if (field.value === '') {
                showError(field, 'This field is required.');
                valid = false;
            }
            if (field.type === 'checkbox' && !field.checked) {
                showError(field, 'This field is required.');
                valid = false;
            }
        })
    }

    function validateEmail() {
        if (customFields.email.length !== 0 && customFields.email[0].value !== "") {
            const emailAddress = customFields.email[0].value;
            if (!regex.email.test(String(emailAddress).toLowerCase())) {
                showError(customFields.email[0], 'Email address is not valid.');
            }
        }
    }

    function validatePhoneNumber() {
        if (customFields.phone.length !== 0 && customFields.phone.value !== "") {
            const phoneNumber = customFields.phone[0].value;
            if (!regex.phone.test(String(phoneNumber).toLowerCase())) {
                showError(customFields.phone[0], 'Phone number is not valid.');
            }
        }
    }

    function validateCC() {
        if (customFields.creditCard.length === 1 && customFields.creditCard.value !== '') {
            const ccNum = customFields.creditCard[0].value;
            let cardName = null;
            for (let card of regex.creditCards) {
                if (card.regex.test(String(ccNum).toLowerCase())) {
                    cardName = card.cardName;
                    break;
                }
            }
            if (cardName === null) {
                valid = false;
                showError(searchCCField[0], 'Credit card number is not valid.');
            } else {
                console.log(cardName)
            }
        }
    }

    function validateDate() {
        if (customFields.date.length > 0 && (customFields.date.every(date => date.value !== ''))) {
            customFields.date.forEach((date) => {
                if (!regex.date.test(String(moment(date.value).format('DD-MM-YYYY')).toLowerCase())) {
                    showError(date, 'Date is not valid.');
                    valid = false;
                }
            })
        }
    }

    function submitForm(e) {

        e.preventDefault(); // prevent form submission
        valid = true; // reset the valid flag at form submission
        resetErrors(); // clean all error messages

        // check options and run the needed validations
        options.checkRequired === true ? checkRequired() : '';
        options.validateEmail === true ? validateEmail() : '';
        options.validatePhone === true ? validatePhoneNumber() : '';
        options.validateCreditCard === true ? validateCC() : '';
        options.validateDate === true ? validateDate() : '';

        // submit the form if all validations passed
        valid ? form.submit() : '';
    }

    // * custom validation methods *
    Object.defineProperty(this, 'customMethods', {
        set: function(f) {
            customMethods.push(f);
        }
    });

    // event listeners
    form.querySelector('button').addEventListener('click', submitForm);
}