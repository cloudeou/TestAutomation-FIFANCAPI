export class StringUtils {
    /**
   *
   * @param {String} value
   */
  static isEmpty(value: string) {
    if (value == null || value === undefined || value.length === 0) {
      return true;
    }

    //if (value.trim() == "") return true;
    //Above commented line throws .trim() is not a function

    return false;
  }
}
