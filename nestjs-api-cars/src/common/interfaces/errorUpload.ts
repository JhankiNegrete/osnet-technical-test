export interface ErrorUploadRow {
  row: number;
  errors: ErrorUpload[];
}

export interface ErrorUpload {
  column: string;
  error: string;
}
