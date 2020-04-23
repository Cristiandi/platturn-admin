import axios from "axios";
import authHeader from "./auth.header";

const API_URL = process.env.VUE_APP_API_BASE_URL;

class FunctionalityRouteService {
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

  async getAll() {
    const response = await axios.get(API_URL + "functionalities-routes", {
      headers: authHeader(),
      params: {
        filter: {}
      }
    });

    const { data } = response;

    return data;
  }

  async createOne(functionalityRoute) {
    console.log("functionalityRoute", functionalityRoute);
    const response = await axios.post(
      API_URL + "functionalities-routes",
      {
        functionalityId: functionalityRoute.functionalityId,
        routeId: functionalityRoute.routeId
      },
      { headers: authHeader() }
    );

    const { data } = response;

    return data;
  }

  async updateRoute(route) {
    const response = await axios.patch(
      API_URL + "routes/" + route.id,
      {
        httpMethod: route.httpMethod,
        path: route.path,
        isPublic: route.isPublic
      },
      { headers: authHeader() }
    );

    const { data } = response;

    return data;
  }

  async deleteRoute(route) {
    const response = await axios.delete(API_URL + "routes/" + route.id, {
      headers: authHeader()
    });

    const { data } = response;

    return data;
  }
}

export default new FunctionalityRouteService();
