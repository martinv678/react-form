import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { _checkInputForErrors, _getValues } from './utilities';

const propTypes = {
  onSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
  onChange: PropTypes.func,
  className: PropTypes.string,
  resetFormOnSubmit: PropTypes.bool,
};

const defaultProps = {
  initialValues: {},
  onChange: () => {},
  className: undefined,
  resetFormOnSubmit: false,
};

const formHoc = config => (WrappedComponent) => {
  class FormHoc extends PureComponent {
    constructor(props) {
      super(props);

      this.onSubmit = this.onSubmit.bind(this);
      this.onChange = this.onChange.bind(this);
      this.setupFields = this.setupFields.bind(this);
      this.checkFormValidity = this.checkFormValidity.bind(this);

      this.state = {
        valid: false,
        submitted: false,
        inputs: this.setupFields(config, this.onChange, props.initialValues),
      };
    }

    componentDidUpdate() {
      this.checkFormValidity();
    }

    checkFormValidity() {
      const { inputs } = this.state;
      // Detect for new for errors.
      const formErrors = Object.keys(inputs).reduce((arr, key) => {
        const { errors } = _checkInputForErrors(inputs[key], inputs, true);
        return [...arr, ...errors];
      }, []);

      this.setState(() => ({
        valid: !formErrors.length,
      }));
    }

    // tested
    onSubmit(e) {
      e.preventDefault();
      const { inputs } = this.state;
      const {
        onSubmit,
        resetFormOnSubmit,
      } = this.props;

      let valid = true;

      const updated = Object.entries(inputs).reduce((obj, [key, input]) => {
        const newInput = _checkInputForErrors({ ...input }, inputs, true);

        if (valid && newInput.errors.length) {
          valid = false;
        }

        return {
          ...obj,
          [key]: {
            ...newInput,
            touched: true,
          },
        };
      }, {});

      if (valid) {
        // Get values out of the form
        onSubmit(_getValues(updated));
        if (resetFormOnSubmit) {
          this.setState({
            inputs: this.setupFields(config, this.onChange),
          });
        }
      } else {
        this.setState({
          inputs: updated,
        });
      }

      this.setState(() => ({
        submitted: true,
      }));
    }

    // tested
    onChange(e) {
      e.persist();
      const { inputs } = this.state;
      const { onChange } = this.props;

      let input = {
        ...inputs[e.target.name],
        value: e.target.value,
      };

      if (e.type === 'blur' && !input.touched) {
        input.touched = true;
      }

      input.value = e.target.value;
      input = _checkInputForErrors(input, inputs);

      this.setState(prevState => ({
        inputs: {
          ...prevState.inputs,
          [e.target.name]: input,
        },
      }));

      // Do anyside actions that the view may require.
      if (onChange) {
        onChange(e);
      }
    }

    /**
    * A method to setup the inputs to their default state.
    */
    setupFields() {
      const { initialValues } = this.props;
      return Object.keys(config).reduce((obj, key) => {
        return {
          ...obj,
          [key]: {
            ...config[key],
            // Always return an empty sting instead of undefined.
            value: initialValues[key] || config[key].value || '',
            onChange: this.onChange,
            validation: config[key].validation || [],
            touched: false,
            errors: [],
          },
        };
      }, {});
    }

    /**
    * The React render function.
    */
    render() {
      return (
        <WrappedComponent
          {...this.state}
          className={this.props.className}
          onSubmit={this.onSubmit}
        />
      );
    }
  }

  FormHoc.propTypes = propTypes;
  FormHoc.defaultProps = defaultProps;

  return FormHoc;
}

export default formHoc;