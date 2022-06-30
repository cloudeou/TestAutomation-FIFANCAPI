module.exports = {
  retriveTAaddressData: (params) => `update ta_addresses
  set modified_date=now(), used=true
  where id in (
      select id from ta_addresses
      where not used
      and not cleanup_ready
      and env = ${params.bddEnv}
      ${params.tc_id ? `and tc_id = ${params.tc_id}` : ''}
      ${params.city ? `and city = '${params.city}'` : ''}
      ${params.province ? `and province = '${params.province}'` : ''}
      ${params.type ? `and type = '${params.type}'` : ''}
      limit 1
  )
  returning *`
}