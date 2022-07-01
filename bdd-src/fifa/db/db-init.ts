export default `create table ta_addresses (
  id serial primary key,
  lpdsid int8 not null,
  city text,
  province text,
  type text default 'LTE',
  env varchar(5) default 'itn01',
  tc_id int8,
  used boolean default false,
  cleanup_ready boolean default false,
  created_date timestamp default now(),
  modified_date timestamp default now()
);`;
