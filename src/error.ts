export class CodedError extends Error {
  public readonly code?: number | string;
  constructor(message?: string, code?: number | string) {
    super(message);
    this.code = code;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
