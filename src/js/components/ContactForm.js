import React, { Component, PropTypes } from 'react';
import { getMonthDays, monthNames,  } from '../utils/date';
import {
  eventTargerToNameValue,
  mergeListOfObjects
} from '../utils/utils';
import { mapDateToObject } from '../utils/date';
import debounce from '../utils/debounce';

export default class ContactForm extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,

    onChange: PropTypes.func.isRequired,
    onReset: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    error: PropTypes.object
  }

  static defaultProps = {
    data: {}
  }

  state = {
    ...this.getDate(this.props.data.birthdate)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.data.id !== nextProps.data.id) {
      this.updateForm(nextProps);
    }
  }

  /**
   * Так как у нас uncontrolled компоненты (input),
   * когда приходят новые props `вручную` меняем value.
   *
   * @method
   * @param {Object} nextProps
   */
  updateForm(nextProps) {
    const { data } = nextProps;
    const elementsByName = [].slice.call(this.form).reduce((result, el) => {
      if (el.name) {
        result[el.name] = el;
      }
      return result;
    }, {});

    Object.keys(data).forEach(name => {
      let el = elementsByName[name];

      if (el) {
        el.value = data[name] || '';
      }
    });

    this.setState(this.getDate(data.birthdate));
  }

  @eventTargerToNameValue
  @debounce(300, mergeListOfObjects)
  onChange(update) {
    this.props.onChange(update);
  }

  /**
   * Преобразует ts из this.props.birthdate в map с date, month, years.
   * Если birthdate не передан, возвращает текущую дате -20 лет.
   *
   * @method
   * @param {number} date
   * @return {{ date: number, month: number, year: number }}
   */
  getDate(date) {
    const defaultDate = new Date();
    defaultDate.setFullYear(defaultDate.getFullYear() - 20);

    return mapDateToObject(date || defaultDate);
  }

  /**
   * Дата представлена тремя элементами select и
   * ее состояние хранится и управляется данным компонентом
   * с помощью этого обработчика.
   *
   * @method
   * @param {ElementEvent} event
   */
  onDateChange(event) {
    const state = {
      ...this.state,
      [event.target.name]: parseInt(event.target.value, 10)
    };
    let { date, month, year } = state;
    const monthDays = getMonthDays(year, month);

    if (monthDays < date) {
      state.date = date = 1;
    }

    this.setState(state);
    this.props.onChange({
      birthdate: new Date(year, month, date).getTime()
    });
  }

  reset() {
    if (this.form) {
      this.form.reset();
      this.setState(this.getDate());
    }
  }

  /**
   * Вспомогательный метод для отрисовки input
   *
   * @method
   * @param {string} name
   * @param {string|number} value
   * @param {string} placeholder
   * @param {string} error
   * @return {React.Element}
   */
  renderInput(name, value, placeholder, error) {
    return (
      <p>
        <input type="text" name={name} defaultValue={value} placeholder={placeholder} onChange={::this.onChange} />
        {error && <span className="error">{error}</span>}
      </p>
    );
  }

  render() {
    const { data: { id, name, cellphone, city, address }, error, onReset, onSubmit } = this.props;
    const { date, month, year } = this.state;
    const monthDays = getMonthDays(year, month);
    const curYear = new Date().getFullYear();
    const formCssClass = [
      'contact-form',
      id ? 'edit-form' : 'add-form'
    ].join(' ');

    return (
      <form className={formCssClass}
        ref={el => this.form = el}
        onSubmit={(e) => {
          e.preventDefault();

          const formData = {
            ...this.props.data,
            birthdate: new Date(this.state.year, this.state.month, this.state.date).getTime()
          };

          onSubmit(formData, ::this.reset);
        }}>
        <h2 className="el-add">Add contact</h2>
        <h2 className="el-edit">Edit contact</h2>
        {id && <input type="hidden" name="id" value={id} />}
        {this.renderInput('name', name, 'Name', error.name)}
        <p>
          <span className="title">Birthdate</span>
          <select name="date" value={date} onChange={::this.onDateChange}>
            {[...Array(monthDays + 1).keys()].slice(1).map(d =>
              <option key={d} value={d}>
                {d}
              </option>
            )}
          </select>
          <select name="month" value={month} onChange={::this.onDateChange}>
            {monthNames.map((m, index) =>
              <option key={index} value={index}>
                {m}
              </option>
            )}
          </select>
          <select name="year" value={year} onChange={::this.onDateChange}>
            {[...Array(100 + 1).keys()].map(i =>
              <option key={i} value={curYear - 100 + i}>
                {curYear - 100 + i}
              </option>
            )}
          </select>
          {error.birthdate && <span className="error">{error.birthdate}</span>}
        </p>
        {this.renderInput('cellphone', cellphone, 'Cellphone', error.cellphone)}
        {this.renderInput('city', city, 'City', error.city)}
        {this.renderInput('address', address, 'Address', error.address)}
        <p>
          <button className="cancel" onClick={e => {
            e.preventDefault();
            this.form.reset();
            onReset();
          }}>Cancel</button>
          <span className="button-container">
            <button className="add el-add">Create</button>
            <button className="edit el-edit">Edit</button>
          </span>
        </p>
      </form>
    );
  }
}
