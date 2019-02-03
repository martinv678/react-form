import React from 'react';
import { storiesOf } from '@storybook/react';
import withFormValidation from './withFormValidation';
import { action } from '@storybook/addon-actions';
import { required } from './validation';

const repeatPasswordCheck = (err) => (value, values) => {
  if (value !== values.password) return err;
  return null;
}

const validation = {
  username: [required('Your username is required')],
  password: [required('Your password is required')],
  repeatPassword: [
    required('Your password is required'),
    repeatPasswordCheck('Your passwords do not match'),
  ],
};

let Form = ({
  onChange,
  values,
  valid,
  errors,
}) => {
  return (
    <React.Fragment>
      <p>Form status: </p>
      <table className="table">
        <tbody>
          <tr>
            <td>Is the form valid?</td>
            <td>{valid ? 'true' : 'false'}</td>
          </tr>
          <tr>
            <td>Form errors</td>
            <td>{JSON.stringify(errors)}</td>
          </tr>
          <tr>
            <td>Form values</td>
            <td>{JSON.stringify(values)}</td>
          </tr>
        </tbody>
      </table>
      <p></p>
      <div className="form-group">
        <label
          className="form-label"
          htmlFor="username">
          Username:
        </label>
        <input
          type="text"
          name="username"
          className="form-control"
          onChange={onChange}
          onBlur={onChange}
          value={values.username}
        />
        {errors.username.map(error => <p key={error}>{error}</p>)}
      </div>
      <div className="form-group">
        <label
          className="form-label"
          htmlFor="password">
          Password:
        </label>
        <input
          type="password"
          name="password"
          className="form-control"
          onChange={onChange}
          onBlur={onChange}
          value={values.password}
        />
        {errors.password.map(error => <p key={error}>{error}</p>)}
      </div>
      <div className="form-group">
        <label
          className="form-label"
          htmlFor="repeatPassword">
          Repeat password:
        </label>
        <input
          type="password"
          name="repeatPassword"
          className="form-control"
          onChange={onChange}
          onBlur={onChange}
          value={values.repeatPassword}
        />
        {errors.repeatPassword.map(error => <p key={error}>{error}</p>)}
      </div>
      <button disabled={!valid}>
        Submit
      </button>
    </React.Fragment>
  );
};

Form = withFormValidation(Form);
Form.displayName = 'YourWrappedFormComponent';

storiesOf('HOC: withFormValidation', module)
  .add('no initial values', () => (
    <Form
      inputs={{
        username: '',
        password: '',
        repeatPassword: '',
      }}
      validation={validation}
      onValidSubmit={action('Returns the form values on submit')}
    />
  ))
  .add('with initial values', () => (
    <Form
      inputs={{
        username: 'Initial value',
        password: '',
        repeatPassword: '',
      }}
      validation={validation}
      onValidSubmit={action('Returns the form values on submit')}
    />
  ))
  .add('errors on initial mount', () => (
    <Form
      inputs={{
        username: 'Initial value',
        password: 'password',
        repeatPassword: '',
      }}
      validation={validation}
      onValidSubmit={action('Returns the form values on submit')}
    />
  ));