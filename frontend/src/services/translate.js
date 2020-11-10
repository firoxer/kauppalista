const allTranslations = {
  english: {
    'add item': 'add item',
    'add to list': 'add to list',
    'are you sure you want to delete the list with one item': 'are you sure you want to delete the list "{}" with 1 item?',
    'are you sure you want to delete the list with multiple items': 'are you sure you want to delete the list "{}" with {} items?',
    'are you sure you want to delete the recipe with one item': 'are you sure you want to delete the recipe "{}" with 1 item?',
    'are you sure you want to delete the recipe with multiple items': 'are you sure you want to delete the recipe "{}" with {} items?',
    'delete': 'delete',
    'loading...': 'loading...',
    'name of list': 'name of list',
    'name of recipe': 'name of recipe',
    'no, take me back': 'no, take me back',
    'recipes': 'recipes',
    'recipes for list': 'recipes for list "{}"',
    'there are no items...': 'there are no items...',
    'there are no lists...': 'there are no lists... create a new one!',
    'there are no recipes...': 'there are no recipes... create a new one!',
    'to add a list, name it': 'to add a list, name it',
    'to add a recipe, name it': 'to add a recipe, name it',
    'yes': 'yes',
  },

  finnish: {
    'add item': 'lisää rivi',
    'add to list': 'listaan',
    'are you sure you want to delete the list with one item': 'oletko varma, että haluat poistaa listan "{}" jossa on 1 rivi?',
    'are you sure you want to delete the list with multiple items': 'oletko varma, että haluat poistaa listan "{}" jossa on {} riviä?',
    'are you sure you want to delete the recipe with one item': 'oletko varma, että haluat poistaa reseptin "{}" jossa on 1 rivi?',
    'are you sure you want to delete the recipe with multiple items': 'oletko varma, että haluat poistaa reseptin "{}" jossa on {} riviä?',
    'delete': 'poista',
    'loading...': 'ladataan...',
    'name of list': 'listan nimi',
    'name of recipe': 'reseptin nimi',
    'no, take me back': 'en, palaa takaisin',
    'recipes': 'reseptit',
    'recipes for list': '"{}"-listan reseptit',
    'there are no items...': 'ei rivejä...',
    'there are no lists...': 'listoja ei ole... luo uusi lista!',
    'there are no recipes...': 'reseptejä ei ole... luo uusi resepti!',
    'to add a list, name it': 'anna luomallesi listalle nimi',
    'to add a recipe, name it': 'anna luomallesi reseptille nimi',
    'yes': 'kyllä',
  },
};

const translations = navigator.languages[0] === 'fi' || navigator.languages[0] === 'fi-FI'
  ? allTranslations.finnish
  : allTranslations.english;

export function translate(slug, ...replacements) {
  if (!(slug in translations)) {
    console.error('missing translation', slug);
    return '[MISSING TRANSLATION]';
  }

  let translation = translations[slug];

  for (const replacement of replacements) {
    translation = translation.replace('{}', replacement);
  }

  return translation;
}
