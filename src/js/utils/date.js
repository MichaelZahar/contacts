/**
 * Возвращает кол-во дней в месяце.
 * Допустимые значения месяца в классе Date [0, 11].
 * new Date(year, month, 0) возвращает последний день предыдущего месяца.
 *
 * @function
 * @param {number|string} year в формате yyyy
 * @param {number|string} month в формате mm
 * @return {number}
 */
export const getMonthDays = (year = new Date().getFullYear(), month = new Date().getMonth()) => {
  return new Date(year, month + 1, 0).getDate();
};

/**
 * @typedef {{ date: number, month: number, year: number }} DMYDate
 */

/**
 * Возвращает день, месяц и год переданной даты
 *
 * @function
 * @param {Date|number} date
 * @return {DMYDate}
 */
export const mapDateToObject = (date) => {
  let d = date;

  if (typeof d === 'number') {
    d = new Date(d);
  }

  return {
    date: d.getDate(),
    month: d.getMonth(),
    year: d.getFullYear()
  };
};

/**
 * Список месяцев в текущей локали пользователя
 *
 * @const
 * @type {Array<string>}
 */
export const monthNames = (() => {
  const locale = navigator.language;
  const now = new Date();

  return [...Array(12).keys()].map((month, index) => {
    let result = new Date(now.getFullYear(), month, 1).toLocaleString(locale, { month: 'long' });

    // на ios safari не умеет options (второй параметр) в методе toLocaleString
    if (result.match(/\d+/)) {
      try {
        result = result.match(/\d+\s(\w+)\s/)[1];
      } catch (err) {
        result = index + 1;
      }
    }

    return result;
  });
})();
