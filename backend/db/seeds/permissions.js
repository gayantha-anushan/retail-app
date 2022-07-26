/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('permissions').del()
  await knex('permissions').insert([
    {
      category:"Item",
      name:"View Items"
  },{
      category:"Item",
      name:"Grouping Items"
  },{
      category:"Item",
      name:"Change Items"
  },{
      category:"Suppliers",
      name:"View Suppliers"
  },{
      category:"Suppliers",
      name:"Change Suppliers"
  },{
      category:"Customers",
      name:"Change Customers"
  },{
      category:"Customers",
      name:"View Customers"
  },{
      category:"VAT",
      name:"View VAT"
  },{
      category:"VAT",
      name:"Change VAT"
  },{
      category:"Administrate",
      name:"Main Settings"
  },{
      category:"Administrate",
      name:"User Creation"
  },{
      category:"Administrate",
      name:"User Permitting"
  },{
      category:"Administrate",
      name:"Excel Upload"
  },{
      category:"Petty Cash",
      name:"Petty Administrate"
  },{
      category:"Petty Cash",
      name:"Petty View"
  },{
      category:"Petty Cash",
      name:"Petty Expense"
  },{
      category:"Petty Cash",
      name:"Petty Set Off"
  },{
      category:"Main Expenses",
      name:"Main View"
  },{
      category:"Main Expenses",
      name:"Main Administrate"
  },{
      category:"Main Expenses",
      name:"Main Expense"
  },{
      category:"Main Expenses",
      name:"Main Set Off"
  },{
      category:"Purchase",
      name:"Edit PO"
  },{
      category:"Purchase",
      name:"View PO"
  },{
      category:"Purchase",
      name:"Edit GRN"
  },{
      category:"Purchase",
      name:"View GRN"
  },{
      category:"Purchase",
      name:"Edit GREN"
  },{
      category:"Purchase",
      name:"View GREN"
  },{
      category:"Sell",
      name:"Edit Order"
  },{
      category:"Sell",
      name:"View Order"
  },{
      category:"Sell",
      name:"Edit Invoice"
  },{
      category:"Sell",
      name:"View Invoice"
  },{
      category:"Sell",
      name:"Edit IRN"
  },{
      category:"Sell",
      name:"View IRN"
  },{
      category:"Payment",
      name:"Recipt"
  },{
      category:"Payment",
      name:"Payment"
  },{
      category:"Payment",
      name:"Supplier Set Off"
  },{
      category:"STC Report",
      name:"Create STC"
  },{
      category:"STC Report",
      name:"Print STC"
  },{
      category:"STC Report",
      name:"Edit STC"
  },{
      category:"STC Report",
      name:"History STC"
  },{
      category:"Report",
      name:"Stock Valuation Report"
  }
  ]);
};
