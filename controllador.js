const { phone } = require("phone");

async function validationPhone(phoneNumber) {

    phoneNumber = phoneNumber.replace(/\s/g, "");

    if (!phoneNumber.startsWith("+")) {
        phoneNumber = "+" + phoneNumber;
      }

    const modifiedPhoneNumber = phone(phoneNumber);

    if (!modifiedPhoneNumber.isValid) {
        console.log(modifiedPhoneNumber.phoneNumber);
        return "Numero invalido"
      }
  
      phoneNumber = modifiedPhoneNumber.phoneNumber;

    return phoneNumber
}

module.exports = { validationPhone };