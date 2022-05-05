export class bodySamples {
   static getServiceQualification(externalLocationId: any) {
        return {
            serviceQualificationItem: [
                {
                    id: externalLocationId,
                },
            ],
        };
    }
}