import * as utilities from './utilities';
import { required } from './validation';

const validation = {
  username: [required('This is the required error')],
};

const values = {
  username: '',
  password: '',
};

describe('withFormValidation: utilities', () => {
  describe('setupTouched: ', () => {
    it('should create the touched object', () => {
      expect(utilities.setupTouched(values)).toEqual({
        username: false,
        password: false,
      });
    });

    it('should set touched to true if there is a value', () => {
      values.username = 'test';

      expect(utilities.setupTouched(values)).toEqual({
        username: true,
        password: false,
      });
    });

    it('should override to true when touched is passed in as true', () => {
      expect(utilities.setupTouched(values, true)).toEqual({
        username: true,
        password: true,
      });
    });
  });

  describe('setupErrors: ', () => {
    it('should set all the fields to be validated as an empty array', () => {
      expect(utilities.setupErrors(validation)).toEqual({
        username: [],
      });
    });
  });

  describe('validate:', () => {
    it('should validate the input and return the errors', () => {
      const actual = utilities.validate('', values, validation.username);
      expect(actual).toEqual(['This is the required error']);
    });

    it('should validate and return no errors', () => {
      const actual = utilities.validate('value', values, validation.username);
      expect(actual).toEqual([]);
    });
  });

  describe('formHasErrors: ', () => {
    it('should return false is the form is invalid', () => {
      values.username = '';
      const actual = utilities.formHasErrors(values, validation);
      expect(actual).toBe(false);
    });

    it('should return true is the form is valid', () => {
      values.username = 'test';
      const actual = utilities.formHasErrors(values, validation);
      expect(actual).toBe(true);
    });
  });

  describe('evaluateErrors', () => {
    it('should not test the fields if they not touched or do not have validation', () => {
      const touched = {
        username: false,
        password: false,
      };

      const actual = utilities.evaluateErrors(values, validation, touched);

      expect(actual).toEqual({
        username: [],
        password: [],
      });
    });

    it('should test the fields if are touched and do have validation', () => {
      const touched = {
        username: true,
        password: false,
      };

      values.username = '';

      const actual = utilities.evaluateErrors(values, validation, touched);

      expect(actual).toEqual({
        username: ['This is the required error'],
        password: [],
      });
    });
  });
});
