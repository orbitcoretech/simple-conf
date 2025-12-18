// Placeholder types - to be expanded in future stories

export interface HealthResponse {
  status: 'ok' | 'error';
}

export interface ApiError {
  message: string;
  code?: string;
}
