import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import {
  formHasErrors,
  validate,
  setupTouched,
  setupErrors,
  evaluateErrors,
} from './utilities';

export const InjectedPropTypes = {
  onChange: PropTypes.func.isRequired,
  values: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  resetForm: PropTypes.func.isRequired,
  submitted: PropTypes.bool.isRequired,
  valid: PropTypes.bool.isRequired,
};

const propTypes = {
  onValidSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func,
  className: PropTypes.string,
  inputs: PropTypes.object.isRequired,
  validation: PropTypes.object,
  onReset: PropTypes.func,
  clearOnSubmit: PropTypes.bool,
  render: PropTypes.func.isRequired,
};

const defaultProps = {
  onChange: undefined,
  className: undefined,
  validation: {},
  onReset: undefined,
  clearOnSubmit: false,
};

function initializeState(values, validation) {
  const touched = setTouched(values);

  return {
    errors: evaluateErrors(values, validation, touched),
    submitted: false,
    touched,
    valid: false,
    values,
  };
}

function formReducer(state, action) {
  switch(action.type) {
    case 'RESET':
      return initializeState(action.values, action.validation),

    default:
      return state;
  }
};

function useFormState({
  values,
  validation,
}) {
  const touched = setTouched(fields);
  const [state, dispatch] = React.useReducer(initializeState(values, validation));

  function resetForm() {
    dispatch({
      type: 'RESET',
      values,
      vaildation,
    });
  }

  function onChange() {
    
  }

  function onSubmit(e) {
    e.preventDefault();
  }

  return {
    errors: state.errors,
    values: state.values,
    onChange,
    onSubmit,
  };
}

function FormValidation(props) {
  const { onChange } = useFormState({
    onValidSubmit: () => {},
    values: {},
    resetForm: () => {},
    validation: {},
    clearOnSubmit: false,
  });

  return <div>Form Validation</div>
}

class FormValidation extends PureComponent {
  onSubmit(e) {
    e.preventDefault();
    const { onValidSubmit, validation, clearOnSubmit, inputs } = this.props;
    const { values } = this.state;

    const touched = setupTouched(values, true);
    const valid = formHasErrors(values, validation);

    const errors = Object.keys(validation).reduce(
      (obj, key) => ({
        ...obj,
        [key]: validate(values[key], values, validation[key]),
      }),
      {},
    );

    if (valid) {
      onValidSubmit(values);
    }

    this.setState(() => ({
      values: (valid && clearOnSubmit) ? inputs : values,
      valid,
      touched: (valid && clearOnSubmit) ? setupTouched(inputs) : touched,
      errors,
      submitted: true,
    }));
  }

  onChange(e) {
    if (e.persist) e.persist();

    const { onChange, validation } = this.props;
    const { name, value } = e.target;

    const touched = {
      ...this.state.touched,
      [name]: this.state.touched[name] || e.type === 'blur',
    };

    const values = {
      ...this.state.values,
      [name]: (e.currentTarget && e.currentTarget.type === 'checkbox')
        ? e.currentTarget.checked
        : value,
    };

    const errors = evaluateErrors(values, validation, touched);

    this.setState(() => ({
      values,
      valid: formHasErrors(values, validation),
      touched,
      errors,
    }));

    if (onChange) {
      onChange(e);
    }
  }

  resetForm() {
    const { inputs, validation, onReset } = this.props;

    this.setState(() => ({
      valid: formHasErrors(inputs, validation),
      submitted: false,
      touched: setupTouched(inputs),
      values: inputs,
      errors: setupErrors(validation),
    }));

    if (onReset) {
      onReset();
    }
  }

  render() {
    const { inputs } = this.props;

    return (
      <form onSubmit={this.onSubmit}>
        {this.props.render({
          errors: this.state.errors,
          valid: this.state.valid,
          submitted: this.state.submitted,
          onChange: this.onChange,
          className: this.props.className,
          values: this.state.values,
          resetForm: this.resetForm,
        })}
      </form>
    );
  }
}

FormValidation.propTypes = propTypes;
FormValidation.defaultProps = defaultProps;

export default FormValidation;
