/* eslint-disable prettier/prettier */
/**
 * @publicApi
 */
export abstract class DataHashProvider {
  /**
   * Hash a given string.
   *
   * @param data - The string data to be hashed.
   * @returns A promise that resolves to the hashed string.
   */
  abstract hash(data: string): Promise<string>;

  /**
   * Compares provided string with hashed one.
   *
   * @param data - The string data to be compared.
   * @param hashed - The hashed string data for comparison.
   * @returns A promise resolving to a boolean indicating if data and hashed match.
   */
  abstract compare(data: string, hashed: string): Promise<boolean>;
}
