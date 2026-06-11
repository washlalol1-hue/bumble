const firstNames = [
  'Emma', 'Olivia', 'Ava', 'Isabella', 'Sophia', 'Mia', 'Charlotte', 'Amelia',
  'Harper', 'Evelyn', 'Abigail', 'Emily', 'Elizabeth', 'Sofia', 'Avery',
  'Ella', 'Scarlett', 'Grace', 'Chloe', 'Victoria', 'Riley', 'Aria', 'Lily',
  'Aurora', 'Zoey', 'Nora', 'Hannah', 'Lily', 'Eleanor', 'Savannah',
  'Addison', 'Brooklyn', 'Leah', 'Lucy', 'Stella', 'Natalie', 'Zoe',
  'Penelope', 'Luna', 'Camila', 'Hazel', 'Violet', 'Nova', 'Ellie',
  'Madison', 'Willow', 'Paisley', 'Bella', 'Claire', 'Skylar'
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller',
  'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez',
  'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
  'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark',
  'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King',
  'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green',
  'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell',
  'Carter', 'Roberts'
];

export function generateRandomName(): { first: string; last: string } {
  const first = firstNames[Math.floor(Math.random() * firstNames.length)];
  const last = lastNames[Math.floor(Math.random() * lastNames.length)];
  return { first, last };
}

export function generateMultipleNames(count: number): { first: string; last: string }[] {
  const names: { first: string; last: string }[] = [];
  for (let i = 0; i < count; i++) {
    names.push(generateRandomName());
  }
  return names;
}
