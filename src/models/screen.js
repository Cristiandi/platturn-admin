export default class Screen {
  constructor({
    id,
    name,
    path,
    relativePath,
    functionalityId,
    createdAt,
    updatedAt,
    functionality
  }) {
    this.id = id;
    this.name = name;
    this.path = path;
    this.relativePath = relativePath;
    this.functionalityId = functionalityId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.functionality = functionality;
  }
}
