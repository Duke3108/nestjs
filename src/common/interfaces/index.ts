export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  date?: Date | string;
  path?: string;
  takenTime?: string;
}

export interface MailJobData {
  email: string;
  subject: string;
  html?: string;
  template?: string;
  context?: Record<string, string | number | boolean>;
}
