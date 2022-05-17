export class DateUtils {

/**
   * @param {Date} date
   * @param {String} separator
   * @returns {String} returns date in yyyymmdd format separated by given separator
   */
 static dateMMDDYYYY(date: Date, separator: string) {
    let d;
    if (date === undefined || date === null) d = new Date();
    else d = new Date(date);

    let sep;
    if (separator === undefined || separator === "") sep = "";
    else sep = separator.substring(0, 1);

    let monthNumber = d.getMonth() + 1;
    let dayNumber = d.getDate();
    const year = d.getFullYear();

   let month = (monthNumber < 10 ? "0" : "") + monthNumber;
   let day = (dayNumber < 10 ? "0" : "") + dayNumber;
   console.log("month " + month)
   console.log("day " + day)

    return [month, day, year].join(sep);
  }

  /**
   * @returns {Date}
   */
   static tomorrowDate() {
    const today = new Date();
    const tmr = new Date(today);
    tmr.setDate(tmr.getDate() + 1);

    return tmr;
  }
}