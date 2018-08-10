# install

```
npm i apollo-resolver-middleware
```

# usage

add middlewares in schema.js where resolvers defined

```javascript
const applyResolverMid = require('apollo-resolver-middleware')

const typeDefs = gql`
  type Query {
    getData: Response
  }
  type Response {
    success: Boolean
    message: String
  }
`

const resolvers = {
  Query: {
    getData: (parent, args, context, info) => {
      return {
        success: true,
        message: ''
      }
    }
  }
}

applyResolverMid(resolvers, 'Query.getData', (args, context, next) => {
  // do something
  return next()
})

module.exports = { typeDefs, resolvers }

```

# api

```
applyResolverMid(resolvers, path, fn)
```


- resolvers: the apollo resolvers you defined
- path: specific resolver path
- fn: the middleware function

# middleware
- the first tow arguments are `args` and `context` from the graphql resolver
- call `next` to excute the next middleware

```javascript
middleware(args, context, next) {
  return next()
}
```
