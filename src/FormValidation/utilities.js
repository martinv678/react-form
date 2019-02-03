export const setupTouched = (inputs, touched = false) =>
  Object.keys(inputs).reduce((obj, key) => ({
    ...obj,
    [key]: touched || !!inputs[key],
  }), {});

export const setupErrors = validation =>
  Object.keys(validation).reduce((obj, key) => ({
    ...obj,
    [key]: [],
  }), {});

export const validate = (value, inputs, validation) =>
  validation.map(fn => fn(value, inputs)).filter(v => !!v);


export const evaluateErrors = (inputs, validation, touched) =>
  Object.keys(inputs).reduce((obj, key) => {
    const shouldValidate = (validation[key] && touched[key]);

    return {
      ...obj,
      [key]: shouldValidate ? validate(inputs[key], inputs, validation[key]) : [],
    };
  }, {});

export const formHasErrors = (inputs, validation) => {
  const errors = Object.keys(inputs).reduce((arr, key) => {
    if (validation[key]) {
      return [
        ...arr,
        ...validate(inputs[key], inputs, validation[key]),
      ];
    }

    return arr;
  }, []);

  return !errors.length;
};
