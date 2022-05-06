import { StringUtils } from "./StringUtils"

export class RandomValueGenerator {

    static generateRandom(chars: any, len: any) {
        if (len == null || len === undefined || len * 1 <= 0) {
          len = 5;
        }
        if (StringUtils.isEmpty(chars)) {
          chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        }
        let result = "";
        for (let i = 0; i < len; i++) {
          result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
    
        console.log(`Generated random string: ${result}`);
        return result;
      }

    static generateRandomAlphaNumeric(len: any) {
        const alphaNumChars =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    
        return this.generateRandom(alphaNumChars, len);
      }

    static getRandomInt(min: number, max: number) {
        // min is included and max is excluded
        return Math.floor(Math.random() * (max - min)) + min;
      }
}