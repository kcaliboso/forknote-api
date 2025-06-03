interface ApiResponse<T> {
  data?: T | null;
  status: "success" | "fail";
  results?: number;
  message?: string;
  details?: [];
}

export default ApiResponse;
