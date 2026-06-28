const synonyms: Record<string, string[]> = {
  'love': ['adore', 'enjoy', 'am passionate about', 'appreciate'],
  'like': ['enjoy', 'appreciate', 'am fond of', 'am into'],
  'enjoy': ['love', 'appreciate', 'find joy in', 'like'],
  'happy': ['joyful', 'cheerful', 'delighted', 'content'],
  'fun': ['exciting', 'enjoyable', 'entertaining', 'thrilling'],
  'good': ['great', 'wonderful', 'amazing', 'fantastic'],
  'great': ['amazing', 'wonderful', 'fantastic', 'excellent'],
  'looking': ['searching', 'hoping', 'seeking', 'on the hunt'],
  'want': ['desire', 'hope to find', 'am looking for', 'seek'],
  'travel': ['explore', 'adventure', 'see the world', 'wander'],
  'food': ['cuisine', 'cooking', 'culinary experiences', 'good eats'],
  'music': ['tunes', 'melodies', 'beats', 'sounds'],
  'movies': ['films', 'cinema', 'shows', 'the big screen'],
  'friends': ['people', 'connections', 'company', 'companions'],
  'life': ['journey', 'adventure', 'experience', 'world'],
  'work': ['career', 'profession', 'hustle', 'craft'],
};

const fillerPhrases = [
  'Not gonna lie,',
  'Honestly,',
  'If you ask me,',
  'Just being real here,',
  'Truth be told,',
];

const endingPhrases = [
  'Let\'s see where things go!',
  'Swipe right if you agree!',
  'Always open to new adventures.',
  'The best is yet to come.',
  'Life\'s too short, let\'s vibe.',
];

function replaceSynonyms(text: string): string {
  let result = text;
  const words = Object.keys(synonyms);
  for (const word of words) {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    if (regex.test(result)) {
      const options = synonyms[word];
      const replacement = options[Math.floor(Math.random() * options.length)];
      result = result.replace(regex, replacement);
    }
  }
  return result;
}

export function rewriteBio(bio: string): string {
  let result = replaceSynonyms(bio);

  if (Math.random() > 0.6) {
    const filler = fillerPhrases[Math.floor(Math.random() * fillerPhrases.length)];
    result = `${filler} ${result}`;
  }

  if (Math.random() > 0.7) {
    const ending = endingPhrases[Math.floor(Math.random() * endingPhrases.length)];
    result = `${result} ${ending}`;
  }

  return result;
}
