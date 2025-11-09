import axios, { AxiosInstance } from "axios";
import * as vscode from "vscode";

export class ApiService {
  private axiosInstance: AxiosInstance;

  constructor(
    private readonly _context: vscode.ExtensionContext,
    private readonly _apiUrl: string
  ) {
    this.axiosInstance = axios.create({
      baseURL: this._apiUrl,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.axiosInstance.interceptors.request.use(async (config) => {
      const token = await this._context.secrets.get("integrate.projectToken");
      const email = await this._context.secrets.get("integrate.userEmail");

      if (token && email) {
        config.headers["Cookie"] = `projectToken=${token}; email=${email}`;
      }

      return config;
    });
  }

  getInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}
