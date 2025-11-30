/**
 * 非法参数错误
 *
 * @public
 */
export class IllegalArgumentException extends Error {
  constructor(message?: string) {
    super(message);
  }
}
