// status code types
export enum StatusCodeTypes {
  ok = 200,
  error = 400,
  serverError = 500,
}

// response
export interface Response {
  statusCode: StatusCodeTypes;
  body: string;
}
