import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import dayjs from 'dayjs'
import { randomUUID } from 'node:crypto'
import { longestSequenceOfOnes } from '../utils/longestSequencesOfOnes'

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

  app.get('/meals/:id', async (request, reply) => {
    console.log(request.params)
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const [meal] = await knex('meals').where({ id }).select('*')

    return reply.send({ meal })
  })

  app.get('/meals/metrics', async (request, reply) => {
    const meals = await knex('meals').select('*')

    const totalMeals = meals.length

    const totalMealsInDiet = meals.filter(
      (metric) => metric.is_on_the_diet === 1,
    ).length

    const totalMealsOutDiet = totalMeals - totalMealsInDiet

    const sequence = meals.map((meal) => meal.is_on_the_diet)

    const longerDietSequence = longestSequenceOfOnes(sequence)

    return reply.send({
      totalMeals,
      totalMealsInDiet,
      totalMealsOutDiet,
      longerDietSequence,
    })
  })

  app.delete('/meals/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    await knex('meals').where({ id }).delete()

    return reply.status(204).send()
  })

  app.put('/meals/:id', async (request, reply) => {
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

    const [meal] = await knex('meals').where({ id }).select('*')

    await knex('meals')
      .where({ id })
      .update({
        ...meal,
        name,
        description,
        created_at: datetimeFormated,
        is_on_the_diet: isOnTheDiet,
      })

    return reply.status(204).send()
  })
}
