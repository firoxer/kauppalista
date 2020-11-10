import 'https://unpkg.com/fast-levenshtein@2.0.6/levenshtein.js';

const DEFAULT_MAX_FUZZY_CHARACTERS = 2;
const DEFAULT_MAX_SUGGESTIONS = 5;

function validate(input, choices, options) {
  if (typeof input !== 'string') {
    throw new Error('Input must be a string');
  }
  if (!Array.isArray(choices) || choices.find(x => typeof x !== 'string')) {
    throw new Error('Suggestion choices must be an array of strings');
  }
  if (typeof options !== 'object') {
    throw new Error('Options must be an object');
  }

  if ('maxFuzzyCharacters' in options) {
    if (typeof options.maxFuzzyCharacters !== 'number' || options.maxFuzzyCharacters < 0) {
      throw new Error('options.maxFuzzyCharacters must be a positive integer');
    }
  }
  if ('maxSuggestions' in options) {
    if (typeof options.maxSuggestions !== 'number' || options.maxSuggestions < 0) {
      throw new Error('options.maxSuggestion must be a positive integer');
    }
  }
}

export function autocomplete(input, choices, options = {}) {
  validate(input, choices, options);

  if (!('maxFuzzyCharacters' in options)) {
    options.maxFuzzyCharacters = DEFAULT_MAX_FUZZY_CHARACTERS;
  }
  if (!('maxSuggestions' in options)) {
    options.maxSuggestions = DEFAULT_MAX_SUGGESTIONS;
  }

  const choicesWithFreqs =
    choices.reduce((xs, x) => {
      if (!(x in xs)) {
        xs[x] = { choice: x, count: 0 };
      }
      xs[x].count += 1;
      return xs;
    }, {});

  const suggestions =
    // Suggestions whose prefix match exactly, sorted by frequency and length
    Object.values(choicesWithFreqs)
      .filter(({ choice }) => choice.startsWith(input))
      .sort((a, b) => {
        const n = b.count - a.count;
        if (n !== 0) {
          return n;
        }
        return a.choice.length - b.choice.length;
      })
      .map(x => x.choice)
      .slice(0, options.maxSuggestions);

  if (suggestions.length < options.maxSuggestions) {
    // Suggestions whose prefix may be a bit different, sorted by similarity and length
    suggestions.push(
      ...Object.values(choicesWithFreqs)
        .map(({ choice }) => ({
          choice,
          distance: window.Levenshtein.get(input, choice.slice(0, input.length)),
        }))
        .filter(x => x.distance <= options.maxFuzzyCharacters)
        .filter(x => x.distance < x.choice.length) // To prune silly suggestions
        .sort((a, b) => {
          const n = a.distance - b.distance;
          if (n !== 0) {
            return n;
          }
          return a.choice.length - b.choice.length;
        })
        .map(x => x.choice)
        .filter(choice => !suggestions.includes(choice))
        .slice(0, options.maxSuggestions - suggestions.length)
    );
  }

  return suggestions;
}