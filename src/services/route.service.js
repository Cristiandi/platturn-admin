import axios from "axios";
import authHeader from "./auth.header";

const API_URL = process.env.VUE_APP_API_BASE_URL;

class RouteService {
  constructor() {
    this.data = [
      {
        id: 1,
        name: "Test",
        path: "/test",
        relativePath: "",
        functionalityId: 2,
        functionality: "Gestión de empresas",
        created_at: "0000/00/00 00:00:00",
        updated_at: "0000/00/00 00:00:00"
      },
      {
        id: 2,
        name: "Test",
        path: "/test",
        relativePath: "",
        functionalityId: 3,
        functionality: "Gestión de funcionalidades",
        created_at: "0000/00/00 00:00:00",
        updated_at: "0000/00/00 00:00:00"
      },
      {
        id: 3,
        name: "Test",
        path: "/test",
        relativePath: "",
        functionalityId: 3,
        functionality: "Gestión de funcionalidades",
        created_at: "0000/00/00 00:00:00",
        updated_at: "0000/00/00 00:00:00"
      }
    ];
  }

  async getRoutes() {
    const response = await axios.get(API_URL + "routes", {
      headers: authHeader(),
      params: {
        filter: {}
      }
    });

    const { data } = response;

    return data;
  }

  /*
  async createScreen(screen) {
    console.log("screen", screen);
    const response = await axios.post(
      API_URL + "screens",
      {
        name: screen.name,
        path: screen.path,
        relativePath: screen.relativePath,
        functionalityId: screen.functionalityId
      },
      { headers: authHeader() }
    );

    const { data } = response;

    return data;
  }

  async updateScreen(screen) {
    const response = await axios.patch(
      API_URL + "screens/" + screen.id,
      {
        name: screen.name,
        path: screen.path,
        relativePath: screen.relativePath,
        functionalityId: screen.functionalityId
      },
      { headers: authHeader() }
    );

    const { data } = response;

    return data;
  }

  async deleteScreen(screen) {
    const response = await axios.delete(API_URL + "screens/" + screen.id, {
      headers: authHeader()
    });

    const { data } = response;

    return data;
  }
  */
}

export default new RouteService();
