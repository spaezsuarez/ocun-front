class HttpClient {
    
  constructor() {
    this.url = "http://localhost:3000";
    this.headers = {
        "Content-Type": "application/json",
    };
  }

  async get(endpoint) {
    return await (
      await fetch(this.url + endpoint, {
        method: "GET",
        headers: this.headers,
      })
    ).json();
  }

  async post(endpoint,request) {
    return await (
      await fetch(this.url + endpoint, {
        method: "POST",
        body: JSON.stringify(request),
        headers: this.headers,
      })
    ).json();
  }
}
