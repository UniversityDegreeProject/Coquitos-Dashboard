import type { Client } from "../interfaces";


export const backendClientToFrontendClient = (client: Client): Client => {
  return {
    ...client,
  };
};