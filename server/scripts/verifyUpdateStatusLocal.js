require('dotenv').config();
const fetch = require('node-fetch');

const API_BASE = 'http://127.0.0.1:5000/api';

async function main() {
  // login
  const email = 'autotest_local@example.com';
  const password = 'test1234';
  const datasetId = '68af5d46d9eae6100a8a6fc8';

  console.log('Logging in...');
  const loginRes = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const loginData = await loginRes.json();
  if (!loginRes.ok) {
    console.error('Login failed', loginData);
    process.exit(1);
  }
  const token = loginData.token;
  console.log('Token received:', !!token);

  // call PUT to update status to completed
  console.log('Updating assignment status to completed...');
  const putRes = await fetch(`${API_BASE}/datasets/my/assigned/${datasetId}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ status: 'completed' }),
  });
  const putData = await putRes.json();
  console.log('PUT Response status', putRes.status, putData);

  // call GET to fetch assignments
  console.log('Fetching assignments...');
  const getRes = await fetch(`${API_BASE}/datasets/my/assigned`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  const getData = await getRes.json();
  console.log('GET Response status', getRes.status);
  console.log(JSON.stringify(getData, null, 2));
}

main().catch(err => {
  console.error('Error', err);
  process.exit(1);
});
