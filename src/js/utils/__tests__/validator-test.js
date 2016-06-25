jest.unmock('../validator');

import {
  isNumeric,
  validateAction,
  validateDate,
  validateDateString,
  validateStringLength,
  validateRussianCellphone,
  validator
} from '../validator';

const createFakeStore = fakeData => ({
  getState() {
    return fakeData;
  }
});

const dispatch = (action) => {
  let dispatched = null;

  const d = validator(createFakeStore({}))(actionAttempt => dispatched = actionAttempt);

  d(action);

  return dispatched;
};

describe('validator', () => {
  it('execute `isNumeric` method with correct Number', () => {
    expect(isNumeric(100.5)).toBe(true);
  });

  it('execute `isNumeric` method with correct String', () => {
    expect(isNumeric('-199999.9555')).toBe(true);
  });


  it('execute `isNumeric` method with Infinity', () => {
    expect(isNumeric(Infinity)).toBe(false);
  });

  it('execute `isNumeric` method with incorrect string', () => {
    expect(isNumeric('123123.12.12')).toBe(false);
  });

  it('execute `isNumeric` method with boolean', () => {
    expect(
      isNumeric(false) || isNumeric(true)
    ).toBe(false);
  });

  it('execute `isNumeric` method with undefined', () => {
    expect(
      isNumeric(undefined)
    ).toBe(false);
  });

  it('execute `isNumeric` method with null', () => {
    expect(
      isNumeric(null)
    ).toBe(false);
  });

  it('execute `validateStringLength` with minLength and valid string', () => {
    expect(
      validateStringLength('123', 3)
    ).toBe(true);
  });

  it('execute `validateStringLength` with minLength and invalid string', () => {
    expect(
      validateStringLength('12', 3)
    ).toBe(false);
  });

  it('execute `validateStringLength` with maxLength and valid string', () => {
    expect(
      validateStringLength('123', undefined, 3)
    ).toBe(true);
  });

  it('execute `validateStringLength` with maxLength and invalid string', () => {
    expect(
      validateStringLength('12  ', undefined, 3)
    ).toBe(false);
  });

  it('execute `validateStringLength` with min/max length and valid string', () => {
    expect(
      validateStringLength('12  ', 3, 5)
    ).toBe(true);
  });

  it('execute `validateStringLength` with min/max length and invalid string', () => {
    expect(
      validateStringLength('  ', 3, 5)
    ).toBe(false);
  });

  it('execute `validateStringLength` with trim', () => {
    expect(
      validateStringLength('12  ', 3, 5, true)
    ).toBe(false);
  });

  it('execute `validateDate` with invalid value', () => {
    expect(
      validateDate('adsfd')
    ).toBe(false);
  });

  it('execute `validateDate` with valid value', () => {
    expect(
      validateDate(new Date().getTime())
    ).toBe(true);
  });

  it('execute `validateDate` with valid value and minDate', () => {
    expect(
      validateDate(new Date().getTime(), new Date() - 5 * 60 * 1000)
    ).toBe(true);
  });

  it('execute `validateDate` with invalid value and minDate', () => {
    expect(
      validateDate(new Date().getTime() - 5 * 60 * 1000, new Date())
    ).toBe(false);
  });

  it('execute `validateDate` with valid value and maxDate', () => {
    expect(
      validateDate(new Date().getTime(), undefined, new Date() + 5 * 60 * 1000)
    ).toBe(true);
  });

  it('execute `validateDate` with invalid value and maxDate', () => {
    expect(
      validateDate(new Date().getTime() + 5 * 60 * 1000, undefined, new Date())
    ).toBe(false);
  });

  it('execute `validateDateString` with valid date', () => {
    expect(
      validateDateString('29/02/2016')
    ).toBe(true);
  });

  it('execute `validateDateString` with invalid date (incorrect date)', () => {
    expect(
      validateDateString('29/02/2015')
    ).toBe(false);
  });

  it('execute `validateDateString` with invalid date (incorrect string)', () => {
    expect(
      validateDateString('290/02/2015')
    ).toBe(false);
  });

  it('execute `validateDateString` with minDate and valid date', () => {
    expect(
      validateDateString('01/03/2015', new Date('02/28/2015'))
    ).toBe(true);
  });

  it('execute `validateDateString` with minDate and invalid date', () => {
    expect(
      validateDateString('28/02/2015', new Date('03/01/2015'))
    ).toBe(false);
  });

  it('execute `validateDateString` with maxDate and invalid date', () => {
    expect(
      validateDateString('28/02/2015', new Date('01/01/2015'), new Date('02/27/2015'))
    ).toBe(false);
  });

  it('execute `validateRussianCellphone` with valid number', () => {
    expect(
      validateRussianCellphone(9091111111)
    ).toBe(true);
  });

  it('execute `validateRussianCellphone` with invalid number', () => {
    expect(
      validateRussianCellphone(909111111) || validateRussianCellphone(90911111111)
    ).toBe(false);
  });

  it('execute `validateRussianCellphone` with invalid code', () => {
    expect(
      validateRussianCellphone(9421111111)
    ).toBe(false);
  });

  it('execute `validateAction` with valid action', () => {
    const action = {
      type: 'ADD_CONTACT',
      payload: {
        id: 1,
        name: 'Michael'
      },
      meta: {
        validator: {
          name: {
            func: (name) => {
              return validateStringLength(name, 3, 100, true);
            },
            msg: 'Invalid name'
          }
        }
      }
    };
    const result = {
      error: false,
      data: {}
    };

    expect(
      validateAction(action)
    ).toEqual(result);
  });

  it('execute `validateAction` with invalid action', () => {
    const action = {
      type: 'ADD_CONTACT',
      payload: {
        id: 1,
        name: 'Li    ',
        cellphone: '(942) 111-11-11'
      },
      meta: {
        validator: {
          name: {
            func: (name) => {
              return validateStringLength(name, 3, 100, true);
            },
            msg: 'Invalid name'
          },
          cellphone: {
            func: validateRussianCellphone,
            msg: 'Invalid cellphone number'
          }
        }
      }
    };
    const result = {
      error: true,
      data: {
        name: 'Invalid name',
        cellphone: 'Invalid cellphone number'
      }
    };

    expect(
      validateAction(action)
    ).toEqual(result);
  });

  it('execute `validateAction` on action without validator', () => {
    const action = {
      type: 'ADD_CONTACT',
      payload: {
        id: 1,
        name: 'Michael'
      }
    };
    const result = {
      error: false,
      data: {}
    };

    expect(
      validateAction(action)
    ).toEqual(result);
  });

  it('dispatch a valid action with validator middlware', () => {
    const action = {
      type: 'ADD_CONTACT',
      payload: {
        id: 1,
        name: 'Michael'
      },
      meta: {
        validator: {
          name: {
            func: (name) => {
              return validateStringLength(name, 3, 100, true);
            },
            msg: 'Invalid name'
          }
        }
      }
    };

    expect(
      dispatch(action)
    ).toEqual(action);
  });

  it('dispatch an invalid action with validator middlware', () => {
    const action = {
      type: 'ADD_CONTACT',
      payload: {
        id: 1,
        name: 'Li    ',
        cellphone: '(942) 111-11-11'
      },
      meta: {
        validator: {
          name: {
            func: (name) => {
              return validateStringLength(name, 3, 100, true);
            },
            msg: 'Invalid name'
          },
          cellphone: {
            func: validateRussianCellphone,
            msg: 'Invalid cellphone number'
          }
        }
      }
    };
    const result = {
      error: true,
      data: {
        name: 'Invalid name',
        cellphone: 'Invalid cellphone number'
      }
    };

    expect(
      dispatch(action)
    ).toEqual(result);
  });
});
