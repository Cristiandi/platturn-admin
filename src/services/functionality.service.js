import axios from "axios";
import authHeader from "./auth.header";

const API_URL = process.env.VUE_APP_API_BASE_URL;

class FunctionalityService {
  async getFunctionalities() {
    const response = await axios.get(API_URL + "functionalities", {
      headers: authHeader(),
      params: {
        filter: {}
      }
    });

    const { data } = response;

    return data;
  }

  async createFunctionality(functionality) {
    const response = await axios.post(
      API_URL + "functionalities",
      {
        name: functionality.name,
        code: functionality.code
      },
      { headers: authHeader() }
    );

    const { data } = response;

    return data;
  }

  async updateFunctionality(functionality) {
    const functionalityToSend = { ...functionality };

    delete functionalityToSend.id;
    delete functionalityToSend.created_at;
    delete functionalityToSend.updated_at;
    delete functionalityToSend.actions;

    const response = await axios.patch(
      API_URL + "functionalities/" + functionality.id,
      {
        ...functionalityToSend
      },
      { headers: authHeader() }
    );

    const { data } = response;

    return data;
  }

  async deleteFunctionality(functionality) {
    console.log("functionality to delete", functionality);
    return Promise.resolve({
      message: "functionality deleted!"
    });
  }

  async createCompany(company) {
    const response = await axios.post(
      API_URL + "companies",
      {
        name: company.name,
        code: company.code,
        document: company.document,
        email: company.email
      },
      { headers: authHeader() }
    );

    const { data } = response;

    return { ...data, message: "company created" };
  }

  async updateCompany(company) {
    const companyToSend = { ...company };

    delete companyToSend.id;
    delete companyToSend.created_at;
    delete companyToSend.updated_at;

    const response = await axios.patch(
      API_URL + "companies/" + company.id,
      {
        ...companyToSend
      },
      { headers: authHeader() }
    );

    const { data } = response;

    return { ...data, message: "company updated" };
  }
}

export default new FunctionalityService();
