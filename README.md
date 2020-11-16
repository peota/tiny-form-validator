**A Tiny JavaScript Form Validator (in development)**
---
<img src="https://i.ibb.co/R3djrnx/tinyFV.png"  alt="drawing"/>


**Main Features:**
 - Validate required fields
 - Validate email address
 - Validate phone number
 - Validate credit card number
 - Validate dates
 - Validate min max (soon)
 - Display errors on field inputs

 **Dependencies**
 - [MomentJS](https://momentjs.com/)

**How to Use?**
--

include **validator.js** and **moment.min.js** in your project,
initialize the validator with the **form element**

    const formEle = document.getElementById('myForm');
    const validator = new FormValidator(formEle);

**Options**

You can change the default options by passing **options object** as second argument

    checkRequired: [Boolean] true
	ignoreClassName: [String] 'ignore' // fields with this class name will not be validate
    validateEmail: [Boolean] true
    validatePhone: [Boolean] true
    validateCreditCard: [Object] {fieldsName:'ccNum'}
    validateDate: [Boolean] true
    displayErrors: [Boolean] true

E.g -

`const validator = new FormValidator(formEle, {
validateEmail:false,
validatePhone: true,
validateCreditCard : {fieldName:'ccNum'},
displayErrors: false
});`

**Form Structure**

Built with [Bootstrap 4](https://getbootstrap.com/)

**Example for the HTML structure of an input**

    <div class="form-group">
	    <label for="fname">First Name:</label>
	    <input type="text" class="form-control" name="firstName" required />
	    <small></small>
    </div>

   **Checkbox structure**

    <div class="form-group">
	    <div class="form-check">
		    <input class="form-check-input" type="checkbox" value="yes" required />
		    <label class="form-check-label" for="defaultCheck1"> Yes </label>
	    </div>
	    <small></small>
    </div>


