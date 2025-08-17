export async function up(knex) {
    await knex.schema.alterTable('transactions', (table) => {
        table.uuid('session_id').after('id').index();
    });
}
export async function down(knex) {
    await knex.schema.alterTable('transactions', (table) => {
        table.dropColumn('session_id');
    });
}
//# sourceMappingURL=20250816222109_add-session-id-to-transactions.js.map