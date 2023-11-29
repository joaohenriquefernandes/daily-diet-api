import fastify from 'fastify'

const app = fastify()

app.get('/', async (request, reply) => {
  return reply.send('Hello world')
})

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('HTTP Server Running in http://localhost:3333')
  })
