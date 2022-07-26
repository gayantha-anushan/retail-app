/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */

exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del()
  await knex('users').insert([
    {username:"Admin",password:"672a7270a58e4eed2beff27cebb48b87",occupation:"Admin"}
  ]);
};
