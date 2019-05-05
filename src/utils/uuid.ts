// vendor
import * as uuidv1 from 'uuid/v1';

/**
 * Generate uuid
 */
export const generateUUID = (): string => {
  return uuidv1();
};
