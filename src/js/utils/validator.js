import { VALIDATOR_UPDATE_ERROR } from '../constants';

/**
 * Возвращает true, если переданный аргумент является числом
 *
 * @function
 * @param {number} num
 * @return {boolean}
 */
export const isNumeric = (num) => {
  return !isNaN(parseFloat(num)) && isFinite(num);
};

/**
 * Возвращает true если строка имеет корректную длину
 *
 * @function
 * @param {string} string проверяемое значение
 * @param {number} [minLength] минимальная длина
 * @param {number} [maxLength] максимальная длина
 * @param {boolean} [trim=false] надо ли удалять концевые пробелы
 * @return {boolean}
 */
export const validateStringLength = (string = '', minLength, maxLength, trim = false) => {
  const str = trim ? string.trim() : string;
  const count = str.length;

  if (isNumeric(minLength) && count < minLength) {
    return false;
  }

  if (isNumeric(maxLength) && count > maxLength) {
    return false;
  }

  return true;
};

/**
 * Возвращает true, если переданная строка - корректная дата.
 *
 * @function
 * @param {Date|number} date проверяемая дата
 * @param {Date} [minDate] минимальная дата
 * @param {Date} [maxDate] максимальная дата
 * @return {boolean}
 */
export const validateDate = (date, minDate, maxDate) => {
  const input = date instanceof Date ? date : new Date(date);

  if (isNaN(parseInt(input.getTime(), 10))) {
    return false;
  }

  if (minDate instanceof Date && input < minDate) {
    return false;
  }

  if (maxDate instanceof Date && input > maxDate) {
    return false;
  }

  return true;
};

/**
 * Возвращает true, если переданная строка - корректная дата.
 *
 * @function
 * @param {string} date проверяемое значение в формате: dd/mm/yyy, dd.mm.yyyy, dd-mm-yyyy
 * @param {Date} [minDate] минимальная дата
 * @param {Date} [maxDate] максимальная дата
 * @return {boolean}
 */
export const validateDateString = (date, minDate, maxDate) => {
  /**
   * нашел этот regexp на so, он возвращает некорректные значения для дат < 1600 года
   * и возможно имет другие ограничения, думаю можно подключить что-то типа
   * momentjs для лучшей валидации, но думаю для тестового задания это неплохой вариант.
   * Для простоты можно было бы создавать new Date(...), но конструктор вернет 1 марта для 29 февраля
   * невисокосного года.
   */
  const isValid = !!(date || '').match(/^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/);

  if (!isValid) {
    return false;
  }

  const [ , d, m, y ] = date.match(/(\d+)[\.\/-](\d+)[\.\/-](\d+)/);
  const input = new Date(y, m - 1, d);

  return validateDate.call(null, input, minDate, maxDate);
};

/**
 * Будем считать, что российский код состоит их 10 символов.
 * Первые три символа - код оператора.
 * Нашел (возможно неактуальные) коды операторов здесь http://yznal.ru/code/910
 * Далее будем предполагать, что номер из одних нулей валидный (не уверен в этом).
 */
const russianCodes = [
  900, 901, 902, 903, 904, 905, 906, 908, 909,
  910, 911, 912, 913, 914, 915, 916, 917, 918, 919,
  920, 921, 922, 923, 924, 925, 926, 927, 928, 929,
  930, 931, 932, 933, 934, 936, 937, 938, 939,
  941,
  950, 951, 952, 953, 954, 955, 956, 958,
  960, 961, 962, 963, 964, 965, 966, 967, 968, 969,
  970, 971, 977, 978,
  980, 981, 982, 983, 984, 985, 986, 987, 988, 989,
  991, 992, 993, 994, 995, 996, 997, 999
];

/**
 * Возвращает true, если в переданной строке/числе есть 10 символов
 * и первые 3 соответствуют одному из кодов российских сотовых опператоров.
 *
 * @function
 * @param {number|string} number проверяемые входные данные
 * @return {boolean}
 */
export const validateRussianCellphone = (number) => {
  const num = isNumeric(number) ? number : parseInt(number.replace(/\D/g, ''), 10);

  if (num < 900 * Math.pow(10, 7) || num >= Math.pow(10, 10)) {
    return false;
  }

  const code = Math.floor(num / Math.pow(10, 7));

  return russianCodes.some((el) => el === code);
};

/**
 * @typedef {{func: Function, error: string}} validationRule
 */

/**
 * Модифицированный react action
 *
 * @typedef {Object} action
 * @property {string} type
 * @property {*} [payload]
 * @property {Object} [meta]
 * @property {Object.<string, validationRule>} [meta.validator]
 */

/**
 * @typedef {Object} validationRules
 * @property {boolean} error
 * @property {Object.<string, string>} data
 */

/**
 * Валидирует action
 *
 * @function
 * @param {action}
 * @return {validationResult}
 */
const validateAction = (action) => {
  const { meta: { validator, weakValidation }, payload } = action;
  const result = {
    type: VALIDATOR_UPDATE_ERROR,
    error: false,
    payload: {}
  };
  const fieldSource = (weakValidation) ? payload : validator;

  Object.keys(fieldSource).forEach((param) => {
    if (param in validator) {
      const rule = validator[param];
      const isValid = rule.func(payload[param]);

      result.payload[param] = isValid ? undefined : rule.msg;

      if (!isValid) {
        result.error = true;
      }
    }
  });

  return result;
};

/**
 * Redux middlware
 * Принимает action и валидирует его.
 * Если найдена ошиюка, возвращает ее, перрывая диспетчеризацию события
 */
export const actionValidator = store => next => action => {
  const meta = action.meta;
  const hasValidator = meta && meta.validator;

  if (hasValidator) {
    const weakValidation = action.meta && action.meta.weakValidation;
    const validationResult = validateAction(action);

    // Если есть ошибка и проверка строгая,
    // прекращаем обработку action и отправляем ошибку валидации
    if (validationResult.error && !weakValidation) {
      return next(validationResult);
    }

    if (!validationResult.error && typeof meta.success === 'function') {
      meta.success(validationResult, action);
    }

    if (validationResult.error && typeof meta.failure === 'function') {
      meta.failure(validationResult, action);
    }

    // Сообщаем системе статус валидации
    store.dispatch(validationResult);
  }

  return next(action);
};
