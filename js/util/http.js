const headers = {
  "Content-Type": "application/json",
  "Accept": 'application.json',
};

async function get(endpoint) {
  const responseHttp = await fetch(`${localStorage.getItem('server')}${endpoint}`, { 
    method: "GET",
    headers: headers,
  });
  console.log(responseHttp);
  const response = await (responseHttp).json();
  console.log(response);
  return response;
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
