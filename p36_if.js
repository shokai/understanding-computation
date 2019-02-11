// p.36 if文

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
    reduce: environment => expression.reducible ? [_assign(name, expression.reduce(environment)), environment] : [_donothing(), Object.assign(environment, o)]
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
  _if(
    _variable('x'),
    _assign('y', _number(1)),
    _assign('y', _number(2))
  ),
  { x: _boolean(true) }
).run()

_machine(
  _if(
    _variable('x'),
    _assign('y', _number(1)),
    _donothing()
  ),
  { x: _boolean(false) }
).run()
