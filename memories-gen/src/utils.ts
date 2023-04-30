
export function getRandomInt(max: number): number {
  return Math.floor(Math.random() * max);
}

export function fillWithRandom(max: number, iteration: number) : number[] {
  const randomNumbers: number[] = [];
  while (randomNumbers.length < iteration) {
    const random = getRandomInt(max);
    if (!randomNumbers.includes(random)) {
      randomNumbers.push(random);
    }
  }
  return randomNumbers;
}