/* eslint-disable prettier/prettier */
import * as argon2 from 'argon2';
import { DataHashProvider } from '../data-hash.provider';

export class Argon2DataHashProvider implements DataHashProvider {
  async hash(data: string): Promise<string> {
    const hashed = await argon2.hash(data);
    return hashed;
  }

  async compare(data: string, hashed: string): Promise<boolean> {
    const test = await argon2.verify(hashed, data);
    return test;
  }
}
