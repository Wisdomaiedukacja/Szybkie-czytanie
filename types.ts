
export enum AppView {
  DASHBOARD = 'DASHBOARD',
  SPEED_TEST = 'SPEED_TEST',
  PERIPHERAL_GRID = 'PERIPHERAL_GRID',
  FLASH_WORDS = 'FLASH_WORDS',
  SCHULTE_TABLE = 'SCHULTE_TABLE',
  RSVP = 'RSVP',
  RSVP_WALL = 'RSVP_WALL',
  COLUMN_READING = 'COLUMN_READING',
  VIEW_FIELD_TEST = 'VIEW_FIELD_TEST'
}

export interface ReadingTestContent {
  text: string;
  questions: {
    question: string;
    options: string[];
    correctAnswer: number;
  }[];
}

export interface TestResult {
  wpm: number;
  comprehension: number;
  timestamp: number;
}
