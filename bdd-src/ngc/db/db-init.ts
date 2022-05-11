import { envConfig } from "../../env-config";
export default `CREATE TABLE IF NOT EXISTS ${envConfig.adtTables.adtAddresses} (
  id uuid PRIMARY KEY default md5(random()::text || clock_timestamp()::text)::uuid,
  site_number int not null,
  city text not null,
  province text not null,
  street_name text not null,
  street_number varchar(50) not null,
  unit_number varchar(50) default null,
  addr_line text not null ,
  lpdsid int,
  env varchar(10) default 'prod',
  migrating boolean default false,
  migrated boolean default false,
  skipped boolean default false,
  failed boolean default false,
  error text default null,
  created_date timestamp default now()::timestamp,
  modified_date timestamp default now()::timestamp
);
CREATE TABLE IF NOT EXISTS ${envConfig.adtTables.adtCustomers} (
  id uuid PRIMARY KEY default md5(random()::text || clock_timestamp()::text)::uuid,
  address_id uuid, CONSTRAINT fk_customer_address FOREIGN KEY (address_id) REFERENCES ${envConfig.adtTables.adtAddresses}(id),
  act_package_id varchar(100) not null
  panel_type varchar(100) not null,
  site_number int not null,
  ecid int not null,
  ban int not null,
  is_gr boolean not null,
  has_video text not null,
  panel_required text not null,
  adc_acc_number int not null,
  panel_version varchar(10),
  cms_acc_number text not null,
  transmitter_id varchar(100) not null,
  receiver_number varchar(100) not null default '',
  c_start_date text,
  c_end_date text,
  term text,
  addon_features text default '',
  services_price float default 0,
  so_id text,
  env varchar(10) default 'prod',
  migrating boolean default false,
  migrated boolean default false,
  skipped boolean default false,
  validated boolean default false,
  failed boolean default false,
  validated boolean default false,
  error text default null,
  created_date timestamp default now()::timestamp,
  modified_date timestamp default now()::timestamp,
  type text,
  last_name text,
  first_name text,
  lang text,
  primary_np varchar(),
  mobile_np varchar(),
  contact_type varchar(),
  addons text,
  pap_skipped boolean,
);
CREATE table IF NOT EXISTS ${envConfig.adtTables.adtCommitments} (
  id uuid PRIMARY KEY default md5(random()::text || clock_timestamp()::text)::uuid,
  address_id uuid, CONSTRAINT fk_commitment_address FOREIGN KEY (address_id) REFERENCES ${envConfig.adtTables.adtAddresses}(id),
  start_date date not null,
  end_date date not null,
  term int default null,
  offer_id text,
  env varchar(10) default 'prod',
  created_date timestamp default now()::timestamp,
  modified_date timestamp default now()::timestamp
);
CREATE TABLE IF NOT EXISTS ${envConfig.adtTables.adtServices} (
  id uuid PRIMARY KEY default md5(random()::text || clock_timestamp()::text)::uuid,
  address_id uuid, CONSTRAINT fk_service_address FOREIGN KEY (address_id) REFERENCES ${envConfig.adtTables.adtAddresses}(id),
  recline_no int not null,
  bill_code varchar(30) not null,
  monthly_amt float8 not null default 0,
  recur_start_date text default '',
  recur_end_date text default '',
  env varchar(10) default 'prod',
  created_date timestamp default now()::timestamp,
  modified_date timestamp default now()::timestamp
);
CREATE TABLE IF NOT EXISTS ${envConfig.adtTables.adtDiscounts} (
  id uuid PRIMARY KEY default md5(random()::text || clock_timestamp()::text)::uuid,
  address_id uuid, CONSTRAINT fk_discount_address FOREIGN KEY (address_id) REFERENCES ${envConfig.adtTables.adtAddresses}(id),
  service_id uuid, CONSTRAINT fk_discount_service FOREIGN KEY (service_id) REFERENCES ${envConfig.adtTables.adtServices}(id),
  recline_no int not null,
  disc_id varchar(30) not null,
  disc_rate float8 not null default 0,
  disc_amt float8 not null default 0,
  recur_start_date text default '',
  recur_end_date text default '',
  env varchar(10) default 'prod',
  created_date timestamp default now()::timestamp,
  modified_date timestamp default now()::timestamp
);
CREATE TABLE IF NOT EXISTS ${envConfig.adtTables.adtBillcodes} (
	id uuid NOT NULL DEFAULT md5(random()::text || clock_timestamp()::text)::uuid,
	address_id uuid NULL,
	bill_code varchar(30) NOT NULL,
	CONSTRAINT adt_migration_billcode_pkey PRIMARY KEY (id),
  CONSTRAINT adt_migration_non_b_billcodes_fk FOREIGN KEY (customer_id) REFERENCES public.adt_migration_customers(id)
);
CREATE TABLE IF NOT EXISTS ${envConfig.adtTables.adtEmpAccounts} (
  id text NULL DEFAULT md5(random()::text || clock_timestamp()::text)::uuid,
	customer_id uuid NULL,
	tsd_code text NULL,
	tm_id varchar(7) NULL,
	CONSTRAINT adt_emp_accounts_pk PRIMARY KEY (id),
	CONSTRAINT adt_emp_accounts_fk FOREIGN KEY (customer_id) REFERENCES public.adt_migration_customers(id)
);`;
