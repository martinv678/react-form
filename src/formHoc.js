import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isEqual } from ''

export const setupFields = (values, fn) => {
  return Object.keys(values).reduce((obj, key) => {
    return {
      ...obj,
      [key]: {
        name: key,
        touched: false,
        errors: [],
        onChange: fn,
        onBlur: fn,
        value: values[key],
      },
    };
  }, {});
};

function formHoc(WrappedComponent, {
  validators = {},
  fields,
}) {
  class Form extends Component {
    constructor(props) {
      super(props);
      this.onChange = this.onChange.bind(this);
      this.isFormValid = this.isFormValid.bind(this);
      this.onFieldValidate = this.onFieldValidate.bind(this);
      this.onSubmit = this.onSubmit.bind(this);
      this.setErrors = this.setErrors.bind(this);

      const {
        onChange,
        redux,
      } = this.props;

      // If in redux mode we assume the onChange method is hijacked...
      if (redux && !onChange) {
        throw new Error('Please provide an onChange method in redux mode');
      }

      const formFields = this.props.fields || fields;

      // Set the state.
      this.state = {
        fields: setupFields(formFields, this.onChange),
        valid: false,
      };
    }

    componentWillReceiveProps() {
      // Do something here in redux mode.

      // Here we also need to test for value change...
    }

    onFieldValidate(name, value) {
      // Get the validation rules for this input..
      const validations = validators[name];
      // If there are validations for this input, run them.
      if (validations) {
        return validations
          .map(fn => fn(value))
          .filter(item => !!item);
      }

      return [];
    }

    // A method to see if the form is valid.
    isFormValid() {
      let valid = true;

      if (!Object.keys(validators).length) {
        // If there are no validators we want to assume there is no
        // validation on this form... Not sure if it will ever happen.
        return valid;
      }

      const { fields } = this.state;
      // Test to see if any of the fields are invalid
      // but do not show the errors.
      Object.keys(fields).forEach(key => {
        const test = this.onFieldValidate(key, fields[key].value);
        // Check whether the field has errors against it.
        if (valid) { valid = !test.length; }
      });
      // Return whether the form is valid.
      return valid;
    }

    onSubmit(e) {
      e.preventDefault();
      if (this.state.valid) {
        this.props.onSubmit();
      } else {
        this.setState({
          fields: this.setErrors(),
        });
      }
    }

    setErrors() {
      // Return the fields with the errors on...
      return Object.entries(this.state.fields).reduce((obj, [key, value]) => ({
        ...obj,
        [key]: {
          ...value,
          errors: this.onFieldValidate(key, value.value),
          touched: true,
        },
      }), {});
    }

    onChange(e) {
      const { target: { name, value } } = e;
      let touched = this.state.fields[name].touched;

      const {
        onChange,
        redux,
      } = this.props;

      if (e.type === 'blur' && !this.state.fields[name].touched) {
        touched = true;
      }

      if (onChange && redux) {
        onChange(e);
        return;
      }

      this.setState({
        fields: {
          ...this.state.fields,
          [name]: {
            ...this.state.fields[name],
            errors: this.onFieldValidate(name, value),
            value,
            touched,
          },
        },
      }, () => {
        this.setState({
          valid: this.isFormValid(),
        });
      });
    }

    render() {
      const {
        className,
        buttonClassName,
      } = this.props;

      return (
        <form
          onSubmit={this.onSubmit}
          className={className}
        >
          <h1>Form HOC</h1>
          <WrappedComponent
            {...this.props}
            {...this.state}
          />
          {this.props.footerButtons
            ? <this.props.footerButtons />
            : <button type="submit" className={buttonClassName}>Submit</button>
          }
        </form>
      );
    }
  }

  Form.defaultProps = {
    redux: false,
    buttonClassName: undefined,
    className: undefined,
    fields: undefined,
  };

  Form.propTypes = {
    fields: PropTypes.object,
    redux: PropTypes.bool.isRequired,
    buttonClassName: PropTypes.string,
    className: PropTypes.string,
  };

  return Form;
};

export default formHoc;
