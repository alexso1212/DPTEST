import { questions, type Dimension } from '../data/questions';
import { typeMapping, traderTypes, rankTiers, rarityMap, type TraderType, type RankTier } from '../data/traderTypes';

export interface QuizResult {
  rawScores: Record<Dimension, number>;
  normalizedScores: Record<Dimension, number>;
  traderType: TraderType;
  rank: RankTier;
  avgScore: number;
  rarity: string;
  top2: [Dimension, Dimension];
}

function computeMaxScores(): Record<Dimension, number> {
  const dims: Dimension[] = ['RISK', 'MENTAL', 'SYSTEM', 'ADAPT', 'EXEC', 'VISION'];
  const maxScores: Record<Dimension, number> = { RISK: 0, MENTAL: 0, SYSTEM: 0, ADAPT: 0, EXEC: 0, VISION: 0 };

  for (const q of questions) {
    for (const dim of dims) {
      let bestForDim = 0;
      for (const opt of q.options) {
        const val = opt.scores[dim] ?? 0;
        if (val > bestForDim) bestForDim = val;
      }
      maxScores[dim] += bestForDim;
    }
  }
  return maxScores;
}

const MAX_SCORES = computeMaxScores();

export function calculateResult(answers: number[]): QuizResult {
  const dims: Dimension[] = ['RISK', 'MENTAL', 'SYSTEM', 'ADAPT', 'EXEC', 'VISION'];
  const rawScores: Record<Dimension, number> = { RISK: 0, MENTAL: 0, SYSTEM: 0, ADAPT: 0, EXEC: 0, VISION: 0 };

  answers.forEach((choiceIndex, questionIndex) => {
    const question = questions[questionIndex];
    if (!question) return;
    const option = question.options[choiceIndex];
    if (!option) return;
    Object.entries(option.scores).forEach(([dim, val]) => {
      rawScores[dim as Dimension] += val;
    });
  });

  const normalizedScores: Record<Dimension, number> = { RISK: 0, MENTAL: 0, SYSTEM: 0, ADAPT: 0, EXEC: 0, VISION: 0 };
  for (const dim of dims) {
    normalizedScores[dim] = Math.min(100, Math.round((rawScores[dim] / MAX_SCORES[dim]) * 100));
  }

  const sorted = Object.entries(normalizedScores).sort((a, b) => b[1] - a[1]) as [Dimension, number][];
  const top2: [Dimension, Dimension] = [sorted[0][0], sorted[1][0]];
  const top2Key = [...top2].sort().join('');
  const typeCode = typeMapping[top2Key] || 'AE';
  const traderType = traderTypes[typeCode];

  const avgScore = Math.round(Object.values(normalizedScores).reduce((a, b) => a + b, 0) / 6);
  const rank = rankTiers.find(r => avgScore >= r.minScore && avgScore <= r.maxScore) || rankTiers[rankTiers.length - 1];
  const rarity = rarityMap[typeCode] || '10%';

  return {
    rawScores,
    normalizedScores,
    traderType,
    rank,
    avgScore,
    rarity,
    top2,
  };
}
