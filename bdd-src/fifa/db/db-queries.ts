import { adtFlags, commonFlags } from "../../../bdd/steps/fifa/common.steps";
import { envConfig } from "../env-config/index";

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


export const queryNcCustomerOrdersStatus = (customerId: string | null): string => {
    let query: string = `
                  SELECT
                      orders.name   orders,
                      to_char(orders.object_id),
                      status_id.list_value_id,
                      lv.value      status
                  FROM
                      nc_objects    orders,
                      nc_params     status_id,
                      nc_list_values   lv
                  WHERE
                      orders.object_id = status_id.object_id
                      AND status_id.attr_id = 4063055154013004350 /* Status */
                      AND orders.object_type_id NOT IN (
                          9134179704813622905 /* BOE Composite Order */
                      )
                      AND status_id.object_id IN (
                          SELECT DISTINCT
                              to_char(object_id)
                          FROM
                              nc_references
                          WHERE
                              attr_id = 4122753063013175631 /* Customer Account */
                              AND reference = ${customerId}
                      )
                      AND lv.list_value_id = status_id.list_value_id
                  UNION
                  SELECT
                      orders.name   orders,
                      to_char(orders.object_id),
                      status_id.list_value_id,
                      lv.value      status
                  FROM
                      nc_objects    orders,
                      nc_params     status_id,
                      nc_list_values lv
                  WHERE
                      orders.object_id = status_id.object_id
                      AND status_id.attr_id = 9124623752913888363 /* Status */
                      AND orders.object_type_id IN (
                          9134179704813622905 /* BOE Composite Order */
                      )
                      AND status_id.object_id IN (
                          SELECT DISTINCT
                              to_char(object_id)
                          FROM
                              nc_references
                          WHERE
                              attr_id = 4122753063013175631 /* Customer Account */
                              AND reference = ${customerId}
                      )
                      AND lv.list_value_id = status_id.list_value_id
                  UNION
                  SELECT
                      orders.name   orders,
                      to_char(orders.object_id),
                      status_id.list_value_id,
                      lv.value      status
                  FROM
                      nc_objects       orders,
                      nc_params        status_id,
                      nc_list_values   lv
                  WHERE
                      orders.object_id = status_id.object_id
                      AND status_id.attr_id = 9126090157513456523 /* Sales Order Status */
                      AND status_id.object_id IN (
                          SELECT
                              to_char(object_id)
                          FROM
                              nc_objects
                          WHERE
                              parent_id IN (
                                  SELECT
                                      to_char(object_id)
                                  FROM
                                      nc_objects
                                  WHERE
                                      parent_id = ${customerId}
                                      AND object_type_id = 4070674633013011019 /* Order Management Project */
                              )
                      )
                      AND lv.list_value_id = status_id.list_value_id
    `;

    return query;
}

export const queryNcCustomerOrdersStatusNeitherCompletedNorProcessed = (
    customerId: string | null,
):string => {
    let query = queryNcCustomerOrdersStatus(customerId);

        query = `

            select * from (${query}) order_status_table
            WHERE
              upper(status) NOT LIKE '%COMPLETED%'
              AND upper(status) NOT LIKE '%PROCESSED%'
              AND upper(status) NOT LIKE '%SUPERSEDED%'`;

    return query;
}

/**
 * @param {String} customerId E.g. 9140698645013660301
 */
export const getManualCreditTaskId = (customerId: string | null): string => {
    let query = `
                  select
                  to_char(object_id) task_id
                  from
                      nc_params
                  where
                      object_id = (
                          select
                              object_id
                          from
                              nc_objects
                          where
                              object_id in (
                                  select
                                      p.object_id
                                  from
                                      nc_params_ix p
                                  where
                                      p.attr_id = 90100082 /* Target Object */
                                      and p.ix_key = ${customerId}
                              )
                              and (name like '%Credit%' or name like '%Home security%')
                      )
                      and attr_id = 9137996003413538340 /* Task ID */
                `;

    return query;
}


export const getWorkOrderNumbersNotCompleted = (customerInternalId: string) => {
    let query = `
                  SELECT
                          p.value       AS work_order_number,
                          to_char(o.object_id)   AS object_id,
                          o.name as orderName
                      FROM
                          nc_objects   o,
                          nc_params    p,
                          nc_params    pp
                      WHERE
                          o.parent_id = ${customerInternalId}
                          and o.object_type_id = 9138418725413841757 /* New/Modify Work Order */
                          and p.attr_id = 9138427811113852870 /* Work Order ID */
                          and o.object_id = p.object_id
                          and o.object_id = pp.object_id
                          and pp.attr_id = 4063055154013004350 /* Status */
                          AND pp.list_value_id NOT IN (
                              4121046730013113091 /* Completed */
                          )

                `;

    return query;
}

export const getShipmentOrderObjectIdAndShipmentItemsQuery = (ecid: string) => {
  let query = `
                with shipment_order as (
                  SELECT to_char(ship_order.OBJECT_ID) shipment_oreder_obj_id
                  FROM NC_OBJECTS ship_order, NC_PARAMS ship_status
                  WHERE ship_order.PARENT_ID=(SELECT OBJECT_ID FROM RDB_CUSTOMER_ACCOUNTS WHERE ENTERPRISE_CUSTOMER_ID = '${ecid}')
                  AND ship_order.OBJECT_TYPE_ID=9147982277913906943
                  AND ship_status.OBJECT_ID = ship_order.OBJECT_ID
                  AND ship_status.ATTR_ID=4063055154013004350
                  AND ship_status.LIST_VALUE_ID=4063055154013004347
              )
              select shipment_order.*, order_num.VALUE shipment_order_number, sku.VALUE sku
              from shipment_order
              join NC_OBJECTS ship_item on ship_item.PARENT_ID=shipment_order.shipment_oreder_obj_id and ship_item.OBJECT_TYPE_ID=9148162326313914698
              join NC_REFERENCES item_instance on item_instance.REFERENCE=ship_item.OBJECT_ID
              join NC_PARAMS_IX sku on sku.OBJECT_ID=item_instance.OBJECT_ID and sku.ATTR_ID=9147911862813832433
              join NC_PARAMS_IX order_num on order_num.OBJECT_ID=ship_item.OBJECT_ID and order_num.ATTR_ID=9163167533813315909
              `;

    return query;

}

export const getShipmentOrderNumberAndPurchaseOrderNumber = (shipmentObjectId: string) => {
  let query = `
                SELECT
                    to_char(value) AS shipmentordernumber,
                    to_char(${shipmentObjectId}) as purchaseOrderNumber
                FROM
                    nc_params
                WHERE
                    object_id = ${shipmentObjectId}
                AND attr_id = (
                SELECT
                    attr_id
                FROM
                    nc_attributes
                WHERE
                    name = 'Shipment Order Number'
                )
              `;

    return query;

}

export const getHoldOrderTaskNumber = (purchaseeOrderNumber: any) => {
  let query = `     
  select to_char(task_id) from nc_po_Tasks where order_id = ${purchaseeOrderNumber} and name = 'Hold Order Completion'    
          `;

    return query;
}

export const getTaskNumber = ( orderId: any, taskName: string) => {
  const query = `     
          select to_char(task_id) from nc_po_Tasks where order_id = ${orderId} and name = '${taskName}'    
                  `;
  return query
}

export const getManualTasksFromOrder = (
  orderId: any,
  taskName: string,
) => {
  const query = `     
      SELECT to_char(object_id) task_id
      FROM nc_objects
      WHERE parent_id = (SELECT reference
      FROM nc_references r,
      nc_objects o
      WHERE r.attr_id = 8090342058013828310
      AND r.object_id = o.object_id
      AND o.object_id = ${orderId})
      AND NAME = '${taskName}'  
                  `;
  return query;
}




export const  getErrorsOccuredForCustomer = (
  customerId: string,
) => {
  let query = `
                  SELECT
                      object_id,
                      name
                  FROM
                      nc_objects
                  WHERE
                      parent_id IN (
                          SELECT
                              container_id AS object_id
                          FROM
                              nc_po_tasks,
                              nc_objects o
                          WHERE
                              order_id = object_id
                              AND o.parent_id = ${customerId} /* Customer ID */
                      )
                      AND object_type_id IN (
                          SELECT
                              object_type_id
                          FROM
                              nc_object_types
                          START WITH
                              object_type_id = 9081958832013375989 /* Base Error Record */
                          CONNECT BY
                              PRIOR object_type_id = parent_id
                      )
    `;

  return query
}


const queryGetAllBillingActionStatus = (
  customerId: string,
) => {
  let query = `
                SELECT 
                  a_obj.OBJECT_ID action_obj_id, a_obj.NAME, stv.LIST_VALUE_ID status_lv_id, substr(stv.VALUE,10) status
                FROM 
                  nc_params_ix ba
                LEFT JOIN nc_params s ON s.object_id = ba.object_id
                  AND s.attr_id = 9141614096913188381
                LEFT JOIN nc_list_values stv ON stv.list_value_id = s.list_value_id
                LEFT JOIN NC_REFERENCES a_ref ON a_ref.OBJECT_ID = ba.OBJECT_ID AND a_ref.ATTR_ID=9141390312313929810
                LEFT JOIN NC_OBJECTS a_obj ON a_ref.REFERENCE = a_obj.OBJECT_ID
                WHERE 
                  ba.value = to_char(${customerId}) /* Customer Id*/
                  AND ba.ix_key = pkgutils.params_ix(to_char(${customerId})) /* Customer Id*/
                  AND ba.attr_id = 9141251166913825730`;

  return query;
}

const  queryGetAllBillingFailedActionStatus = (
  customerId: string,
) => {
  let query = `select * from (${queryGetAllBillingActionStatus(
    customerId,
  )}) where lower(status) = 'failed'`;

  return query;
}

export const getBillingFailedActionStatus = (
  customerInternalNcObjectId: string,
) => {
  let query = queryGetAllBillingFailedActionStatus(
    customerInternalNcObjectId,
  );
  return query;
}

export const queryCheckOrdersStatuses = (objectTypeId:string,customerObjectId:string) => {
  let query=` select to_char(LIST_VALUE_ID),VALUE from (select no.OBJECT_ID, np.LIST_VALUE_ID, nclv.value from NCMBE.NC_OBJECTS no, NC_PARAMS np, NC_LIST_VALUES nclv
        where PARENT_ID = ${customerObjectId}
        and np.object_id = no.OBJECT_ID
        and np.attr_id = 4063055154013004350
        and nclv.LIST_VALUE_ID = np.LIST_VALUE_ID
        and no.OBJECT_TYPE_ID = ${objectTypeId}
        order by no.name) order_status
        where ROWNUM = 1`

  return query;
}

export const queryCheckTheRDB_SALES_ORDERSTable = () => {
  const query=`select COUNT(USER_OUTLET_ID) from RDB_SALES_ORDERS`

  return query;
}

export const queryATTR_TYPE_ID = () => {
  const query=`select ATTR_TYPE_ID from nc_attributes where ATTR_ID = 9153903967913504806`

  return query;
}

export const iptvServiceKey = (
  customerId: number|null,
) => {

  let query = `
   select SUBSTR(object_id, 1) from NC_OBJECTS no
   where no.parent_id =
        (select object_id from NC_PARAMS_IX npx
         where npx.attr_id = 9138719996013282785
         and npx.ix_key = '${customerId}')
   and no.name like 'IPTV CFS #%v.01'`;

  return query;
}

export const queryOption82 =(
  customerId: string,
) => {

//    let query = `
//    select VALUE from NCMBE.NC_PARAMS_IX
// where ATTR_ID = 9135689397313386074 and OBJECT_ID=(
//     select REFERENCE from NCMBE.NC_REFERENCES where ATTR_ID = 4070569491013010665 and OBJECT_ID = (
//         select OBJECT_ID from NCMBE.NC_OBJECTS where OBJECT_TYPE_ID = 9134835045013241003 and PARENT_ID = (
//             select nco.OBJECT_ID from NCMBE.NC_OBJECTS nco, NC_PARAMS_IX ncp
//             where nco.OBJECT_TYPE_ID = 2091641841013994133
//             and nco.OBJECT_ID = ncp.OBJECT_ID
//             and ncp.VALUE = '${customerId}'
//         )
//     )
// )`;

  let query = `
with conorder as (
  select OBJECT_ID from NCMBE.NC_OBJECTS where OBJECT_TYPE_ID = 9134835045013241003 and PARENT_ID = (
      select nco.OBJECT_ID from NCMBE.NC_OBJECTS nco, NC_PARAMS_IX ncp
      where nco.OBJECT_TYPE_ID = 2091641841013994133
      and nco.OBJECT_ID = ncp.OBJECT_ID
      and ncp.VALUE = '${customerId}'
  ) and rownum=1 order by name desc)
select VALUE from NCMBE.NC_PARAMS_IX
where ATTR_ID = 9135689397313386074 and OBJECT_ID=(
  select REFERENCE from NCMBE.NC_REFERENCES where ATTR_ID = 4070569491013010665 and OBJECT_ID = (select * from conorder)
)`;

  return query;
}