// p.29 lessthanとbooleanを実装

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
  reduce: () => left.reducible ? _add(left.reduce(), right) : right.reducible ? _add(left, right.reduce()) : _number(left.value + right.value),
  toString: () => `${left} + ${right}`
})

const _multiply = (left, right) => assignInspect({
  type: 'multiply',
  left,
  right,
  reducible: true,
  reduce: () => left.reducible ? _multiply(left.reduce(), right) : right.reducible ? _multiply(left, right.reduce()) : _number(left.value * right.value),
  toString: () => `${left} * ${right}`
})

const _boolean = value => assignInspect({
  type: 'boolean',
  value,
  reducible: false,
  toString: () => value.toString()
})

const _lessthan = (left, right) => assignInspect({
  toString: () => `${left} < ${right}`,
  reducible: true,
  reduce: () => left.reducible ? _lessthan(left.reduce(), right) : right.reducible ? _lessthan(left, right.reduce()) : _boolean(left.value < right.value)
})

const _machine = expression => {
  const step = () => { expression = expression.reduce() }
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
  _lessthan(_number(5), _add(_number(2), _number(2)))
).run()
