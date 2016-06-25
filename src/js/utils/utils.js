/* eslint no-console: 0 */

/**
 * Декоратор, который преобразует стандартное событие
 * в map { [name]: value }, где name - название input/select,
 * a value - значение.
 *
 * @function
 * @param {HTMLElement|React.Element} target
 * @param {string} key
 * @param {ProperyDescriptor} descriprion
 * @return {ProperyDescriptor}
 */
export const eventTargerToNameValue = (target, key, description) => {
  const fn = description.value;

  if (typeof fn !== 'function') {
    console.log('Use `eventTargerToNameValue` decorator only for methods.');
    return description;
  }

  return {
    ...description,
    value(e) {
      const { name, value } = e.target;

      fn.call(this, { [name]: value });
    }
  };
};

/**
 * Объединяет методом неглубокого слияния массив объектов
 *
 * @function
 * @prop {Array<Object>} updates
 * @return Object
 */
export const mergeListOfObjects = (updates) => {
  return updates.reduce((result, data) => ({ ...result, ...data[0] }), {});
};
