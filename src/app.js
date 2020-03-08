import 'dotenv/config'
import 'core-js/stable'
import 'regenerator-runtime/runtime'
import express from 'express'
import bodyparser from 'body-parser'
import cors from 'cors'
import expressPlayground from 'graphql-playground-middleware-express'
import graphqlHTTP from 'express-graphql'
import { express as voyagerMiddleware } from 'graphql-voyager/middleware'
import schema from './schema'

const app = express()
const PORT = process.env.PORT || 3000

app.use(
  '/graphql',
  cors(),
  bodyparser.json(),
  graphqlHTTP({
    schema,
    graphiql: false
  })
)

app.use('/voyager', voyagerMiddleware({ endpointUrl: '/graphql' }))

app.get('/playground', expressPlayground({ endpoint: '/graphql' }))

app.listen(PORT, () => {
  console.log(`GraphQL server listening on http://localhost:${PORT}/graphql`)
  console.log(`Voyager http://localhost:${PORT}/voyager`)
})
