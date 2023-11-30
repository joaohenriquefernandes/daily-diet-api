import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  knex.schema.createTable('meals', (table) => {
    table.uuid('id').primary().notNullable()
    table.uuid('session_id').index()
    table.string('name').notNullable()
    table.string('description').notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
    table.boolean('is_on_the_diet').notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  knex.schema.dropTable('meals')
}
