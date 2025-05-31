interface ApiResponse<T> {
  data?: T | null;
  status: "success" | "fail";
  results?: number;
  message?: string;
}

export default ApiResponse;
