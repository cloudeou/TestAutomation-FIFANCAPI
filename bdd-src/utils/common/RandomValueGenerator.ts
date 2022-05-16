import { StringUtils } from './StringUtils';

const supportedRandomKeywords = [
  "${RANDOMALNUM",
  "${RANDOMALPHA",
  "${RANDOMNUM",
];

export class RandomValueGenerator {
  /**
   * @description Generates random string for given string and returns
   * if empty; it would generate any random string
   * @param {String} str Specifies string in which random value would be placed;
   */
  static generateValueFor(str: string): string {
    try {
      if (
        !StringUtils.isEmpty(str) &&
        StringUtils.containsIgnoreCaseAny(str, supportedRandomKeywords)
      ) {
        const rndType = StringUtils.substringBetweenIgnoreCase(
          str,
          "${RANDOM",
          "#"
        );
        const rndKeyword = `\${RANDOM${rndType}#`;
        let len =
          StringUtils.substringBetweenIgnoreCase(str, rndKeyword, "}").length;
        if (len < 0) len = 5;

        let rndStr = '';

        switch (rndType.toUpperCase()) {
          case "ALPHA":
            rndStr = this.generateRandomAlphabetic(len);
            break;
          case "ALPHANUM":
            rndStr = this.generateRandomAlphaNumeric(len);
            break;
          case "NUM":
            rndStr = this.generateNumeric(len);
            break;
          default:
            break;
        }

        const genValue = StringUtils.replaceString(
          str,
          `${rndKeyword + len}}`,
          rndStr
        );

        // Call recursively to generate and replace random strings
        return this.generateValueFor(genValue);
      }
    } catch (err) {
    }
    return str;
  }

  /**
   * @description Generates numeric string of given length; by default of length = 5
   * @param {Number} len Specifies length of random string to be generated; default = 5
   */
  static generateNumeric(len: number) {
    const numbers = "0123456789";

    return this.generateRandom(numbers, len);
  }

  /**
   * @description Generates alphabetic string of given length; by default of length = 5
   * @param {Number} len Specifies length of random string to be generated; default = 5
   */
  static generateRandomAlphabetic(len: number) {
    const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    return this.generateRandom(alphabets, len);
  }

  /**
   * @description Generates alphanumeric string of given length; by default of length = 5
   * @param {Number} len Specifies length of random string to be generated; default = 5
   */
  static generateRandomAlphaNumeric(len: number) {
    const alphaNumChars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    return this.generateRandom(alphaNumChars, len);
  }

  /**
   * @description Generates random string of given length from given characters; by default of length = 5
   * @param {Number} chars Specifies list of characters to be used in random string generation
   * @param {Number} len Specifies length of random string to be generated; default = 5
   */
  static generateRandom(chars: any, len: number) {
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
    return result;
  }

  static getRandomInt(min: any, max: any) {
    return min + Math.floor(Math.random() * (max - min + 1));
  }
}
