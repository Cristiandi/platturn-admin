import axios from "axios";
import authHeader from "./auth.header";

const API_URL = process.env.VUE_APP_API_BASE_URL;

class UserService {
  getPublicContent() {
    // return axios.get(API_URL + "all");
    return Promise.resolve({
      data: "This is the main content"
    });
  }

  getUserBoard() {
    // return axios.get(API_URL + "user", { headers: authHeader() });
    return Promise.resolve({
      data: "This is the content for a user..."
    });
  }

  getModeratorBoard() {
    return axios.get(API_URL + "mod", { headers: authHeader() });
  }

  getAdminBoard() {
    return axios.get(API_URL + "admin", { headers: authHeader() });
  }

  async changeEmailAddress(user) {
    const response = await axios.post(
      API_URL + "users/change-email-address",
      {
        email: user.email,
        repeatedEmail: user.repeatedEmail
      },
      { headers: authHeader() }
    );

    const { data } = response;

    return data;
  }

  async changePassword(user) {
    const response = await axios.post(
      API_URL + "users/change-password",
      {
        oldPassword: user.currentPassword,
        password: user.password,
        repeatedPassword: user.repeatedPassword
      },
      { headers: authHeader() }
    );

    const { data } = response;

    return data;
  }

  async updateUserData(user) {
    const response = await axios.patch(
      API_URL + "users/update-user-data",
      user,
      { headers: authHeader() }
    );

    const { data } = response;

    return data;
  }

  async getUserScreens() {
    const response = await axios.get(API_URL + "users/get-user-screens", {
      headers: authHeader()
    });

    const { data } = response;

    return data;
  }

  async validateToken() {
    await axios.get(API_URL + "users/validate-token", {
      headers: authHeader()
    });

    return true;
  }
}

export default new UserService();
