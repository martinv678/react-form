import { compose } from 'recompose';

/**
* Get the values from the inputs.
* @param {object} inputs - The inputs form the form.
*/
export const _getValues = inputs =>
  Object.entries(inputs).reduce((obj, [key, { value }]) => ({
    ...obj,
    [key]: value,
  }), {});

/**
* Validate the input and return the input with any errors
* @param {object} input - The input field to be validated.
*/
export const _validate = (input = {}) => {
  const errors = input.validation
    .map(fn => fn(input.value))
    .filter(v => !!v);

  return {
    ...input,
    errors: [
      ...input.errors,
      ...errors,
    ],
  };
};

/**
* Validate the matchers on the input. This is good if values need to match.
* @param {object} input - The input field to be validated.
* @param {object} inputs - The inputs from the form state.
*/
export const _validateMatchers = (input, inputs) => {
  if (!input.matchers || !input.matchers.length) {
    return input;
  }

  const errors = input.matchers
    .map(fn => fn(input.value, inputs))
    .filter(v => !!v);

  return {
    ...input,
    errors,
  };
};

/**
* Check a single input for errors.
*/
export const _checkInputForErrors = (input, inputs, touched = false) => {
  if (!input.touched && !touched) {
    return input;
  }

  const newInput = {
    ...input,
    errors: [],
  };

  // Now check the input for errors.
  return compose(
    _validate,
    _validateMatchers,
  )(newInput, inputs);
};
