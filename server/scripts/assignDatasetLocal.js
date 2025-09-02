require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/user');

const mongoURI = 'mongodb+srv://DCPUser:m0bex47d7rLeGpTj@cluster0.mmx82lq.mongodb.net/DCP-ITCR?retryWrites=true&w=majority&appName=Cluster0';

async function main() {
  await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB');

  const email = 'autotest_local@example.com';
  const datasetId = '68af5d46d9eae6100a8a6fc8'; // existing dataset from DB

  const user = await User.findOne({ email });
  if (!user) {
    console.error('User not found:', email);
    process.exit(1);
  }

  // Check if already assigned
  const exists = user.assignedDatasets.find(a => a.dataset && a.dataset.toString() === datasetId);
  if (exists) {
    console.log('Dataset already assigned to user');
    process.exit(0);
  }

  user.assignedDatasets.push({
    dataset: datasetId,
    status: 'pending',
    assignedAt: new Date(),
    evaluationCount: 0
  });

  await user.save();
  console.log('Dataset assigned successfully to', email);
  process.exit(0);
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
