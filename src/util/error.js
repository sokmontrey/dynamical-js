export function throwIfUndefined(variable, name) {
  if (variable === undefined) {
    throw new Error(`${name} is undefined`);
  }
}

export function throwIfEmpty(arr, name) {
  if (arr.length === 0) {
    throw new Error(`${name} is empty`);
  }
}

export function throwIfNotNumber(variable, name) {
  throwIfUndefined(variable, name);
  if (typeof variable !== "number") {
    throw new Error(`${name} is not a number`);
  }
}

export function throwIfNegative(variable, name) {
  throwIfUndefined(variable, name);
  throwIfNotNumber(variable, name);
  if (variable < 0) {
    throw new Error(`${name} is negative`);
  }
}

export function throwIfNotType(variable, type, name) {
  throwIfUndefined(variable, name);
  if (!(variable instanceof type)) {
    throw new Error(`${name} is not a ${type.name}`);
  }
}
