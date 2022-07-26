/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    .createTable("users",function(table){
        table.increments("id").notNullable().primary();
        table.string("username",60).notNullable();
        table.string("password",60).notNullable();
        table.string("occupation",60).notNullable();
    })
    .createTable("vats",function(table){
        table.increments("id").notNullable().primary();
        table.string("name",50).notNullable();
        table.string("percentage",20);
        table.string("invoice",20);
        table.string("action",20);
        table.tinyint("active",1).defaultTo(1).notNullable();
    })
    .createTable("permissions",function(table){
        table.increments("id").notNullable().primary();
        table.string("category",60).notNullable();
        table.string("name",60).notNullable();
    })
    .createTable("user_permission",function(table){
        table.integer("user_id").unsigned().notNullable().references("id").inTable("users");
        table.integer("permission_id").unsigned().notNullable().references("id").inTable("permissions");
    })
    .createTable("categories",function(table){
        table.increments("id").notNullable().primary();
        table.string("name",60).notNullable();
    })
    .createTable("types",function(table){
        table.increments("id").notNullable().primary();
        table.string("name",60).notNullable();
        table.integer("category_id").notNullable().unsigned().references("id").inTable("categories");
    })
    .createTable("items",function(table){
        table.increments("id").notNullable().primary();
        table.string("code",30).notNullable();
        table.string("name",30).notNullable();
        table.text("description","string").notNullable();
        table.string("unit",20).notNullable();
        table.integer("type").unsigned().references("id").inTable("types");
        table.decimal("quantity",18,3).notNullable().defaultTo(0.00);
        table.decimal("price",18,2);
        table.string("discount",20);
        table.decimal("orders",18,3);
        table.string("sttatus",10).defaultTo("ACTIVE");
        table.integer("rep_block").defaultTo(0);
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
    .dropTable("users")
};
