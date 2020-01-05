// noinspection JSUnusedGlobalSymbols
/**
 * 非法参数错误
 */
export class IllegalArgumentException extends Error {
    constructor(message: string = "非法参数") {
        super(message);
    }
}