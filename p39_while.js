// p.39 while文, sequence

const assignInspect = target => Object.assign(target, {
  inspect: function () { return `<<${this.toString()}>>` }
})

const _number = value => assignInspect({
  type: 'number',
  value,
  reducible: false,
  toString: () => `${value}`
})

const _add = (left, right) => assignInspect({
  type: 'add',
  left,
  right,
  reducible: true,
  reduce: environment => left.reducible ? _add(left.reduce(environment), right) : right.reducible ? _add(left, right.reduce(environment)) : _number(left.value + right.value),
  toString: () => `${left} + ${right}`
})

const _multiply = (left, right) => assignInspect({
  type: 'multiply',
  left,
  right,
  reducible: true,
  reduce: environment => left.reducible ? _multiply(left.reduce(environment), right) : right.reducible ? _multiply(left, right.reduce(environment)) : _number(left.value * right.value),
  toString: () => `${left} * ${right}`
})

const _boolean = value => assignInspect({
  type: 'boolean',
  value,
  reducible: false,
  toString: () => value.toString()
})

const _lessthan = (left, right) => assignInspect({
  type: 'lessthan',
  toString: () => `${left} < ${right}`,
  reducible: true,
  reduce: environment => left.reducible ? _lessthan(left.reduce(environment), right) : right.reducible ? _lessthan(left, right.reduce(environment)) : _boolean(left.value < right.value)
})

const _variable = name => assignInspect({
  type: 'variable',
  toString: () => name.toString(),
  reducible: true,
  reduce: environment => environment[name]
})

const _donothing = () => assignInspect({
  type: 'donothing',
  toString: () => 'do-nothing',
  equals: statement => statement.type === 'donothing',
  reducible: false
})

const _assign = (name, expression) => {
  const o = {}
  o[name] = expression
  return assignInspect({
    type: 'assign',
    toString: () => `${name} = ${expression}`,
    reducible: true,
    reduce: environment => expression.reducible ? [_assign(name, expression.reduce(environment)), environment] : [_donothing(), Object.assign({}, environment, o)]
  })
}

const _if = (condition, consequence, alternative) => assignInspect({
  toString: () => `if (${condition}) { ${consequence} } else { ${alternative} }`,
  reducible: true,
  reduce: environment => {
    if (condition.reducible) {
      return [_if(condition.reduce(environment), consequence, alternative), environment]
    }
    switch (condition.value) {
      case _boolean(true).value :
        return [consequence, environment]
      case _boolean(false).value :
        return [alternative, environment]
    }
  }
})

const _sequence = (first, second) => assignInspect({
  type: 'sequence',
  toString: () => `${first}; ${second}`,
  reducible: true,
  reduce: environment => {
    if (first.type === 'donothing') {
      return [second, environment]
    }
    const [reduced_first, reduced_environment] = first.reduce(environment)
    return [_sequence(reduced_first, second), reduced_environment]
  }
})

const _while = (condition, body) => assignInspect({
  toString: () => `while (${condition}) { ${body} }`,
  reducible: true,
  reduce: function (environment) {
    return [_if(condition, _sequence(body, this), _donothing()), environment]
  }
})

const _machine = (statement, environment) => {
  const step = () => { [statement, environment] = statement.reduce(environment) }
  return {
    run: () => {
      console.log('---')
      while (statement.reducible) {
        console.log(statement, environment)
        step()
      }
      console.log(statement, environment)
    }
  }
}

_machine(
  _sequence(
    _assign('x', _add(_number(1), _number(1))),
    _assign('y', _add(_variable('x'), _number(3)))
  )
).run()

_machine(
  _while(
    _lessthan(_variable('x'), _number(5)),
    _assign('x', _multiply(_variable('x'), _number(3)))
  ),
  { x: _number(1) }
).run()
