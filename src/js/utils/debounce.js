/* eslint no-console: 0 */

/**
 * Добавляет в объект служебные параметры,
 * необходимые для декоратора debounce
 */
const metaFor = (target) => {
  if (!target.debounceTimeoutIds) {
    target.debounceTimeoutIds = {};
  }

  if (!target.debounceArgs) {
    target.debounceArgs = {};
  }

  return target;
};

/**
 * Возвразащет декоратор, который позволяет вызывать метод не чаще
 * чем 1 раз в указанную единицу времени.
 *
 * Откладывает вызов, если во время ожидания ф-я вызывается еще раз
 * ожидание продлевается на заданную величину.
 *
 * Если не передан reducer ф-ия будет вызвана с аргументами последнего вызова.
 * Если reducer передан, аргументы вызовов накапливаются, а перед реальным
 * вызовом передаются в reducer, который формирует передаваемые в реальных вузов параметры.
 *
 * @function
 * @param {HTMLElement|React.Element} target
 * @param {string} key
 * @param {ProperyDescriptor} descriprion
 * @param {number} time время, на которое откладывается вызов функции при очередном вызове
 * @param {Function} [reducer] ф-я, которая перобразует массив аргументов накопленных вызовов
 * в аргументы реального вызова
 * @return {ProperyDescriptor}
 */
const debounce = (target, key, description, time, reducer) => {
  const fn = description.value;

  if (typeof fn !== 'function') {
    console.log('Use `deblunce` only for methods');
    return description;
  }

  metaFor(target);

  return {
    ...description,
    value(...args) {
      const { debounceTimeoutIds, debounceArgs } = metaFor(this);
      const timeoutId = debounceTimeoutIds[key];

      if (reducer) {
        if (!debounceArgs[key]) {
          debounceArgs[key] = [];
        }

        debounceArgs[key].push(args);
      }

      clearTimeout(timeoutId);

      debounceTimeoutIds[key] = setTimeout(() => {
        let callArgs = reducer ? [ reducer(debounceArgs[key]) ] : args;

        delete debounceTimeoutIds[key];
        delete debounceArgs[key];

        fn.apply(this, callArgs);
      }, time);
    }
  };
};

/**
 * Декоратор debounce
 * Функция сохраняет в замыкании задержку вызова
 * и ф-ию обработчик парамтеров вызова.
 *
 * @function
 * @param {number} [time=300]
 * @param {Function} [reducer]
 */
export default (time = 300, reducer) => {
  return (...args) => {
    return debounce.apply(null, [...args, time, reducer]);
  };
};
