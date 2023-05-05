
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

export function videoFileToWord(videoFile: string): string {
  return videoFile.replace('.mp4', '').replaceAll('-', '').replaceAll('_', ' ');
}

export function soundFileToWord(soundFile: string): string {
  return soundFile.replace('.mp3', '').replaceAll('-', '').replaceAll('_', ' ');
}