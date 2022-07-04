# SuiteNames
@regression
@Api
@reg_68-keyword

Feature: Provide Optik TV (immediate) + LW (Future date) + HSIA (Pro install)

  Scenario: Check address
    Given user has address with type GPON
    And distribution channel is CSR
    And customer category is RESIDENTIAL
    When get address based on entered data: '5602461'
    Then address id should be returned

  Scenario: Check service qualification for an address
    Given preconditions by user are selected
    When user check availability
    Then address should be qualified for GPON

  Scenario: Create a customer
    Given preconditions by user are selected
    When user try to create customer
    Then external customer id should be returned
    And billing account number is returned
    And credit check is performed

  Scenario: Create shopping cart to order top offer
    Given preconditions by user are selected
    And test user select offers:
      | OfferId             |
      | 9152915045113768337 |
      #TELUS Internet only Commitment
      | 9160193837613204795 |
      #TELUS Internet 2.5G
      #
      | 9162117984976263611 |
      #Core
      #
      | 9161360097813671797 |
      #LivingWell Commitment for 12 months
      | 9161482788965984291 |
      #LivingWell Companion Go
    When test user try to create Shopping Cart
    Then test validate shopping cart is created successfully

  Scenario: Validate shopping cart
    Given preconditions by user are selected
    When test user try to validate shopping cart
    Then test no error messages should be in shopping cart

  Scenario: Update shopping cart and add child offers
    Given preconditions by user are selected
    And test user validate shopping cart top level item should contain chars:
      | Name                | Value               | Item                |
      | 9157950816213373074 | 9157950816213373076 | 9160193837613204795 |
      # TELUS Internet 2.5G Delivery Method - Pro Install
      | 9158306682113553797 | 9158306751513553872 | 9162117984976263611 |
      # TV Core Delivery Method - Pro Install
    #living well
    And test user set the chars for item:
      |Name                 |Value                | Item                |
      | 9157589563813025526 | Merlin              | 9161482788965984291 |
      # End User First Name
      | 9157607665813042503 | Automation          | 9161482788965984291 |
      # End User Last Name
    And test user select child offer:
      | OfferId             | Parent              |
      | 9157582505713018514 | 9161482788965984291 |
      | 9157582505713018514 | 9161482788965984291 |
			# add Emergency Contact
			# duplicated because there are two sets of emergency contact
      | 9161599819519854106 | 9162117984976263611 |
        #TELUS TV Digital Box
    And test user set the chars for item:
      | Name                | Value      | Item                | ItemNumber |
      | 9157669257013588259 | Contact 1  | 9157582505713018514 | 1          |
			# Contact Name = Contact 1
      | 9157669241313588257 | 1          | 9157582505713018514 | 1          |
			# Contact Order Preference = 1
      | 9157669218013588255 | 6041234567 | 9157582505713018514 | 1          |
			# Contact Phone Number = 6041234567
      | 9157669257013588259 | Contact 2  | 9157582505713018514 | 2          |
			# Contact Name = Contact 2
      | 9157669241313588257 | 2          | 9157582505713018514 | 2          |
			# Contact Order Preference = 2
      | 9157669218013588255 | 6041234568 | 9157582505713018514 | 2          |
			# Contact Phone Number = 6041234568
    And test user set the chars for item:
      | Name                | Value  			| Item                |
      | 9147912230013832655 | T7A1T3 			| 9147904372813829170 |
			# Shipment.Postal Code = T7A1T3
      | 9148017499713860022 | AB  			    | 9147904372813829170 |
			# Shipment.Province = AB
      | 9148017331813859769 | DraytonValley 	| 9147904372813829170 |
			# Shipment.City = DraytonValley
      | 9147904820813829381 | Testing 		    | 9147904372813829170 |
			# Shipment.Recipient First Name
      | 9147983057213907287 | LastName 		    | 9147904372813829170 |
			# Shipment.Recipient Last Name
    When test user try to update Shopping Cart
    Then test validate shopping cart is updated successfully

  Scenario: Validate shopping cart
    Given preconditions by user are selected
    When test user try to validate shopping cart
    Then test no error messages should be in shopping cart

  Scenario: Submit Shopping Cart
    Given preconditions by user are selected
    When test user try to submit shopping cart
    Then test sales order id should be returned

  Scenario: Check backend orders validation
    Given preconditions by user are selected
    When try to complete sales order on BE
    Then validate that no errors created on BE
    And validate that all orders are completed successfully
    And check present order statuses
      | objectTypeId        | Status     |
      | 9160193837613204795 | Completed  |
     		 # TELUS Internet 2.5G Order
      | 9162117984976263611 | Completed  |
     		 # tv Core Order
      | 9161482788965984291 | Completed  |
     		 # LivingWell Companion Go order