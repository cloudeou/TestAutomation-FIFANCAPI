export class CreateCustomerSample {
    static createCustomerBody(customerEmail: any, addressId: any) {
        return {
          firstName: 'Merlin',
          lastName: 'Automation' + Math.random(),
          businessCustomer: '',
          email: customerEmail,
          addressId: addressId,
          postalZipCode: 'E3E3E3',
          personal: {
            provinceOfResidence: 'BC',
            birthDate: '1988-12-25',
            driverLicense: {
              number: '2456269',
              provinceCd: 'BC',
            },
          },
        };
      }
}