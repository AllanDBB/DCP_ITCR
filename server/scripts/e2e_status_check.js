require('dotenv').config();
const fetch = require('node-fetch');
const mongoose = require('mongoose');

const API_BASE = 'http://127.0.0.1:5000/api';
const mongoURI = process.env.MONGO_URI || 'mongodb+srv://DCPUser:m0bex47d7rLeGpTj@cluster0.mmx82lq.mongodb.net/DCP-ITCR?retryWrites=true&w=majority&appName=Cluster0';

async function main() {
  const datasetId = '68af5d46d9eae6100a8a6fc8';
  const timestamp = Date.now();
  const email = `autotest_e2e_${timestamp}@example.com`;
  const password = 'test1234';

  console.log('Registering user:', email);
  const regRes = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'e2euser', email, password })
  });
  const regData = await regRes.json();
  if (!regRes.ok) {
    console.error('Register failed', regData);
    process.exit(1);
  }
  console.log('Registered. Logging in...');

  const loginRes = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const loginData = await loginRes.json();
  if (!loginRes.ok) {
    console.error('Login failed', loginData);
    process.exit(1);
  }
  const token = loginData.token;
  console.log('Token acquired:', !!token);

  // Connect to DB and assign dataset
  await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
  const User = require('../models/user');
  const user = await User.findOne({ email });
  if (!user) {
    console.error('User not found in DB after registration');
    process.exit(1);
  }

  console.log('Assigning dataset to user in DB...');
  user.assignedDatasets.push({ dataset: datasetId, status: 'pending', assignedAt: new Date(), evaluationCount: 0 });
  await user.save();
  console.log('Assigned. Calling PUT to mark completed...');

  const putRes = await fetch(`${API_BASE}/datasets/my/assigned/${datasetId}/status`, {
    method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ status: 'completed' })
  });
  const putData = await putRes.json();
  console.log('PUT response:', putRes.status, putData);

  console.log('Fetching assignments via GET...');
  const getRes = await fetch(`${API_BASE}/datasets/my/assigned`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const getData = await getRes.json();
  console.log('GET response:', getRes.status, JSON.stringify(getData, null, 2));

  // Also read from DB directly to show persisted value
  const freshUser = await User.findById(user._id);
  const assignment = freshUser.assignedDatasets.find(a => a.dataset.toString() === datasetId);
  console.log('DB assignment entry:', { status: assignment.status, completedAt: assignment.completedAt });

  process.exit(0);
}

main().catch(err => { console.error('Error', err); process.exit(1); });
