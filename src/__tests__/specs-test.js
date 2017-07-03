const {
  assertArray,
  assertCamelCasedString,
  assertNonEmptyObject,
  assertNonEmptyString,
  createTypeError,
  isDefined,
} = require('@carnesen/util')

const specs = require('../specs')

const TYPES = ['string', 'number', 'boolean', 'array', 'object']

function assertParameter (parameter) {
  assertNonEmptyObject(parameter)
  assertCamelCasedString(parameter.name, 'parameter name')
  assertNonEmptyString(parameter.description, 'parameter description')
  if (!TYPES.includes(parameter.type)) {
    throw createTypeError('parameter type', `one of ${TYPES}`)
  }
  if (parameter.type === 'array' && !TYPES.includes(parameter.itemType)) {
    throw createTypeError('array parameter itemType', `one of ${TYPES}`)
  }
}

function assertSpec (spec) {
  it(`${spec.name} has the right properties`, function () {
    assertNonEmptyObject(spec)
    assertCamelCasedString(spec.name, 'name')
    assertNonEmptyString(spec.description, 'description')
    if (isDefined(spec.parameters)) {
      assertArray(spec.parameters)
      spec.parameters.forEach(assertParameter)
    }
  })
}

describe(__filename, function () {
  it('specs is an array', function () {
    assertArray(specs)
  })
  specs.forEach(assertSpec)
})
