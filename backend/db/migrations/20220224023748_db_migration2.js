/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    .createTable("stakeholders",function(table){
        table.increments("id").notNullable().primary();
        table.string("name",60).notNullable();
        table.string("address1",60).notNullable();
        table.string("address2",60).notNullable();
        table.string("address3",60).notNullable();
        table.string("email",60).notNullable();
        table.string("telephone",60).notNullable();
        table.string("type",20).notNullable();
        table.string("status",10).notNullable().defaultTo("ACTIVE");
    })
    .createTable("settings",function(table){
        table.increments("id").notNullable().primary();
        table.string("name",60).notNullable();
        table.string("status",60).notNullable();
    })
    .createTable("transactions",function(table){
        table.increments("id").notNullable().primary();
        table.decimal("amount",18,2);
        table.decimal("cash",18,2);
        table.decimal("bank",18,2);
        table.decimal("cheque",18,2);
        table.string("bankid",60);
        table.string("chequeid",60);
    })
    .createTable("stc_doc",function(table){
        table.increments("id").notNullable().primary();
        table.string("ref",60);
        table.integer("category");
        table.integer("sub_cat");
        table.date("date_begin").notNullable();
        table.date("date_end");
        table.integer("status").defaultTo(1).notNullable();
    })
    .createTable("stc_doc_items",function(table){
        table.integer("item").unsigned().references("id").inTable("items");
        table.integer("document").unsigned().references("id").inTable("stc_doc");
        table.decimal("unit_price",18,2).notNullable();
        table.decimal("avg_price",18,2).notNullable();
        table.decimal("last_system",18,3).notNullable();
        table.decimal("last_physical",18,3);
        table.decimal("variance_qty",18,3);
        table.decimal("variance_total",18,2);
        table.string("status",15).notNullable().defaultTo("NOT_UPDATED");
        table.string("item_status",20);
    })
    .createTable("petty_account",function(table){
        table.increments("id").notNullable().primary();
        table.string("code",100).notNullable();
        table.string("name",200).notNullable();
        table.decimal("amount",18,2).notNullable();
    })
    .createTable("petty_type",function(table){
        table.increments("id").notNullable().primary();
        table.string("name",150).notNullable();
        table.integer("account").unsigned().notNullable().references("id").inTable("petty_account");
    })
    .createTable("petty_book",function (table) {
        table.increments("id").notNullable().primary();
        table.string("transaction_type",3).notNullable();
        table.integer("account").unsigned().notNullable().references("id").inTable("petty_account");
        table.integer("type").unsigned().nullable().references("id").inTable("petty_type");
        table.string("reason",200);
        table.decimal("amount",18,2).notNullable();
        table.string("remarks",200).notNullable();
        table.string("settle",3);
    })
    .createTable("advances",function(table){
        table.increments("id").notNullable().primary();
        table.date("date").notNullable();
        table.integer("stake_id").unsigned().notNullable().references("id").inTable("stakeholders");
        table.decimal("available",18,2).notNullable();
        table.decimal("total",18,2).notNullable();
        table.integer("trans_id").unsigned().notNullable().references("id").inTable("transactions");
        table.text("remark","string");
    })
    .createView("items_by_group",function(view){
        view.as(knex(knex.raw("categories,items,types")).select('items.*').select("categories.name as catrgory").select("types.name as typei")
        .where("types.category_id","=",knex.raw("categories.id")).where("items.type","=",knex.raw("types.id"))
        );
    })
    .createTable("main_account",function(table){
        table.increments("id").notNullable().primary();
        table.string("code",100).notNullable();
        table.string("name",200).notNullable();
    })
    .createTable("main_types",function(table){
        table.increments("id").notNullable().primary();
        table.string("name",150).notNullable();
        table.integer("account_id").unsigned().notNullable().references("id").inTable("main_account");
    })
    .createTable("main_transes",function(table){
        table.increments("id").notNullable().primary();
        table.date("date").notNullable();
        table.integer("account").unsigned().notNullable().references("id").inTable("main_account");
        table.integer("type").unsigned().notNullable().references("id").inTable("main_types");
        table.string("description",200).notNullable();
        table.decimal("amount",18,2).notNullable();
        table.decimal("completed",18,2).notNullable();
        table.string("remarks",200);
    })
    .createTable("main_trans_transactions",function (table) { 
        table.date("date").notNullable();
        table.integer("main_trans_id").unsigned().notNullable().references("id").inTable("main_transes");
        table.integer("transaction_id").unsigned().notNullable().references("id").inTable("transactions");
     })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
};
