export type RNote = {
  resultsWIDTH: number;
  termTurn: number;
  termIncremental: number;
  value: number;
  valueMax: number;
  valueMaxTurnBegin: number;
  valueMaxTurnEnd: number;
};

const updateRNoteValues = (
  rNote: RNote,
  results: FixedLengthArray<number, 6>[]
) => {
  let resultsLength = results.length;
  if (resultsLength > rNote.resultsWIDTH) {
    rNote.termIncremental =
      results[resultsLength - 1][2] -
      results[resultsLength - 1 - rNote.resultsWIDTH][2];
    if (rNote.termIncremental > 0) {
      rNote.termTurn =
        results[resultsLength - 1][0] -
        results[resultsLength - 1 - rNote.resultsWIDTH][0];
      rNote.value = rNote.termIncremental / rNote.termTurn;
      if (rNote.value > rNote.valueMax) {
        rNote.valueMax = rNote.value;
        rNote.valueMaxTurnBegin =
          results[resultsLength - 1 - rNote.resultsWIDTH][0];
        rNote.valueMaxTurnEnd = results[resultsLength - 1][0];
      }
    }
  }
  return rNote;
};

export const updateRNote = (
  currentRNote: RNote,
  results: FixedLengthArray<number, 6>[]
): RNote => {
  const rNote = updateRNoteValues(currentRNote, results);

  return rNote;
};