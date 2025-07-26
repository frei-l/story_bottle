import notesData from '@/components/notes-data';

export interface RandomNote {
  index: number;
  emotion: string;
  content: string;
  originalData: typeof notesData[0];
}

export function getRandomNotes(count: number = 3): RandomNote[] {
  const shuffled = [...notesData]
    .map((item, index) => ({ item, index }))
    .sort(() => 0.5 - Math.random());
  
  return shuffled.slice(0, count).map(({ item, index }) => ({
    index,
    emotion: item.emotion,
    content: `${item.content.slice(0, 14)}...`,
    originalData: item
  }));
}