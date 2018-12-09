export class CodedError extends Error {
  public readonly code?: any;
  public readonly data?: any;
  constructor(message?: string, code?: any, data?: any) {
    super(message);
    this.code = code;
    this.data = data;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
