interface ResponseMeta {
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  pagingCounter: number;
}

interface ApiResponse<T> {
  token?: string;
  data?: T | null;
  status: "success" | "fail";
  results?: number;
  message?: string;
  details?: [];
  meta?: ResponseMeta;
}

export default ApiResponse;
