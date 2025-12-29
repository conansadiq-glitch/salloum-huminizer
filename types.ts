
export interface AnalysisResult {
  humanScore: number;
  aiScore: number;
  readability: string;
  reasons: string[];
}

export interface HumanizedOutput {
  originalText: string;
  transformedText: string;
  originalAnalysis: AnalysisResult;
  transformedAnalysis: AnalysisResult;
}

export enum AppStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  HUMANIZING = 'HUMANIZING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}
