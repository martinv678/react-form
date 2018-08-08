export const required = err => (value = '') => {
  const match = value.match(/\S/);
  if (!match) {
    return err;
  }
  return null;
};

export const emailCheck = err => value => {
  const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(String(value).toLowerCase()) ? null : err;
};

