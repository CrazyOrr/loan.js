/**
 * 非法参数错误
 */
export class IllegalArgumentException extends Error {
  constructor(message?: string) {
    super(message);
  }
}
