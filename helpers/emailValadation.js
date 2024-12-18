function emailValidation(email) {
  let emailTest = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
  return emailTest;
}
module.exports = emailValidation;
