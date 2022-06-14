module.exports = {
      retrieveSnData: (params) =>
        `
    SELECT * FROM sn_data
    ${params.launchPad ? `WHERE launch_pad=${params.launchPad}` : ``}
    LIMIT ${params.runTimes}
    `,
};