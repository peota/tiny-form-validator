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
        checkValues: userOptions.checkValues === undefined ? [] : userOptions.checkValues,
        ignoreClassName: userOptions.ignoreClassName === undefined ? "ignore" : userOptions.ignoreClassName,
        validateEmail: userOptions.validateEmail === undefined ? true : userOptions.validate,
        validatePhone: userOptions.validatePhone === undefined ? true : userOptions.validatePhone,
        validateFullName: userOptions.validateFullName === undefined ? false : userOptions.validateFullName

    };

    // this will determine if the form is valid or not
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
        creditCard: [{ visa: /^(?:4[0-9]{12}(?:[0-9]{3})?)$/ },
        { masterCard: /^(?:5[1-5][0-9]{14})$/ },
        { amexp: /^(?:3[47][0-9]{13})$/ },
        { discov: /^(?:6(?:011|5[0-9][0-9])[0-9]{12})$/ },
        ]
    };

    // // store custom erros messages
    // let errors = {
    //     email: "",
    //     phone: "",
    // }

    function showError(field, message) {
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

        console.log(valid)

        if (valid) form.submit();
    }

    // event listeners
    form.querySelector('button').addEventListener('click', submitForm);
    //form.querySelector('.reset').addEventListener('click', submitForm);
}