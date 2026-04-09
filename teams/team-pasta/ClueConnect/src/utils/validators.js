/**
 * Validate whether the accused suspect is the correct one.
 */
export function validateAccusation(accusedSuspectId, correctSuspectId) {
  return accusedSuspectId === correctSuspectId;
}

/**
 * Check if there's enough evidence to make an accusation.
 */
export function canMakeAccusation(discoveredEvidenceIds = [], minRequired = 2) {
  return discoveredEvidenceIds.length >= minRequired;
}

/**
 * Check if two evidence items have a valid canonical connection.
 */
export function isValidConnection(fromEvidenceId, toEvidenceId, caseData) {
  const evidence = caseData?.evidence.find((e) => e.id === fromEvidenceId);
  return evidence?.connectsTo?.includes(toEvidenceId) ?? false;
}
