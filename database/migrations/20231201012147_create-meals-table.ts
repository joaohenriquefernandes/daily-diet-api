import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('meals', (table) => {
    table.uuid('id').primary().notNullable()
    table.uuid('session_id').index()
    table.string('name').notNullable()
    table.string('description').notNullable()
    table.timestamp('created_at').notNullable()
    table.boolean('is_on_the_diet').notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('meals')
}
