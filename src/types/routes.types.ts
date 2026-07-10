export interface RouteDoc {
  method: string;
  path: string;
  auth: boolean;
  roles: string[];
  description: string;
  requestBody?: string;
  responseExample?: string;
}
