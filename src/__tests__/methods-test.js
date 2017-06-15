const {
  assertArray,
  assertCamelCasedString,
  assertNonEmptyObject,
  assertNonEmptyString,
  createTypeError,
  isDefined,
} = require('@carnesen/util')

const {methods} = require('../index')

function assertParameter (parameter) {
  assertNonEmptyObject(parameter)
  assertCamelCasedString(parameter.name, 'parameter name')
  assertNonEmptyString(parameter.description, 'parameter description')
  if (!['string', 'number'].includes(parameter.type)) {
    throw createTypeError('parameter type', 'either "string" or "number"')
  }
}

function assertMethod (method) {
  it(`${method.name} has the right properties`, function () {
    assertNonEmptyObject(method)
    assertCamelCasedString(method.name, 'name')
    assertNonEmptyString(method.description, 'description')
    if (isDefined(method.parameters)) {
      assertArray(method.parameters)
      method.parameters.forEach(assertParameter)
    }
  })
}

describe(__filename, function () {
  it('methods is an array', function () {
    assertArray(methods)
  })
  methods.forEach(assertMethod)
})
