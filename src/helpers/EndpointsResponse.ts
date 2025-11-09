export type EndpointStatus = "completed" | "ongoing" | "not_started";

export interface Endpoint {
  id: number;
  project_id: number;
  project_name: string | null;
  method: string;
  path: string;
  version: string;
  request_format: Record<string, any> | null;
  response_format: Record<string, any> | null;
  endpoint_status: EndpointStatus;
  completed_at: string | null;
  created_at: string;
}

export interface GetAllEndpointsResponse {
  message: string;
  groupedByStatus: Record<EndpointStatus, Endpoint[]>;
}
