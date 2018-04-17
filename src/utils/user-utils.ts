export default class UserUtils {
  static errorMessage = "";

  static isValidRegistrationDetails(data) {
      if (data.firstName == "" || data.surname == "" || data.email == "" || data.password == "" || data.confirmPassword == "") {
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

      return false;
  }
}
