export default class DynError {
  static throwIfUndefined(variable, name) {
    if (variable === undefined) {
      throw new Error(`${name} is undefined`);
    }
  }

  static throwIfNotArray(variable, name) {
    DynError.throwIfUndefined(variable, name);
    if (!Array.isArray(variable)) {
      throw new Error(`${name} is not an array`);
    }
  }

  static throwIfEmpty(arr, name) {
    DynError.throwIfNotArray(arr, name);
    if (arr.length === 0) {
      throw new Error(`${name} is empty`);
    }
  }

  static throwIfNotNumber(variable, name) {
    DynError.throwIfUndefined(variable, name);
    if (typeof variable !== "number") {
      throw new Error(`${name} is not a number`);
    }
  }

  static throwIfNegative(variable, name) {
    DynError.throwIfUndefined(variable, name);
    DynError.throwIfNotNumber(variable, name);
    if (variable < 0) {
      throw new Error(`${name} is negative`);
    }
  }

  static throwIfNotType(variable, type, name) {
    DynError.throwIfUndefined(variable, name);
    if (!(variable instanceof type)) {
      throw new Error(`${name} is not a ${type.name}`);
    }
  }
}
