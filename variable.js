// p.31 variableを実装、machineやadd/multiply等にenvironmentを追加

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

const _machine = (expression, environment) => {
  const step = () => expression = expression.reduce(environment)
  return {
    run: () => {
      while (expression.reducible) {
        console.log(expression)
        step()
      }
      console.log(expression)
    }
  }
}

_machine(
  _add(_variable('x'), _variable('y')),
  { x: _number(3), y: _number(4) }
).run()
