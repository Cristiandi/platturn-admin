import axios from "axios";

const API_URL = process.env.VUE_APP_API_BASE_URL;

class AuthService {
  login(user) {
    return axios
      .post(API_URL + "users/login", {
        email: user.email,
        password: user.password
      })
      .then((response) => {
        if (response.data.accessToken) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }

        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("user");
  }

  register(user) {
    return axios.post(API_URL + "users", {
      fullName: user.fullName,
      document: user.document,
      email: user.email,
      password: user.password,
      address: user.address,
      phone: user.phone
    });
  }

  sendConfimationEmail(user) {
    return axios.post(API_URL + `users/send-confimation-email/${user.authUid}`);
  }

  sendForgotPasswordEmail(user) {
    return axios.post(API_URL + `users/send-forgot-password-email`, {
      email: user.email
    });
  }

  resetPassword(user) {
    return axios.post(API_URL + `users/change-password-from-code`, {
      code: user.resetPasswordCode,
      password: user.password,
      repeatedPassword: user.repeatedPassword
    });
  }

  refreshUser(user) {
    const currentUser = JSON.parse(localStorage.getItem("user"));

    delete currentUser.message;

    const mergedUser = { ...currentUser, ...user };

    localStorage.setItem("user", JSON.stringify(mergedUser));

    return mergedUser;
  }
}

export default new AuthService();
