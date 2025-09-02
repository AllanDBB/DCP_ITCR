require('dotenv').config();
const fetch = require('node-fetch');
const mongoose = require('mongoose');

const API_BASE = 'http://127.0.0.1:5000/api';
const mongoURI = process.env.MONGO_URI || 'mongodb+srv://DCPUser:m0bex47d7rLeGpTj@cluster0.mmx82lq.mongodb.net/DCP-ITCR?retryWrites=true&w=majority&appName=Cluster0';

async function main() {
  const datasetId = '68af5d46d9eae6100a8a6fc8';
  const timestamp = Date.now();
  const email = `autotest_flow_${timestamp}@example.com`;
  const password = 'test1234';

  console.log('Registering user:', email);
  let res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'flowuser', email, password })
  });
  let data = await res.json();
  if (!res.ok) { console.error('Register failed', data); process.exit(1); }
  console.log('Registered');

  // connect to DB and assign dataset directly
  await mongoose.connect(mongoURI);
  const User = require('../models/user');
  const user = await User.findOne({ email });
  if (!user) { console.error('User missing in DB'); process.exit(1); }
  user.assignedDatasets.push({ dataset: datasetId, status: 'pending', assignedAt: new Date(), evaluationCount: 0 });
  await user.save();
  console.log('Assigned dataset in DB');

  // login to get token
  res = await fetch(`${API_BASE}/auth/login`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ email, password }) });
  data = await res.json();
  if (!res.ok) { console.error('Login failed', data); process.exit(1); }
  const token = data.token;
  console.log('Logged in, token:', !!token);

  // create a label (completed)
  const labelPayload = { datasetId, changePoints: [], noChangePoints: true, confidence: 0.8, timeSpent: 10 };
  res = await fetch(`${API_BASE}/labels`, { method: 'POST', headers: { 'Content-Type':'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(labelPayload) });
  data = await res.json();
  console.log('Create label response', res.status, data);

  // get assignments
  res = await fetch(`${API_BASE}/datasets/my/assigned`, { headers: { 'Authorization': `Bearer ${token}` } });
  data = await res.json();
  console.log('Get assignments', res.status, JSON.stringify(data, null, 2));

  // also check DB assignment
  const freshUser = await User.findById(user._id);
  const assignment = freshUser.assignedDatasets.find(a => a.dataset.toString() === datasetId);
  console.log('DB assignment:', { status: assignment.status, completedAt: assignment.completedAt });

  process.exit(0);
}

main().catch(err => { console.error('Error', err); process.exit(1); });
