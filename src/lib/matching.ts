import type { MatchingItem, Question } from '@/types';

export interface MatchingPair {
  id: string;
  left: MatchingItem;
  right: MatchingItem;
}

function hasContent(item: MatchingItem): boolean {
  return typeof item === 'string'
    ? item.trim().length > 0
    : Boolean(item && (item.text?.trim() || item.image?.trim()));
}

export function normalizeMatchingPairs(question: Question): { pairs: MatchingPair[]; error?: string } {
  const source = question.pairItems;
  if (!source || source.length < 2) {
    return { pairs: [], error: 'Кемінде екі жұп қажет.' };
  }

  const pairs = source.map((pair, index) => ({
    id: pair.id || `${question.id}-${index}`,
    left: pair.left,
    right: pair.right,
  }));
  if (pairs.some((pair) => !pair.id.trim() || !hasContent(pair.left) || !hasContent(pair.right))) {
    return { pairs: [], error: 'Жұптың сол немесе оң элементі бос.' };
  }
  if (new Set(pairs.map((pair) => pair.id)).size !== pairs.length) {
    return { pairs: [], error: 'Жұп идентификаторлары қайталанады.' };
  }
  return { pairs };
}

export function shuffledMatchingPairs(pairs: MatchingPair[], questionId: string): MatchingPair[] {
  const shuffled = [...pairs];
  let seed = Array.from(questionId).reduce((value, char) => (value * 31 + char.charCodeAt(0)) >>> 0, 1);
  for (let index = shuffled.length - 1; index > 0; index--) {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    const swapIndex = seed % (index + 1);
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  if (shuffled.every((pair, index) => pair.id === pairs[index].id)) {
    shuffled.push(shuffled.shift()!);
  }
  return shuffled;
}
