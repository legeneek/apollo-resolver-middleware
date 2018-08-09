/**
 * apply middleware for apollo graphql resolver
 */

module.exports = applyMiddleware

let middlewareMap = {}
let originResolver = {}

function applyMiddleware(resolvers, path, fn) {
  const [t, f] = path.split('.')
  let resolver
  if (resolvers[t] && typeof resolvers[t][f] === 'function') {
    if (!originResolver[path]) {
      originResolver[path] = resolvers[t][f]
    }
    resolver = originResolver[path]
    if (!Array.isArray(middlewareMap[path])) {
      middlewareMap[path] = []
    }
    middlewareMap[path].push(fn)
    resolvers[t][f] = compose(middlewareMap[path], resolver)
  }
}

function compose(middleware, next) {
  if (!Array.isArray(middleware)) throw new TypeError('Middleware stack must be an array!')
  for (const fn of middleware) {
    if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!')
  }

  return function (parent, args, context, info) {
    function dispatch(i) {
      let fn = middleware[i]
      if (i === middleware.length) {
        return next(parent, args, context, info)
      }
      return fn && fn(args, context, dispatch.bind(null, i + 1))
    }

    return dispatch(0)
  }
}