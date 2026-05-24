/**
 * @file box.ts
 * @description Initializes and returns an authenticated Box client.
 * Uses a dev token (Note: replace with OAuth before deploying to production)
 */

import { BoxClient } from 'box-typescript-sdk-gen';
import { BoxDeveloperTokenAuth } from 'box-typescript-sdk-gen';
 
export function getBoxClient(): BoxClient {
  const auth = new BoxDeveloperTokenAuth({ token: process.env.BOX_DEV_TOKEN! });
  return new BoxClient({ auth });
}