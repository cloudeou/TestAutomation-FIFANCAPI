export class ArrayUtils {
  /**
   * Returns true if given array is null / undefined or no elements
   * @param {Array} arr
   */
  static isEmpty(arr: any[]) {
    if (arr == null || arr === undefined || arr.length === 0) return true;

    return false;
  }

  /**
   * Removes any null or undefined elements from given array and returns clean array
   *
   * @param {Object} arr Specifies array of any type of objects
   */
  static removeNullAndUndefinedElements(arr: any[]) {
    if (this.isEmpty(arr)) return arr;

    if (!Array.isArray(arr)) return arr;

    return arr.filter((item) => item != null && item !== undefined);
  }
}
