import React from 'react';
import PropTypes from 'prop-types';
import FormFieldWrap from '../FormFieldWrap';

const propTypes = {
  wrapperClassName: PropTypes.string,
  labelClassName: PropTypes.string,
  inputClassName: PropTypes.string,
  errorClassName: PropTypes.string,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  id: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.arrayOf(PropTypes.string),
  placeholder: PropTypes.string,
  type: PropTypes.string,
};

const defaultProps = {
  inputClassName: '',
  wrapperClassName: '',
  labelClassName: '',
  errorClassName: '',
  id: '',
  label: '',
  errors: [],
  placeholder: '',
  type: 'text',
};

const Input = props => {
  const labelFor = props.id || props.name;

  return (
    <FormFieldWrap
      wrapperClassName={props.wrapperClassName}
      label={props.label}
      labelFor={labelFor}
      errors={props.errors}
      errorClassName={props.errorClassName}>
      <input
        id={labelFor}
        name={props.name}
        onChange={props.onChange}
        onBlur={props.onChange}
        className={props.inputClassName}
        placeholder={props.placeholder}
        type={props.type}
      />
    </FormFieldWrap>
  );
}

Input.propTypes = propTypes;
Input.defaultProps = defaultProps;

export default Input;
