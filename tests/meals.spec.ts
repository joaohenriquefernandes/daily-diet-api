import { app } from '../src/app'
import request from 'supertest'
import { describe, beforeAll, afterAll, beforeEach, it, expect } from 'vitest'
import { execSync } from 'node:child_process'

describe('Meals Routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('Should be able to create a new meal', async () => {
    await request(app.server)
      .post('/meals')
      .send({
        name: 'Coffe Break',
        description: 'coffe and bread',
        isOnTheDiet: true,
        datetime: '2023-01-01 12:00:00',
      })
      .expect(201)
  })

  it('should be able to list all meals', async () => {
    const createMealsResponse = await request(app.server).post('/meals').send({
      name: 'Coffe Break',
      description: 'coffe and bread',
      isOnTheDiet: true,
      datetime: '2023-01-01 12:00:00',
    })

    const cookies = createMealsResponse.get('Set-Cookie')

    const listMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)

    expect(listMealsResponse.body.meals).toEqual([
      expect.objectContaining({
        name: 'Coffe Break',
        description: 'coffe and bread',
        is_on_the_diet: 1,
        created_at: '2023-01-01 12:00:00',
      }),
    ])
  })

  it('should be able to get a specific meal', async () => {
    const createMealResponse = await request(app.server).post('/meals').send({
      name: 'Coffe Break',
      description: 'coffe and bread',
      isOnTheDiet: true,
      datetime: '2023-01-01 12:00:00',
    })

    const cookies = createMealResponse.get('Set-Cookie')

    const listMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)

    const mealId = listMealsResponse.body.meals[0].id

    const getMealResponse = await request(app.server)
      .get(`/meals/${mealId}`)
      .set('Cookie', cookies)
      .expect(200)

    expect(getMealResponse.body.meal).toEqual(
      expect.objectContaining({
        name: 'Coffe Break',
        description: 'coffe and bread',
        is_on_the_diet: 1,
        created_at: '2023-01-01 12:00:00',
      }),
    )
  })

  it('Should be able to get the metrics', async () => {
    const createMealResponse = await request(app.server).post('/meals').send({
      name: 'Coffe Break',
      description: 'coffe and bread',
      isOnTheDiet: true,
      datetime: '2023-01-01 12:00:00',
    })

    const cookies = createMealResponse.get('Set-Cookie')

    await request(app.server).post('/meals').set('Cookie', cookies).send({
      name: 'Dinner',
      description: 'Petit gateu',
      isOnTheDiet: false,
      datetime: '2023-01-01 18:00:00',
    })

    const getMetricsMealsResponse = await request(app.server)
      .get('/meals/metrics')
      .set('Cookie', cookies)
      .expect(200)

    expect(getMetricsMealsResponse.body.metrics).toEqual({
      totalMeals: 2,
      totalMealsInDiet: 1,
      totalMealsOutDiet: 1,
      longerDietSequence: 1,
    })
  })

  it('Should be able to update a specific meal', async () => {
    const createMealResponse = await request(app.server).post('/meals').send({
      name: 'Coffe Break',
      description: 'coffe and bread',
      isOnTheDiet: true,
      datetime: '2023-01-01 12:00:00',
    })

    const cookies = createMealResponse.get('Set-Cookie')

    const listMealResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)

    const mealId = listMealResponse.body.meals[0].id

    await request(app.server)
      .put(`/meals/${mealId}`)
      .set('Cookie', cookies)
      .send({
        name: 'Coffe',
        description: 'coffe and bread with cheese',
        isOnTheDiet: false,
        datetime: '2023-01-01 12:00:00',
      })
      .expect(204)
  })

  it('Should be able to delete a specific meal', async () => {
    const createMealResponse = await request(app.server).post('/meals').send({
      name: 'Coffe Break',
      description: 'coffe and bread',
      isOnTheDiet: true,
      datetime: '2023-01-01 12:00:00',
    })

    const cookies = createMealResponse.get('Set-Cookie')

    const listMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)

    const mealId = listMealsResponse.body.meals[0].id

    await request(app.server)
      .delete(`/meals/${mealId}`)
      .set('Cookie', cookies)
      .expect(204)
  })
})
