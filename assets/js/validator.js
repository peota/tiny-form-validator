function FormValidator(form, userOptions = { checkRequired: true, }) {

    // check if form element provided
    (function () {
        if (form === null) {
            throw new Error("Form element does not exist! failed to initialize");
            return;
        }
    })();

    // set object global options / settings
    const options = {

        checkRequired: userOptions.checkRequired === undefined ? true : userOptions.checkRequired,
        validateEmail: userOptions.validateEmail === undefined ? true : userOptions.validate,
        validatePhone: userOptions.validatePhone === undefined ? false : userOptions.validatePhone,
        validateFullName: userOptions.validateFullName === undefined ? false : userOptions.validateFullName,
        validateCreditCard: userOptions.validateCreditCard === undefined ? false : userOptions.validateCreditCard,
        validateDate: userOptions.validateDate === undefined ? true : userOptions.validateDate,
        checkValues: userOptions.checkValues === undefined ? [] : userOptions.checkValues,
        ignoreClassName: userOptions.ignoreClassName === undefined ? "ignore" : userOptions.ignoreClassName,
        displayErrors: userOptions.displayErrors === undefined ? true : userOptions.displayErrors

    };

    // will determine if the form is valid or not
    let valid = true;

    // extract all fields from the form, return only input fields (exclude the buttons)
    const fields = [...form.elements].filter((field) => {
        return field.tagName !== "BUTTON" &&
            field.classList.contains(options.ignoreClassName) === false
    });

    // storing regex validation codes
    const regex = {
        email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,

        phone: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,

        name: /^([a-zA-Z]{2,}\s[a-zA-Z]{1,}'?-?[a-zA-Z]{2,}\s?([a-zA-Z]{1,})?)/,

        creditCards: [{ regex: /^(?:4[0-9]{12}(?:[0-9]{3})?)$/, cardName: "visa" },
        { regex: /^(?:5[1-5][0-9]{14})$/, cardName: "master card" },
        { regex: /^(?:3[47][0-9]{13})$/, cardName: "american express" },
        { regex: /^(?:6(?:011|5[0-9][0-9])[0-9]{12})$/, cardName: "discover" },
        ],

        date: /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/
    };

    // // store custom erros messages
    // let errors = {
    //     email: "",
    //     phone: "",
    // }

    function showError(field, message) {
        if (options.displayErrors === false) return;
        let formControl = field.parentElement;
        if (field.type === "checkbox")
            formControl = field.parentElement.parentElement; // if it's a checkbox, select the parent of parent
        formControl.className = "form-group error";
        formControl.querySelector("small").innerHTML = message;
    }

    function resetErrors() {
        const errors = form.querySelectorAll("small");
        [...errors].forEach((error) => { error.innerHTML = ""; });
    }

    function checkRequired() {
        let requiredFields = fields.filter((field) => {
            return (field.hasAttribute('required') && options.checkRequired === true);
        });
        for (let field of requiredFields) {
            if (field.value === '') {
                showError(field, 'This field is required.');
                valid = false;
            }
            if (field.type === 'checkbox' && !field.checked) {
                showError(field, 'This field is required.');
                valid = false;
            }
        }
    }

    function validateEmail() {
        const searchEmail = fields.filter((field) => {
            return field.type === 'email';
        });

        if (searchEmail.length !== 0 && searchEmail[0].value !== "") {
            const emailAddress = searchEmail[0].value;
            if (!regex.email.test(String(emailAddress).toLowerCase())) {
                showError(searchEmail[0], 'Email address is not valid.');
            }
        }
    }

    function validatePhoneNumber() {
        const searchPhoneNumber = fields.filter((field) => {
            return field.type === 'tel';
        });
        if (searchPhoneNumber.length !== 0 && searchPhoneNumber[0].value !== "") {
            const phoneNumber = searchPhoneNumber[0].value;
            if (!regex.phone.test(String(phoneNumber).toLowerCase())) {
                showError(searchPhoneNumber[0], 'Phone number is not valid.');
            }
        }
    }

    function validateFullName() {
        const searchName = fields.filter((field) => {
            return field.name === 'firstName' || field.name === 'lastName';
        });
        if (searchName.length === 2 && searchName[0].value !== '' && searchName[1].value !== '') {
            const fullName = `${searchName[0].value} ${searchName[1].value}`

            if (!regex.name.test(String(fullName).toLowerCase())) {
                showError(searchName[0], 'Name is not valid.');
                showError(searchName[1], 'Name is not valid.');
            }
        }
    }

    function validateCC() {
        const searchCCField = fields.filter((field) => {
            return field.name === options.validateCreditCard.fieldName;
        });

        if (searchCCField.length === 1 && searchCCField[0].value !== '') {
            const ccNum = searchCCField[0].value;
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
            }
            else {
                console.log(cardName)
            }
        }
    }

    function validateDates() {
        const searchDateFields = fields.filter((field) => {
            return field.type === 'date';
        });

        if (searchDateFields.length > 0 && (searchDateFields.every(date => date.value !== ''))) {
            searchDates.forEach((date) => {
                console.log(date.value)
                if (!regex.date.test(String(moment(date.value).format('DD-MM-YYYY')).toLowerCase())) {
                    showError(date, 'Date is not valid.');
                    valid = false;
                }
            })
        }
    }

    // check if specific field is greater than a value
    function checkValue(fieldName, value) {
        let searchField = [...form.elements].filter((field) => {
            return field.name === fieldName;
        });
        if (searchField.length === 0) {
            throw new Error(`Field: '${fieldName}' not found.`);
        } else if (searchField[0].value !== '' && searchField[0].value < value) {
            showError(searchField[0], 'This field value has to be greater or equal to ' + value);
            valid = false;
        }
    }

    function submitForm(e) {

        e.preventDefault();   // prevent form submission
        valid = true;        // reset the valid flag at form submission
        resetErrors();      // clean all error messages

        // check options and run the needed validations
        if (options.checkRequired) checkRequired();
        if (options.checkValues.length > 0) {
            options.checkValues.forEach(field => checkValue(field.fieldName, field.value));
        }
        if (options.validateEmail) validateEmail();
        if (options.validatePhone) validatePhoneNumber();
        if (options.validateFullName) validateFullName();
        if (options.validateCreditCard) validateCC();
        if (options.validateDate) validateDates();

        console.log(valid)

        if (valid) form.submit();
    }

    // event listeners
    form.querySelector('button').addEventListener('click', submitForm);
    //form.querySelector('.reset').addEventListener('click', submitForm);
}