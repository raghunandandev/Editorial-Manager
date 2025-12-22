// scripts/seedEditorial.js
// Run with: node scripts/seedEditorial.js
const mongoose = require('mongoose');
const config = require('../config/env');
const EditorialMember = require('../models/EditorialMember');

const sampleEditorialData = [
  {
    name: "Professor F. Xhafa",
    affiliation: "Universitat Politècnica de Catalunya, Barcelona, Spain",
    email: "f.xhafa@upc.edu",
    expertise: ["Distributed Systems", "IoT", "Cloud Computing"],
    image: "https://via.placeholder.com/150?text=Prof+Xhafa",
    role: "editor-in-chief",
    isPublic: true
  },
  {
    name: "Prof. Sarah Chen",
    affiliation: "Massachusetts Institute of Technology, USA",
    email: "s.chen@mit.edu",
    expertise: ["Edge Computing", "IoT Security", "Machine Learning"],
    image: "https://via.placeholder.com/150?text=Prof+Chen",
    role: "editor",
    isPublic: true
  },
  {
    name: "Prof. Michael Zhang",
    affiliation: "University of Cambridge, UK",
    email: "m.zhang@cam.ac.uk",
    expertise: ["Wireless Sensor Networks", "IoT Protocols", "Network Optimization"],
    image: "https://via.placeholder.com/150?text=Prof+Zhang",
    role: "editor",
    isPublic: true
  },
  {
    name: "Prof. Maria Garcia",
    affiliation: "Technical University of Madrid, Spain",
    email: "m.garcia@upm.es",
    expertise: ["Smart Cities", "Sustainable IoT", "Urban Computing"],
    image: "https://via.placeholder.com/150?text=Prof+Garcia",
    role: "editor",
    isPublic: true
  },
  {
    name: "Prof. Robert Brown",
    affiliation: "ETH Zurich, Switzerland",
    email: "r.brown@ethz.ch",
    expertise: ["Industrial IoT", "Cybersecurity", "Blockchain"],
    image: "https://via.placeholder.com/150?text=Prof+Brown",
    role: "editor",
    isPublic: true
  },
  {
    name: "Prof. Emily Davis",
    affiliation: "National University of Singapore, Singapore",
    email: "e.davis@nus.edu.sg",
    expertise: ["IoT Applications", "Healthcare IoT", "Wearable Devices"],
    image: "https://via.placeholder.com/150?text=Prof+Davis",
    role: "editor",
    isPublic: true
  },
  {
    name: "Prof. Christopher Lee",
    affiliation: "University of Tokyo, Japan",
    email: "c.lee@u-tokyo.ac.jp",
    expertise: ["5G Networks", "IoT Communication", "Network Protocols"],
    image: "https://via.placeholder.com/150?text=Prof+Lee",
    role: "editor",
    isPublic: true
  },
  {
    name: "Prof. John Smith",
    affiliation: "Stanford University, USA",
    expertise: ["IoT Architecture", "Distributed Systems"],
    role: "advisory",
    isPublic: true
  },
  {
    name: "Prof. Lisa Wang",
    affiliation: "Tsinghua University, China",
    expertise: ["AIoT", "Edge Intelligence"],
    role: "advisory",
    isPublic: true
  },
  {
    name: "Prof. David Martinez",
    affiliation: "University of California, Berkeley, USA",
    expertise: ["IoT Security", "Privacy"],
    role: "advisory",
    isPublic: true
  }
];

async function seedEditorial() {
  try {
    await mongoose.connect(config.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB');

    // Clear existing data (optional - comment out to preserve)
    await EditorialMember.deleteMany({});
    console.log('🗑️ Cleared existing editorial members');

    // Insert sample data
    const inserted = await EditorialMember.insertMany(sampleEditorialData);
    console.log(`✅ Inserted ${inserted.length} editorial members`);

    // Log summary
    const editorInChief = await EditorialMember.findOne({ role: 'editor-in-chief' });
    const editors = await EditorialMember.countDocuments({ role: 'editor' });
    const advisory = await EditorialMember.countDocuments({ role: 'advisory' });

    console.log('\n📊 Summary:');
    console.log(`  - Editor-in-Chief: ${editorInChief ? editorInChief.name : 'None'}`);
    console.log(`  - Associate Editors: ${editors}`);
    console.log(`  - Advisory Board: ${advisory}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
}

seedEditorial();
