// From https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-arr
export function shuffle(arr) {
  let currentIndex = arr.length;
  let randomIndex;
  let temp;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temp = arr[currentIndex];
    arr[currentIndex] = arr[randomIndex];
    arr[randomIndex] = temp;
  }

  return arr;
}