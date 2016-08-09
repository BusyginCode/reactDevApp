var warning = require('warning');

const ANONYMOUS = '<<anonymous>>'

const emptyFunction = () => null

export default {
  array: createPrimitiveTypeChecker('array'),
  bool: createPrimitiveTypeChecker('boolean'),
  func: createPrimitiveTypeChecker('function'),
  number: createPrimitiveTypeChecker('number'),
  object: createPrimitiveTypeChecker('object'),
  string: createPrimitiveTypeChecker('string'),
  symbol: createPrimitiveTypeChecker('symbol'),

  any: createAnyTypeChecker(),
  arrayOf: createArrayOfTypeChecker,
  element: createElementTypeChecker(),
  instanceOf: createInstanceTypeChecker,
  objectOf: createObjectOfTypeChecker,
  oneOf: createEnumTypeChecker,
  oneOfType: createUnionTypeChecker,
  shape: createShapeTypeChecker,
};

// node: createNodeChecker(),

/*
* Primitive checker
*/

function createChainableTypeChecker(validate) {
  function checkType(isOptional, value) {
    if (value == null) {
      if (isOptional) {
        if (value === null) {
          return new Error(
            `The ${value} is marked as required, but its value is \`null\`.`
          );
        }
        return new Error(
          `The ${value} is marked as required, but its value is \`undefined\`.`
        );
      }
      return null;
    } else {
      return validate(value);
    }
  }

  const chainedCheckType = checkType.bind(null, false);
  chainedCheckType.isOptional = checkType.bind(null, true);

  return chainedCheckType;
}

function createPrimitiveTypeChecker(expectedType) {
  function validate(value) {
    const propType = getPropType(value);
    if (propType !== expectedType) {
      var preciseType = getPreciseType(value);
      return new Error(
        `Invalid type!`
      );
    }
    return null;
  }
  return createChainableTypeChecker(validate);
}

const getPropType = propValue => {
  var propType = typeof propValue
  if (Array.isArray(propValue)) {
    return 'array'
  } else if (propValue instanceof RegExp) {
    return 'object'
  } else if (isSymbol(propType, propValue)) {
    return 'symbol'
  }
  return propType
};

const getPreciseType = propValue => {
  var propType = getPropType(propValue)
  if (propType === 'object') {
    if (propValue instanceof Date) {
      return 'date'
    } else if (propValue instanceof RegExp) {
      return 'regexp'
    }
  }
  return propType
};

const isSymbol = (propType, propValue) => {
  if (propType === 'symbol' || 
    propValue['@@toStringTag'] === 'Symbol' || 
    typeof Symbol === 'function' && propValue instanceof Symbol
  ) {
    return true
  }
  return false
};

const getClassName = propValue =>
  !propValue.constructor || !propValue.constructor.name 
    ? ANONYMOUS
    : propValue.constructor.name


/*
* Other checkers
*/


function createAnyTypeChecker() {
  return createChainableTypeChecker(emptyFunction);
}

/*eslint-disable no-self-compare*/
function is(x, y) {
  // SameValue algorithm
  if (x === y) { // Steps 1-5, 7-10
    // Steps 6.b-6.e: +0 != -0
    return x !== 0 || 1 / x === 1 / y;
  } else {
    // Step 6.a: NaN == NaN
    return x !== x && y !== y;
  }
}
/*eslint-enable no-self-compare*/

function createArrayOfTypeChecker(typeChecker) {
  function validate(value) {
    if (typeof typeChecker !== 'function') {
      return new Error(
        `Property of component has invalid PropType notation inside arrayOf.`
      );
    }
    if (!Array.isArray(value)) {
      var propType = getPropType(value);
      return new Error(
        `Invalid of type supplied to , expected an array.`
      );
    }
    for (var i = 0; i < value.length; i++) {
      var error = typeChecker(value[i]);
      if (error instanceof Error) {
        return error;
      }
    }
    return null;
  }
  return createChainableTypeChecker(validate);
}

function createElementTypeChecker() {
  function validate(value) {
    if (!React.isValidElement(value)) {
      var propType = getPropType(value);
      return new Error(
        `Invalid of type supplied to, expected a single React.`
      );
    }
    return null;
  }
  return createChainableTypeChecker(validate);
}

function createInstanceTypeChecker(expectedClass) {
  function validate(value) {
    if (value instanceof expectedClass) {
      var expectedClassName = expectedClass.name || ANONYMOUS;
      var actualClassName = getClassName(value);
      return new Error(
        `Invalid of type ` +
        `\`${actualClassName}\` supplied to, expected ` +
        `instance of \`${expectedClassName}\`.`
      );
    }
    return null;
  }
  return createChainableTypeChecker(validate);
}

function createEnumTypeChecker(expectedValues) {
  if (!Array.isArray(expectedValues)) {
    warning(false, 'Invalid argument supplied to oneOf, expected an instance of array.');
    return emptyFunction;
  }

  function validate(value) {
    for (var i = 0; i < expectedValues.length; i++) {
      if (is(value, expectedValues[i])) {
        return null;
      }
    }

    var valuesString = JSON.stringify(expectedValues);
    return new Error(
      `Invalid of value supplied to, expected one of ${valuesString}.`
    );
  }
  return createChainableTypeChecker(validate);
}

function createObjectOfTypeChecker(typeChecker) {
  function validate(value) {
    if (typeof typeChecker !== 'function') {
      return new Error(
        `Property of component has invalid PropType notation inside objectOf.`
      );
    }
    var propType = getPropType(value);
    if (propType !== 'object') {
      return new Error(
        `Invalid of type ` +
        `\`${propType}\` supplied to, expected an object.`
      );
    }
    for (var key in value) {
      if (value.hasOwnProperty(key)) {
        var error = typeChecker(value[key]);
        if (error instanceof Error) {
          return error;
        }
      }
    }
    return null;
  }
  return createChainableTypeChecker(validate);
}

function createUnionTypeChecker(arrayOfTypeCheckers) {
  if (!Array.isArray(arrayOfTypeCheckers)) {
    warning(false, 'Invalid argument supplied to oneOfType, expected an instance of array.');
    return emptyFunction;
  }

  function validate(value) {
    for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
      var checker = arrayOfTypeCheckers[i];
      if (
        checker(value) == null
      ) {
        return null;
      }
    }

    return new Error(
      `Invalid supplied to.`
    );
  }
  return createChainableTypeChecker(validate);
}



function createShapeTypeChecker(shapeTypes) {
  function validate(value) {
    var propType = getPropType(value);
    if (propType !== 'object') {
      return new Error(
        `Invalid of type \`${propType}\` ` +
        `supplied to, expected \`object\`.`
      );
    }
    for (var key in shapeTypes) {
      var checker = shapeTypes[key];
      if (!checker) {
        continue;
      }
      var error = checker(value);
      if (error) {
        return error;
      }
    }
    return null;
  }
  return createChainableTypeChecker(validate);
}











// export default {
//   bool: new validation("boolean"),
//   array: new validation("array"),
//   string: new validation("string"),
//   func: new validation("function"),
//   number: new validation("number"),
//   object: new validation("object"),
//   symbol: new validation("symbol")
// }

// const isType = (value, type) => typeof value !== type && (type == "array" && !Array.isArray(value)) ? Error("Is not correct value") : null

// function validation(type) { 

//   this.isOptional = (value) => 
//     value === undefined ? Error("Value is undefined") : isType(value, type)

//   this.isNotOptional = (value) => 
//     isType(value, type)
// }