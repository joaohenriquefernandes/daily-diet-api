// eslint-disable-next-line
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Table {
    meals: {
      id: string
      name: string
      description: string
      created_at: string
      session_id?: string
      in_on_the_diet: boolean
    }
  }
}
