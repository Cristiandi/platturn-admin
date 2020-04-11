export default class Route {
  constructor({ id, httpMethod, path, isPublic, createdAt, updatedAt }) {
    this.id = id;
    this.httpMethod = httpMethod;
    this.path = path;
    this.isPublic = isPublic;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
