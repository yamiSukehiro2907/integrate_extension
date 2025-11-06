export interface AuthResponse {
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
    username: string;
  };
  project: {
    id: string;
    name: string;
    version: string;
    owner: string;
    project_status: string;
  };
  files: {
    openapi_yaml: any;
    schema_json: any;
    rules_md: string;
  };
}
