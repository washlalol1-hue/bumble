const girlNames = [
  'Emma', 'Olivia', 'Ava', 'Isabella', 'Sophia', 'Mia', 'Charlotte', 'Amelia',
  'Harper', 'Evelyn', 'Abigail', 'Emily', 'Elizabeth', 'Sofia', 'Avery',
  'Ella', 'Scarlett', 'Grace', 'Chloe', 'Victoria', 'Riley', 'Aria', 'Lily',
  'Aurora', 'Zoey', 'Nora', 'Hannah', 'Eleanor', 'Savannah',
  'Addison', 'Brooklyn', 'Leah', 'Lucy', 'Stella', 'Natalie', 'Zoe',
  'Penelope', 'Luna', 'Camila', 'Hazel', 'Violet', 'Nova', 'Ellie',
  'Madison', 'Willow', 'Paisley', 'Bella', 'Claire', 'Skylar',
  'Layla', 'Naomi', 'Aaliyah', 'Ruby', 'Eva', 'Ivy', 'Sadie',
  'Aubrey', 'Jade', 'Maya', 'Piper', 'Ariana', 'Valentina', 'Kennedy',
  'Kinsley', 'Delilah', 'Morgan', 'Clara', 'Jasmine', 'Melody'
];

export function generateRandomName(): { first: string } {
  const first = girlNames[Math.floor(Math.random() * girlNames.length)];
  return { first };
}

export function generateMultipleNames(count: number): { first: string }[] {
  const names: { first: string }[] = [];
  const used = new Set<string>();
  for (let i = 0; i < count; i++) {
    let name = girlNames[Math.floor(Math.random() * girlNames.length)];
    // Avoid duplicates in preview
    while (used.has(name) && used.size < girlNames.length) {
      name = girlNames[Math.floor(Math.random() * girlNames.length)];
    }
    used.add(name);
    names.push({ first: name });
  }
  return names;
}
