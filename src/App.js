import React, { Component } from 'react';
import { required, emailCheck } from './validators';
import formHoc from './formHoc';
import './App.css';

let LoginForm = props => {
  console.log('formProps: ', props);
  return (
    <div>
      <div>
        {props.valid ? 'valid' : 'invalid'}
      </div>
      <div>
        <input
          id={props.fields.username.id}
          value={props.fields.username.value}
          name={props.fields.username.name}
          onChange={props.fields.username.onChange}
          onBlur={props.fields.username.onChange}
        />
        {props.fields.username.errors.length}
      </div>
      <div>
        <input
          id={props.fields.password.id}
          value={props.fields.password.value}
          name={props.fields.password.name}
          onChange={props.fields.password.onChange}
          onBlur={props.fields.password.onChange}
          type="password"
        />
        {props.fields.password.errors.length}
      </div>
    </div>
  )
};

LoginForm = formHoc(LoginForm, {
  validators: {
    username: [
      required('The username is required'),
      emailCheck('Please provide a valid email'),
    ],
    password: [
      required('The password is required')
    ],
  },
  fields: {
    username: '',
    password: '',
  },
});

const Button = () => <button type="submit">Submit</button>

class App extends Component {
  render() {
    return (
      <div className="App">
        <LoginForm
          footerButtons={Button}
          onSubmit={() => alert('helz yes!')}
        />
      </div>
    );
  }
}

export default App;
