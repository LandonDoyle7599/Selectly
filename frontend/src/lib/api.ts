import { json } from "react-router-dom";

type Method = "get" | "post" | "put" | "del";
const backendUrl = "http://localhost:3000";

export class Api {
  private token = "";
  private async makeRequest(
    url: string,
    method: Method,
    body: Record<string, any> = {}
  ) {
    const options: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };

    if (method === "post" || method === "put" || method === "del") {
      options.body = JSON.stringify({ ...body });
    }

    const result = await fetch(`${backendUrl}/${url}`, options);
    return result.json();
  }

  get(url: string) {
    return this.makeRequest(url, "get");
  }

  post(url: string, body: Record<string, any>) {
    return this.makeRequest(url, "post", body);
  }

  put(url: string, body: Record<string, any>) {
    return this.makeRequest(url, "put", body);
  }

  del(url: string, body: Record<string, any>) {
    return this.makeRequest(url, "del", body);
  }
}
