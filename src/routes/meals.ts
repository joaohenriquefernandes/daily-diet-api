import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import dayjs from 'dayjs'
import { randomUUID } from 'node:crypto'

export async function MealsRoutes(app: FastifyInstance) {
  app.post('/meals', async (request, reply) => {
    const createMealsSchema = z.object({
      name: z
        .string({ required_error: 'Name is required' })
        .min(3, 'Enter at least 3 characters'),
      description: z.string(),
      datetime: z.coerce.date(),
      isOnTheDiet: z.boolean({ required_error: 'Is on the diet is required' }),
    })

    const { name, description, datetime, isOnTheDiet } =
      createMealsSchema.parse(request.body)

    const datetimeFormated = dayjs(datetime).format('YYYY-MM-DD HH:mm:ss')

    await knex('meals').insert({
      id: randomUUID(),
      name,
      description,
      created_at: datetimeFormated,
      is_on_the_diet: isOnTheDiet,
    })

    return reply.status(201).send()
  })

  app.get('/meals', async (request, reply) => {
    const meals = await knex('meals').select('*')

    return reply.send({ meals })
  })
}
