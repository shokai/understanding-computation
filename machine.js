// p.28 式を再帰的にreduceしていくmachineを実装した

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

const exp = _add(
  _multiply(_number(1), _number(2)),
  _multiply(_number(3), _number(4))
)

_machine(exp).run()
