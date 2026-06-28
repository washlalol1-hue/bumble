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
  'Kinsley', 'Delilah', 'Morgan', 'Clara', 'Jasmine', 'Melody',
  'Autumn', 'Genesis', 'Emilia', 'Kaylee', 'Anna', 'Madelyn', 'Hailey',
  'Caroline', 'Sarah', 'Alexis', 'Samantha', 'Ashley', 'Alyssa', 'Brianna',
];

export function generateRandomName(): string {
  return girlNames[Math.floor(Math.random() * girlNames.length)];
}

export function generateMultipleNames(count: number): string[] {
  const names: string[] = [];
  const used = new Set<string>();
  for (let i = 0; i < count; i++) {
    let name = girlNames[Math.floor(Math.random() * girlNames.length)];
    while (used.has(name) && used.size < girlNames.length) {
      name = girlNames[Math.floor(Math.random() * girlNames.length)];
    }
    used.add(name);
    names.push(name);
  }
  return names;
}

export function generateRandomAge(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
