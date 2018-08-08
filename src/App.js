import React, { Component } from 'react';
import withForm from './withForm';
import { required } from './validators';
import Input from './components/Input';

let LoginForm = props => {
  return (
    <form onSubmit={props.onSubmit}>
      <div>
        {props.valid ? 'valid' : 'invalid'}
      </div>
      <Input {...props.inputs.username} />
      <Input {...props.inputs.password} />
      <button>Submit</button>
    </form>
  )
};

LoginForm = withForm({
  username: {
    name: 'username',
    placeholder: 'This is a test',
    validation: [
      required('Please provide your username'),
    ],
  },
  password: {
    name: 'password',
    type: 'password',
    validation: [
      required('Please provide your password'),
    ],
  },
})(LoginForm);

class App extends Component {
  render() {
    return (
      <div className="App">
        <LoginForm onSubmit={() => alert('helz yes!')} />
      </div>
    );
  }
}

export default App;
