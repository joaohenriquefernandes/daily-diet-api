import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import dayjs from 'dayjs'
import { randomUUID } from 'node:crypto'
import { longestSequenceOfOnes } from '../utils/longestSequencesOfOnes'
import { CheckSessionIdExists } from '../middleware/check-session-id-exists'

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

    let { sessionId } = request.cookies

    if (!sessionId) {
      sessionId = randomUUID()

      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7days
      })
    }

    const { name, description, datetime, isOnTheDiet } =
      createMealsSchema.parse(request.body)

    const datetimeFormated = dayjs(datetime).format('YYYY-MM-DD HH:mm:ss')

    await knex('meals').insert({
      id: randomUUID(),
      session_id: sessionId,
      name,
      description,
      created_at: datetimeFormated,
      is_on_the_diet: isOnTheDiet,
    })

    return reply.status(201).send()
  })

  app.get(
    '/meals',
    { preHandler: [CheckSessionIdExists] },
    async (request, reply) => {
      const { sessionId } = request.cookies
      const meals = await knex('meals')
        .where({ session_id: sessionId })
        .select('*')

      return reply.send({ meals })
    },
  )

  app.get(
    '/meals/:id',
    { preHandler: [CheckSessionIdExists] },
    async (request, reply) => {
      const paramsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = paramsSchema.parse(request.params)

      const { sessionId } = request.cookies

      const [meal] = await knex('meals')
        .where({ id, session_id: sessionId })
        .select('*')

      return reply.send({ meal })
    },
  )

  app.get(
    '/meals/metrics',
    { preHandler: [CheckSessionIdExists] },
    async (request, reply) => {
      const { sessionId } = request.cookies
      const meals = await knex('meals')
        .where({ session_id: sessionId })
        .select('*')

      const totalMeals = meals.length

      const totalMealsInDiet = meals.filter(
        (metric) => metric.is_on_the_diet === 1,
      ).length

      const totalMealsOutDiet = totalMeals - totalMealsInDiet

      const sequence = meals.map((meal) => meal.is_on_the_diet)

      const longerDietSequence = longestSequenceOfOnes(sequence)

      const metrics = {
        totalMeals,
        totalMealsInDiet,
        totalMealsOutDiet,
        longerDietSequence,
      }

      return reply.send({
        metrics,
      })
    },
  )

  app.delete(
    '/meals/:id',
    { preHandler: [CheckSessionIdExists] },
    async (request, reply) => {
      const paramsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = paramsSchema.parse(request.params)

      const { sessionId } = request.cookies

      await knex('meals').where({ id, session_id: sessionId }).delete()

      return reply.status(204).send()
    },
  )

  app.put(
    '/meals/:id',
    { preHandler: [CheckSessionIdExists] },
    async (request, reply) => {
      const paramsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = paramsSchema.parse(request.params)

      const createMealsSchema = z.object({
        name: z.string(),
        description: z.string(),
        datetime: z.coerce.date(),
        isOnTheDiet: z.boolean(),
      })

      const { name, description, datetime, isOnTheDiet } =
        createMealsSchema.parse(request.body)

      const datetimeFormated = dayjs(datetime).format('YYYY-MM-DD HH:mm:ss')

      const { sessionId } = request.cookies

      const [meal] = await knex('meals')
        .where({ id, session_id: sessionId })
        .select('*')

      await knex('meals')
        .where({ id, session_id: sessionId })
        .update({
          ...meal,
          name,
          description,
          created_at: datetimeFormated,
          is_on_the_diet: isOnTheDiet,
        })

      return reply.status(204).send()
    },
  )
}
