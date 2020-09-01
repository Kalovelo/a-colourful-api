export default class GraphqlHTTPError extends Error {
  extensions: {
    code: number;
  };
  constructor(message: string, code: number) {
    super(message);
    this.extensions = { code };
  }
}
