/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('settings').del()
  await knex('settings').insert([
    {
      name:'active',
      status:'yes'
  },
  {
      name:'company_name',
      status:'Please Enter'
  },
  {
      name:'address1',
      status:'Please enter'
  },
  {
      name:'address2',
      status:'Please enter'
  },
  {
      name:'address3',
      status:'Please enter'
  },
  {
      name:'tele',
      status:'Please enter'
  },
  {
      name:'email',
      status:'Please enter'
  }
  ]);
};
