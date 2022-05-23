import ncConstants from '../../utils/nc-constants'

export class bodySamples {
   static getServiceQualification(externalLocationId: string) {
        return {
            serviceQualificationItem: [
                {
                    id: externalLocationId,
                },
            ],
        };
    }

  static validateOrSubmitBody(
    customerCategory: string,
    distributionChannel: string
  ) {
    const isDistChanExtId = !Object.values(
      ncConstants.distributionChannel
    ).includes(distributionChannel);

    return {
      relatedParty: [
        {
          role: "customer",
          characteristic: [
            {
              name: "category",
              value: customerCategory,
            },
          ],
        },
      ],
      channel: {
        id: distributionChannel,
        "@referenceType": isDistChanExtId ? "External_ID" : undefined,
      },
    };
  }
}