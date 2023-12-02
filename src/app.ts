import fastify from 'fastify'
import { MealsRoutes } from './routes/meals'
import cookie from '@fastify/cookie'

export const app = fastify()

app.register(cookie)

app.register(MealsRoutes)
