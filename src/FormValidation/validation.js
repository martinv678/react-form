export const required = err => (value = '') => {
  const match = value.match(/\S/);
  if (!match) { return err; }
  return null;
};

export const maxNum  = (err, num) => (value) => {
  if (Number(value) > num) {
    return err;
  }

  return null;
};

export const isTelephoneNumber = err => (value) => {
  const regex = /\s*(([+](\s?\d)([-\s]?\d)|0)?(\s?\d)([-\s]?\d){9}|[(](\s?\d)([-\s]?\d)+\s*[)]([-\s]?\d)+)\s*/;

  if (!regex.test(value)) {
    return err;
  }

  return '';
};

export const requiredNumber = (err: string = '') => (value: string = ''): string => {
  const num: number = +value;
  if (!num) { return err; }
  return '';
};

export const requiredArray = err => (value = []) => {
  if (!value.length) { return err; }
  return null;
};

export const requiredBoolean = err => (value) => {
  if (value === false) { return err; }
  return null;
};

export const passwordsMatch = err => (value, values) => {
  if (value !== values.password) return err;
  return null;
};

export const newPasswordIsntCurrent = err => (value, values) => {
  if (value === values.currentPassword) return err;
  return null;
};

export const requiredLocation = err => (value) => {
  if (!value || (typeof value === 'object' && !Object.keys(value).length)) {
    return err;
  }

  return null;
};
