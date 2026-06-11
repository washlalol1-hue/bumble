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
  'always': ['constantly', 'forever', 'endlessly', 'perpetually'],
  'really': ['truly', 'genuinely', 'absolutely', 'definitely'],
  'very': ['incredibly', 'extremely', 'super', 'quite'],
  'beautiful': ['gorgeous', 'stunning', 'lovely', 'breathtaking'],
};

const fillerPhrases = [
  'Not gonna lie,',
  'Honestly,',
  'If you ask me,',
  'Just being real here,',
  'Truth be told,',
  'At the end of the day,',
  'For what it\'s worth,',
];

const endingPhrases = [
  'Let\'s see where things go!',
  'Life is too short not to try.',
  'Swipe right if you agree!',
  'Always open to new adventures.',
  'The best is yet to come.',
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

function shuffleSentences(text: string): string {
  const sentences = text.split(/(?<=[.!?])\s+/).filter(s => s.trim());
  if (sentences.length <= 1) return text;
  
  for (let i = sentences.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [sentences[i], sentences[j]] = [sentences[j], sentences[i]];
  }
  
  return sentences.join(' ');
}

export function rewriteBio(bio: string): string {
  let result = bio;
  
  // Apply synonym replacement
  result = replaceSynonyms(result);
  
  // Shuffle sentences with 50% chance
  if (Math.random() > 0.5) {
    result = shuffleSentences(result);
  }
  
  // Add or replace filler phrase with 40% chance
  if (Math.random() > 0.6) {
    const filler = fillerPhrases[Math.floor(Math.random() * fillerPhrases.length)];
    result = `${filler} ${result}`;
  }
  
  // Add ending phrase with 30% chance
  if (Math.random() > 0.7) {
    const ending = endingPhrases[Math.floor(Math.random() * endingPhrases.length)];
    result = `${result} ${ending}`;
  }
  
  return result;
}
