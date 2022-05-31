# SuiteNames
@regression
@Api
@reg_03-keyword

Feature: Validate You Pick Equipment during provision, modifying and changing offers

	Scenario: Check address
		Given user has address with type LTE
		When get address based on entered data
		Then address id should be returned

	Scenario: Check service qualification for an address
		Given preconditions by user are selected
		When user check availability
		Then address should be qualified for LTE

	Scenario: Create a customer
		Given preconditions by user are selected
		When user try to create customer
		Then external customer id should be returned
		And billing account number is returned
		And credit check is performed

	Scenario: Create shopping cart and provide control with 3 year commitment
		Given preconditions by user are selected
		And user select offers:
			| OfferId             |
			| 9162184182465524071 |
         # Control
			| 9150400880613177266 |
         # Home Security Commitment on 36 month contract
		And user set the chars for item:
			| Name                | Value               | Item                |
			| 9155793580913292047 | 9155793538813292020 | 9162184182465524071 |
         # Delivery method = Self install
			| 9152694600113929802 | 9154132902813883884 | 9162184182465524071 |
         # Acquired From = Reliance
			| 9152552492613455557 | 9152552492613455562 | 9162184182465524071 |
      # Self-Install = Yes (BOE rule, cannot change, for validation only)
		When user try to create Shopping Cart
		Then validate shopping cart is created successfully

	Scenario: Add Motion Sensor for catch error message
		Given preconditions by user are selected
		And user select child offer:
			| OfferId             | Parent              |
			| 9151911768013302330 | 9162184182465524071 |
			| 9151911768013302330 | 9162184182465524071 |
         # add Motion Sensor
		When user try to update Shopping Cart
		Then validate shopping cart is updated successfully

	Scenario: Validate shopping cart(1)
		Given preconditions by user are selected
		When user try to validate shopping cart
		Then error messages should be in shopping cart: 'Warning: You've selected more than one included Motion Sensor, please remove any included devices above the maximum quantity. If the customer requires more please use the Purchase and/or Easy Pay options'

	Scenario: Create shopping cart and provide control with 3 year commitment (2)
		Given preconditions by user are selected
		Then user try to delete Shopping Cart context
		And user select offers:
			| OfferId             |
			| 9162184182465524071 |
         # Control
			| 9150400880613177266 |
         # Home Security Commitment on 36 month contract
		And user set the chars for item:
			| Name                | Value               | Item                |
			| 9155793580913292047 | 9155793538813292020 | 9162184182465524071 |
         # Delivery method = Self install
			| 9152694600113929802 | 9154132902813883884 | 9162184182465524071 |
         # Acquired From = Reliance
			| 9152552492613455557 | 9152552492613455562 | 9162184182465524071 |
      # Self-Install = Yes (BOE rule, cannot change, for validation only)
		When user try to create Shopping Cart
		Then validate shopping cart is created successfully

	Scenario: Add Door/Window Sensor for catch error message
		Given preconditions by user are selected
		And user select child offer:
			| OfferId             | Parent              |
			| 9151903159713296902 | 9162184182465524071 |
			| 9151903159713296902 | 9162184182465524071 |
			| 9151903159713296902 | 9162184182465524071 |
#        # add Door/Window Sensor
		When user try to update Shopping Cart
		Then validate shopping cart is updated successfully

	Scenario: Validate shopping cart (2)
		Given preconditions by user are selected
		When user try to validate shopping cart
		Then error messages should be in shopping cart: 'Warning: You've selected more than two included Door/Window Sensors, please remove any included devices above the maximum quantity. If the customer requires more please use the Purchase and/or Easy Pay options'

	Scenario: Create shopping cart and provide control with 3 year commitment (3)
		Given preconditions by user are selected
		Then user try to delete Shopping Cart context
		And user select offers:
			| OfferId             |
			| 9162184182465524071 |
         # Control
			| 9150400880613177266 |
         # Home Security Commitment on 36 month contract
		And user set the chars for item:
			| Name                | Value               | Item                |
			| 9155793580913292047 | 9155793538813292020 | 9162184182465524071 |
         # Delivery method = Self install
			| 9152694600113929802 | 9154132902813883884 | 9162184182465524071 |
         # Acquired From = Reliance
			| 9152552492613455557 | 9152552492613455562 | 9162184182465524071 |
      # Self-Install = Yes (BOE rule, cannot change, for validation only)
		When user try to create Shopping Cart
		Then validate shopping cart is created successfully



	Scenario: Validate shopping cart (3)
		Given preconditions by user are selected
		When user try to validate shopping cart
		Then no error messages should be in shopping cart

	Scenario: Submit Shopping Cart (1)
		Given preconditions by user are selected
		When user try to submit shopping cart
		Then sales order id should be returned

   Scenario: Check backend orders validation(1)
		Given preconditions by user are selected
		When try to complete sales order on BE
		Then validate that no errors created on BE
		And validate that all orders are completed successfully
      And validate that all billing actions completed successfully

   Scenario: Create shopping cart to amend order(1)
      Given preconditions by user are selected
      When user try to create Shopping Cart
      Then validate shopping cart is created successfully

   Scenario: Update shopping cart to remove YouPick equipment offers
      Given preconditions by user are selected
      And user delete child offer:
         | OfferId             | Parent              |
         | 9151657034613356392 | 9162184182465524071 |
         # delete Smart Thermostat
      When user try to update Shopping Cart
      Then validate shopping cart is updated successfully

   Scenario: Validate shopping cart for removed item
      Given preconditions by user are selected
      When user try to validate shopping cart
		Then error messages should be in shopping cart: 'Block incorrect choice of Pick offerings for Modify Home Security DESCRIPTION: Oops, it looks like [Entry]'

   Scenario: Create shopping cart to amend order(2)
      Given preconditions by user are selected
      When user try to create Shopping Cart
      Then validate shopping cart is created successfully

   Scenario: Update shopping cart and add rental equpment (Easypay) offers
      Given preconditions by user are selected
      And user select child offer:
       | OfferId             | Parent              |
       | 9151669446613310780 | 9162184182465524071 |
       # add Smart Thermostat TELUS Easy Pay B2C
      And user set the chars for item:
         | Name                | Value               | Item                |
         | 9151550795513408112 | 9151550795513408113 | 9151669446613310780 |
         # | Purchase Type       | Easy Pay           | Smart Thermostat TELUS Easy Pay B2C |
      When user try to update Shopping Cart
      Then validate shopping cart is updated successfully

   Scenario: Validate shopping cart (4)
		Given preconditions by user are selected
		When user try to validate shopping cart
		Then no error messages should be in shopping cart

   Scenario: Submit Shopping Cart (2)
		Given preconditions by user are selected
		When user try to submit shopping cart
		Then sales order id should be returned

	Scenario: Check backend orders validation(2)
		Given preconditions by user are selected
		When try to complete sales order on BE
		Then validate that no errors created on BE
		And validate that all orders are completed successfully
      And validate that all billing actions completed successfully

   Scenario: Create shopping cart and provide Smart Automation Plus Video with 3 year commitment (1)
		Given preconditions by user are selected
		And user select offers:
			| OfferId             |
			| 9155153987813123256 |
         # Smart Automation Plus Video
			| 9150400880613177266 |
         # Home Security Commitment on 36 month contract
		And user set the chars for item:
			| Name                | Value               | Item                |
			| 9155793580913292047 | 9155793538813291983 | 9155153987813123256 |
         # Delivery method = Pro install
			| 9152694600113929802 | 9154132902813883884 | 9155153987813123256 |
         # Acquired From = Reliance
			| 9152552492613455557 | 9152552492613455566 | 9155153987813123256 |
         # Self-Install = No
		When user try to create Shopping Cart
		Then validate shopping cart is created successfully

   Scenario: Update shopping cart and add YouPick equipment offers
      Given preconditions by user are selected
      And user select child offer:
         | OfferId             | Parent              |
         | 9160760402513962407 | 9155153987813123256 |
         | 9160760402513962407 | 9155153987813123256 |
         # add Indoor Wi-Fi Security Camera
      And user set the chars for item:
         | Name                | Value               | Item                |	
			| 9157532415513055907 | 9157532415513055909 | 9160760402513962407 |
         | 9157532415513055907 | 9157532415513055909 | 9160760402513962407 |
			# isYouPick = Yes
      When user try to update Shopping Cart
      Then validate shopping cart is updated successfully

   Scenario: Validate shopping cart (5)
      Given preconditions by user are selected
      When user try to validate shopping cart
		Then error messages should be in shopping cart: 'Validate Amend Sales Order DESCRIPTION: Creation of a Shopping Cart currently is unavailable. Please try again later.'

   Scenario: Create shopping cart and provide Smart Automation Plus Video with 3 year commitment (2)
		Given preconditions by user are selected
		Then user try to delete Shopping Cart context
		And user select offers:
			| OfferId             |
			| 9155153987813123256 |
         # Smart Automation Plus Video
			| 9150400880613177266 |
         # Home Security Commitment on 36 month contract
		And user set the chars for item:
			| Name                | Value               | Item                |
			| 9155793580913292047 | 9155793538813291983 | 9155153987813123256 |
         # Delivery method = Pro install
			| 9152694600113929802 | 9154132902813883884 | 9155153987813123256 |
         # Acquired From = Reliance
			| 9152552492613455557 | 9152552492613455566 | 9155153987813123256 |
         # Self-Install = No
		When user try to create Shopping Cart
		Then validate shopping cart is created successfully
  
   Scenario: Validate shopping cart (6)
      Given preconditions by user are selected
      When user try to validate shopping cart
      Then no error messages should be in shopping cart

   Scenario: Submit Shopping Cart (3)
		Given preconditions by user are selected
		When user try to submit shopping cart
		Then sales order id should be returned

	Scenario: Check backend orders validation(3)
		Given preconditions by user are selected
		When try to complete sales order on BE
		Then validate that no errors created on BE
		And validate that all orders are completed successfully
      And validate that all billing actions completed successfully

  Scenario: Create shopping cart and provide Control Plus Video with 3 year commitment
		Given preconditions by user are selected
		And user select offers:
			| OfferId             |
			| 9162184393413524077 |
         # Control Plus Video
			| 9150400880613177266 |
         # Home Security Commitment on 36 month contract
		And user set the chars for item:
			| Name                | Value               | Item                |
			| 9155793580913292047 | 9155793538813292020 | 9162184393413524077 |
         # Delivery method = Self install
			| 9152694600113929802 | 9154132902813883884 | 9162184393413524077 |
         # Acquired From = Reliance
			| 9152552492613455557 | 9152552492613455562 | 9162184393413524077 |
      # Self-Install = Yes (BOE rule, cannot change, for validation only)
		When user try to create Shopping Cart
		Then validate shopping cart is created successfully

   Scenario: Validate shopping cart (7)
      Given preconditions by user are selected
      When user try to validate shopping cart
      Then no error messages should be in shopping cart

   Scenario: Submit Shopping Cart (4)
		Given preconditions by user are selected
		When user try to submit shopping cart
		Then sales order id should be returned

	Scenario: Check backend orders validation(4)
		Given preconditions by user are selected
		When try to complete sales order on BE
		Then validate that no errors created on BE
		And validate that all orders are completed successfully
      And validate that all billing actions completed successfully

   