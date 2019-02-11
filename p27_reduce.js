// p.27のreduceして式を再帰的に評価する所まで

const assignInspect = target => Object.assign(target, {
  inspect: function () { return `<<${this.toString()}>>` }
})

const _number = value => assignInspect({
  type: 'number',
  value,
  reducible: false,
  reduce: () => value,
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

let exp = _add(
  _multiply(_number(1), _number(2)),
  _multiply(_number(3), _number(4))
)

console.log(exp)
console.log(exp = exp.reduce())
console.log(exp = exp.reduce())
console.log(exp = exp.reduce())
