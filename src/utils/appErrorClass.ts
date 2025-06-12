export class AppErrorClass extends Error {
  public statusCode: number;
  public status: string;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;

    this.status = statusCode.toString().startsWith("4") ? "fail" : "error";
    Error.captureStackTrace(this, this.constructor);
  }
}
