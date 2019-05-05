// models
import { StatusCodeTypes, Response } from '../models';

/**
 * ok
 * @param data
 */
export const ok = (data: any): Response => {
  return response(StatusCodeTypes.ok, data);
};

/**
 * error
 * @param data
 */
export const error = (data: any): Response => {
  return response(StatusCodeTypes.error, data);
};

/**
 * serverError
 * @param data
 */
export const serverError = (data: any): Response => {
  return response(StatusCodeTypes.serverError, data);
};

/**
 * response
 */
const response: Function = (statusCode: number, data: string): Response => {
  return {
    statusCode: statusCode,
    body: JSON.stringify(data),
  };
};
