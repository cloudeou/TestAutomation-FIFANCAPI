import { adtFlags, commonFlags } from "../../../bdd/steps/common.steps";
import { envConfig } from "../../env-config/index";

export const completeMigrationQuery = (
  tableName: string,
  flag: adtFlags,
  id: string,
  error = ""
) =>
  `update ${tableName} set migrating=false, modified_date=now(), ${flag}=true, error='${error}' where id='${id}'`;

export const completeCommonProcessQuery = (
  tableName: string, 
  id: string, 
  flag: commonFlags,
  error: string = ''
) => 
  `update ${tableName} set modified_date=now(), ${flag}=true, error='${error}' where id=${id}`;

export const getCustomerLpdsidQuery = (addressId: string) =>
  `select lpdsid from ${envConfig.adtTables.adtAddresses} where id='${addressId}'`;

export const getCustomerObjIdQuery = (ecid: number) =>
  `select to_char(OBJECT_ID) from nc_params_ix where ix_key='${ecid}' and ATTR_ID=9138719996013282785`;

export const getHStaskObjectIdQuery = (
  customerObjId: string
) => `select to_char(object_id) from nc_params_ix where attr_id = 9137996003413538340 and ix_key = (select task_id from nc_po_tasks where name = 'Home security Product Manual Task'
and order_id in (select object_id from nc_objects where parent_id = ${customerObjId} and object_type_id = '9150381725313165002')
and status = 9130031781613016721)`;

export const getSalesOrderStatusQuery = (
  salesOrderId: string
): string => `select 
    (case when p.value is null
          and p.DATE_VALUE is null
          then lv.value
          when lv.value is null
          and p.DATE_VALUE is null
          then p.value
          when lv.value is null
          and p.VALUE is null
          then to_char(p.DATE_VALUE)
          else null
          end
      )value
      from nc_attributes a
      left join nc_params p
      on (p.ATTR_ID = a.ATTR_ID)
      left join nc_list_values lv
      on (p.list_value_id = lv.list_value_id)
      where p.object_id =  ${salesOrderId}
      and a.attr_id = '9126090157513456523' /* Sales Order Status */`;

export const getCustomerServicesCostQuery = (
  addressId: string
): string => `with services_cost as (
  select sum(monthly_amt) amount
  from ${envConfig.adtTables.adtServices}
  where address_id='${addressId}' 
  and bill_code not in (select bill_code from ${envConfig.adtTables.adtBillcodes})),
discount_amt as (
  select sum(disc_amt) amount
  from ${envConfig.adtTables.adtDiscounts} as adtd, ${envConfig.adtTables.adtServices} as adts
  where address_id='${addressId}'
  and disc_rate = 0 
  and adtd.service_id = adts.id
  and adts.bill_code not in (select bill_code from ${envConfig.adtTables.adtBillcodes})
  ),
discount_rate_amt as (
  select sum(monthly_amt * disc_rate / 100) amount
  from (
      select adtd.disc_rate, adts.monthly_amt
      from ${envConfig.adtTables.adtServices} adts, ${envConfig.adtTables.adtDiscounts} adtd
      where adts.address_id='${addressId}'
      and adtd.service_id = adts.id
      and adts.bill_code not in (select bill_code from ${envConfig.adtTables.adtBillcodes})
  ) serv_disc
  )
select services_cost.amount - coalesce(discount_amt.amount, 0) - coalesce(discount_rate_amt.amount, 0) as final_cost
from services_cost, discount_amt, discount_rate_amt;`;

export const getCustomerProvince = (
  addressId: string
): string => `with province as (
  select province
  from ${envConfig.adtTables.adtAddresses}
  where address_id='${addressId}'),`;

export const getCustomerAddress = (
  addressId: string
): string => `select * from ${envConfig.adtTables.adtAddresses} where address_id=${addressId}`;

export const getBBillcodeCost = (
  addressId: string
): string => `with billcodeCost as (select monthly_amt
  from ${envConfig.adtTables.adtServices}
  where address_id='${addressId}')`;

export const writeCustomerServicePriceQuery = (
  customerId: string,
  price: number
) =>
  `update ${envConfig.adtTables.adtCustomers} set services_price=${price} where id='${customerId}'`;

export const writeCommitmentSATF = (customerId: string, SATF_Value: number) =>
  `update ${envConfig.adtTables.adt_migraion_commitments} set satf=${SATF_Value} where customer_id='${customerId}'`;

export const writeSoIdQuery = (
  soId: string,
  tableName: string,
  columnName: string,
  id: string
): string => `update ${tableName} set ${columnName}='${soId}' where id='${id}'`;

export const updateLpdsidQuery = (lpdsid: number, id: string): string => `
update adt_migration_addresses
set lpdsid = ${lpdsid}
where id = '${id}';`;
//

export const setPapListFlagsQuery = (ecid: number): string =>
  `update adt_migration_customers set pap_skipped=true where ecid='${ecid}'`;

export const getPapListQuery = (): string =>
  `select ecid from adt_migration_customers where pap_skipped=true`;

export const removePapListFlagsQuery = (ecid: number): string =>
  `update adt_migration_customers set pap_skipped=false where ecid='${ecid}'`;
