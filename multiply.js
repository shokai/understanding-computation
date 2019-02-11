const assignInspect = target => Object.assign(target, {inspect: function () { return `<<${this.toString()}>>`}})

const _multiply = (left, right) => assignInspect({type: 'multiply', left, right, toString: () => `${left} * ${right}`})

const _number = value => assignInspect({type: 'number', value, toString: () => `${value}`})

const _add = (left, right) => assignInspect({type: 'add', left, right, toString: () => `${left} + ${right}`})

const res = _add(
  _multiply(_number(1), _number(2)),
  _multiply(_number(3), _number(4))
)

console.log(res)
