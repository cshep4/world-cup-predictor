export default class UserUtils {
  static errorMessage = "";

  static isValidRegistrationDetails(data) {
      if (data.firstName == "" || data.surname == "" || data.email == "" || data.password == "" || data.confirmPassword == "" || data.predictedWinner == "") {
          this.errorMessage = "All fields must be entered";
          return false;
      }
      const emailPattern = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
      if (!emailPattern.test(data.email)) {
          this.errorMessage = "Email not valid";
          return false
      }
      const passwordPattern = new RegExp(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/);
      if (!passwordPattern.test(data.password)) {
          this.errorMessage = "Password not valid";
          return false
      }
      if (data.confirmPassword != data.password) {
          this.errorMessage = "Passwords do not match";
          return false
      }

      return true;
  }

  static isValidEmail(email) {
    if (email == "") {
      this.errorMessage = "Please enter your email";
      return false;
    }
    const emailPattern = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    if (!emailPattern.test(email)) {
      this.errorMessage = "Email is not valid, please try again";
      return false
    }

    return true;
  }

  static isValidUpdateUserDetails(data) {
    if (data.firstName == "" || data.surname == "" || data.email == "") {
      this.errorMessage = "All fields must be entered";
      return false;
    }

    const emailPattern = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

    if (!emailPattern.test(data.email)) {
      this.errorMessage = "Email not valid";
      return false
    }

    return true;
  }

  static isValidUpdatePassword(data) {
    if (data.oldPassword == "" || data.newPassword == "" || data.confirmPassword == "") {
      this.errorMessage = "All fields must be entered";
      return false;
    }

    const passwordPattern = new RegExp(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/);
    if (!passwordPattern.test(data.newPassword)) {
      this.errorMessage = "Password not valid";
      return false
    }
    if (data.confirmPassword != data.newPassword) {
      this.errorMessage = "Passwords do not match";
      return false
    }

    return true;
  }

  static doesPasswordContainUppercaseLetters(password) {
    return (/[A-Z]/.test(password));
  }

  static doesPasswordContainLowercaseLetters(password) {
    return (/[a-z]/.test(password));
  }

  static doesPasswordContainNumbers(password) {
    return (/[0-9]/.test(password));
  }

  static isPasswordBetween6And20Characters(password) {
    return password.length >= 6 && password.length <= 20;
  }

  static doPasswordsMatch(password, conf) {
    return password == conf;
  }
}
