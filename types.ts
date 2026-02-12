export enum Level {
  L1 = 1,
  L2 = 2,
  L3 = 3,
  L4 = 4,
}

export interface WorksheetDataBase {
  word: string;
  koreanMeaning: string;
  partOfSpeech?: string;
  ipa: string;
  phoneticSpelling: string;
}

export interface WorksheetDataL1 extends WorksheetDataBase {
  wordRepetitions: [string, string, string];
  exampleSentences: string[];
  changedSentence: string;
  ownSimpleSentence: string;
  usageExamples: string;
}

export interface WorksheetDataL2 extends WorksheetDataBase {
  definition: string;
  simpleSentences: [string, string];
  grammarConversions: string[];
  usageContext: string;
  usageExamples: string;
}

export interface WorksheetDataL3 extends WorksheetDataBase {
  definition: string;
  exampleSentence: string;
  realLifeSentence: string;
  shortParagraph: string;
  usageContext: string;
  synonyms: string[];
  antonyms: string[];
  grammarConversions: string[];
}

export interface WorksheetDataL4 extends WorksheetDataBase {
  definition: string;
  realLifeSentence: string;
  grammarConversions: string[];
  miniParagraph: string;
  usageContext: string;
  synonyms: string[];
  antonyms: string[];
  selfCheck: string;
}

export type WorksheetData = WorksheetDataL1 | WorksheetDataL2 | WorksheetDataL3 | WorksheetDataL4;

export interface SavedWorksheet {
  id: number;
  word: string;
  level: Level;
  data: WorksheetData;
  image: string | null;
}