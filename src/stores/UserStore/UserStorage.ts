/* eslint-disable @typescript-eslint/no-empty-function */
export default abstract class UserStorage {
  abstract save(token: string): void;

  abstract remove(): void;

  abstract get(): Promise<string | null>;

  useUpdateToken(func: (token?: string) => void) {}

  abstract getAvatar(): Promise<string | null>;

  abstract removeAvatar(): void;

  abstract saveAvatar(value: string): void;
}
