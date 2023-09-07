const headers = {
  "Content-Type": "application/json",
};

async function get(endpoint) {
  console.log(`${localStorage.getItem('server')}${endpoint}`);
  return await (
    await fetch(`${localStorage.getItem('server')}${endpoint}`, {
      method: "GET",
      headers: headers,
    })
  ).json();
}

async function post(endpoint, request) {
  return await (
    await fetch(`${localStorage.getItem('server')}${endpoint}`, {
      method: "POST",
      body: JSON.stringify(request),
      headers: headers,
    })
  ).json();
}
