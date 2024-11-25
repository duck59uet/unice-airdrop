import { isNil, omitBy } from 'lodash';
import { PathLike } from 'node:fs';
import { FileHandle, readFile } from 'node:fs/promises';
import { UserInfoDto } from '../modules/auth/dto';
import { AuthService } from '../modules/auth/auth.service';
import { CustomError } from '../common/custom-error';
import { ErrorMap } from '../common/error.map';
import { plainToInstance } from 'class-transformer';


export class CommonUtil {
  /**
   * jsonReader
   * @param filePath
   * @returns
   */
  static async jsonReader<T>(filePath: PathLike | FileHandle): Promise<T> {
    const content = await readFile(filePath, 'utf8');
    const object = JSON.parse(content) as T;
    return object;
  }

  /**
   * getStrProp https://stackoverflow.com/a/70031969/8461456
   * @param o
   * @param prop
   * @returns
   */
  public static getStrProp(o: unknown, prop: string): string {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const p = (o as any)[prop];
      if (typeof p === 'string') {
        return p;
      }
    } catch {
      // ignore
    }
    return undefined;
  }

  /**
   * https://stackoverflow.com/a/54974076/8461456
   * @param arr
   * @returns boolean
   */
  public static checkIfDuplicateExists(arr: unknown[]): boolean {
    return new Set(arr).size !== arr.length;
  }

  /**
   *
   * @param strArr
   * @returns string[]
   */
  public filterEmptyInStringArray(strArr: string[]): string[] {
    return strArr.filter((e) => e !== '');
  }

  omitByNil = (obj: unknown) => omitBy(obj, isNil);

  getAuthInfo(): UserInfoDto {
    const currentUser = AuthService.getAuthUser();
    if (!currentUser) throw new CustomError(ErrorMap.UNAUTHRORIZED);
    return plainToInstance(UserInfoDto, currentUser);
  }
}
