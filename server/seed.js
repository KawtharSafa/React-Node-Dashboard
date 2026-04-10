import { writeUsersToFile, readUsersFromFile } from "./utils/file.utils.js";
import { randomUUID } from "crypto"; // built-in Node.js — no install needed

const FIRST_NAMES = [
  "Alice",
  "Bob",
  "Charlie",
  "Diana",
  "Eve",
  "Frank",
  "Grace",
  "Hank",
  "Iris",
  "Jack",
  "Kate",
  "Leo",
  "Mia",
  "Noah",
  "Olivia",
  "Paul",
  "Quinn",
  "Rose",
  "Sam",
  "Tina",
  "Uma",
  "Vince",
  "Wendy",
];
const LAST_NAMES = [
  "Johnson",
  "Smith",
  "Brown",
  "Williams",
  "Jones",
  "Garcia",
  "Miller",
  "Davis",
  "Wilson",
  "Moore",
  "Taylor",
  "Anderson",
  "Thomas",
  "Jackson",
  "White",
  "Harris",
  "Martin",
  "Thompson",
  "Clark",
  "Lewis",
  "Walker",
  "Hall",
  "Young",
];
const JOB_TITLES = [
  "Engineer",
  "Designer",
  "Manager",
  "Developer",
  "Architect",
  "Lead",
  "Officer",
  "Intern",
];

const existingUsers = readUsersFromFile();

if (existingUsers.length > 0) {
  console.log(
    `⚠️  users.json already has ${existingUsers.length} users. Skipping seed.`,
  );
  console.log("    Delete users.json content first if you want to reseed.");
  process.exit(0);
}

const seededUsers = FIRST_NAMES.map((firstName, i) => {
  const email = `${firstName.toLowerCase()}.${LAST_NAMES[i].toLowerCase()}@example.com`;
  return {
    id: randomUUID(),
    firstName,
    lastName: LAST_NAMES[i],
    email,
    jobTitle: JOB_TITLES[i],
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
    createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(), // each user 1 day apart
  };
});

writeUsersToFile(seededUsers);
console.log(`✅ Seeded ${seededUsers.length} users into users.json`);
