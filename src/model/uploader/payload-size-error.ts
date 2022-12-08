export class PayloadSizeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FileTooLargerError';
  }
}
