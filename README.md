**A Tiny JavaScript Form Validator**
---
<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Unofficial_JavaScript_logo_2.svg/480px-Unofficial_JavaScript_logo_2.svg.png" alt="drawing" width="80"/>

**Main Features:**
 - Validate required fields
 - Validate email address
 - Validate phone number
 - Validate credit card number
 - Validate names (full names)
 - Validate integers values (< > = )
 - Display errors on field inputs

**How to Use?**
--

Just include the **validator.js** in your project,
initialize the validator with the **form element**

    const formEle = document.getElementById('myForm);
    const validator = new FormValidator(formEle);

**Options**
    You can change the default options by passing **options object** as second argument

    checkRequired: true / false
	checkValues: [{fieldName: 'age', value:30}] // array of objects
	ignoreClassName: 'ignoreMe' // fields with this class name will not be validate
    validateEmail: true / false
    validatePhone: true / false
    validateFullName: true / false

E.g - `const validator = new FormValidator(formEle, {validateEmail:false});`

**Form Structure**
Used with [Bootstrap 4](https://getbootstrap.com/)

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


