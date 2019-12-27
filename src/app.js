import 'dotenv/config'
import express from 'express'
import bodyparser from 'body-parser'
import cors from 'cors'
import expressPlayground from 'graphql-playground-middleware-express'
import graphqlHTTP from 'express-graphql'
import schema from './schema'

const app = express()
const PORT = process.env.PORT || 5000

app.use(
  '/graphql',
  cors(),
  bodyparser.json(),
  graphqlHTTP({
    schema,
    graphiql: false
  })
)

app.get('/playground', expressPlayground({ endpoint: '/graphql' }))

app.listen(PORT, () => console.log(`Server listening on port ${PORT}...`))
