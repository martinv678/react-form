import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  wrapperClassName: PropTypes.string,
  labelClassName: PropTypes.string,
  label: PropTypes.string,
  errors: PropTypes.array.isRequired,
  labelFor: PropTypes.string,
  errorClassName: PropTypes.string,
}

const defaultProps = {
  wrapperClassName: '',
  labelFor: '',
};

const renderErrors = (errors, className) =>
  errors.map(error => <p key={error} className={className}>{error}</p>);

const FormFieldWrap = ({
  wrapperClassName,
  label,
  labelFor,
  labelClassName,
  errors,
  errorClassName,
  children,
}) => (
  <div className={wrapperClassName}>
    {label && (
      <label
        htmlFor={labelFor}
        className={labelClassName}>
        {label}
      </label>
    )}
    {children}
    {renderErrors(errors, errorClassName)}
  </div>
);

FormFieldWrap.propTypes = propTypes;
FormFieldWrap.defaultProps = defaultProps;

export default FormFieldWrap;
