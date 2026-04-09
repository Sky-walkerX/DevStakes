/**
 * Calculate the total score based on various gameplay factors.
 */
export function calculateScore({
  evidenceDiscovered = 0,
  connectionsMade = 0,
  timeRemaining = 0,
  isCorrect = false,
}) {
  const evidencePoints = evidenceDiscovered * 100;
  const connectionPoints = connectionsMade * 75;
  const timeBonus = Math.floor(timeRemaining * 0.5);
  const accuracyBonus = isCorrect ? 500 : 0;
  const total = evidencePoints + connectionPoints + timeBonus + accuracyBonus;

  return {
    evidencePoints,
    connectionPoints,
    timeBonus,
    accuracyBonus,
    total,
    grade: getGrade(total, isCorrect),
  };
}

function getGrade(score, isCorrect) {
  if (!isCorrect) return { label: 'F', color: '#EF4444', message: 'Wrong suspect — the culprit escapes.' };
  if (score >= 1200) return { label: 'S', color: '#F59E0B', message: 'Master Detective — flawless.' };
  if (score >= 900) return { label: 'A', color: '#10B981', message: 'Excellent work, Inspector.' };
  if (score >= 600) return { label: 'B', color: '#6366F1', message: 'Well done, case closed.' };
  if (score >= 300) return { label: 'C', color: '#8B5CF6', message: 'Case solved, but barely.' };
  return { label: 'D', color: '#EF4444', message: 'Lucky guess.' };
}
