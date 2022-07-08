@regression
@Api
@reg_16-keyword
@DBbootstrap=addressBootstrap
@runTimes=1
@DBbootstrapParams={"type":"LTE"}

Feature: Provide Wireless HSIA with IDU

  Scenario: Check address
    Given user has address with type LTE
    When test get address is: @lpdsid
    Then address id should be returned

  Scenario: Check service qualification for an address
    Given preconditions by user are selected
    When user check availability
    Then address should be qualified for LTE

  Scenario: Check product offerings under the home security category
    Given preconditions by user are selected
    And distribution channel is PILOT6RT
    And customer category is RESIDENTIAL
    And user filter by the following categories:
      | CategoryId          |
      | 9159601829313498427 |
		# WHSIA
    When user try to get qualified product offering list
    Then list of the following product offerings should be available:
      | OfferId             |
      | 9159602850913498849 |
			# Smart Hub Rural Internet 25/10 - 100 GB Monthly Data
      | 9159683640113535776 |
			# Smart Hub Rural Internet 25/10 - 500 GB Monthly Data

  Scenario: Create customer
    Given preconditions by user are selected
    When user try to create customer
    Then external customer id should be returned
    And billing account number is returned
    And credit check is performed

  Scenario: Create SC with wHSIA
    Given preconditions by user are selected
    And test user select offers:
      | OfferId             |
      | 9159602850913498849 |
    # wHSIA Rural Internet - 100GB monthly data
      | 9159621605313507298 |
     # $5 off plus free Rental for 2 years.
    When test user try to create Shopping Cart
    Then test validate shopping cart is created successfully
    And test user validate cart item parameters should contain:
      | ParameterName |
      | name          |
    And test user validate cart at least one item should contain price
    And test user validate shopping cart should contain top offers:
      | OfferId             |
      | 9159602850913498849 |

  Scenario: Validate shopping cart (1)
    Given preconditions by user are selected
    When test user try to validate shopping cart
    Then test error messages should be in shopping cart: 'A minimum of one 5G Outdoor Router or 5G Indoor Router must be selected.'

  Scenario: Update SC, add child offer
    Given preconditions by user are selected
    And test user select child offer:
      | OfferId             | Parent              |
      | 9160503693613228831 | 9159602850913498849 |
      | 9159698239513542765 | 9159602850913498849 |
      # 5G Indoor Router Purchase
    When test user try to update Shopping Cart
    Then test validate shopping cart is updated successfully
    And test user validate at least one cart item should contain price alteration
    And user validate price in $ for child offers should be: 
        | OfferId             | Price | Name                         |
        | 9163039825409415152 |  50   | Wireless HSIA Connection Fee |
        # Wireless HSIA Connection Fee

  Scenario: Validate shopping cart (2)
    Given preconditions by user are selected
    When test user try to validate shopping cart
    Then test no error messages should be in shopping cart

  Scenario: Update SC, add delivery method
    Given preconditions by user are selected
      And test user set the chars for item:
      | Name                | Value               | Item                |
      | 9157950816213373074 | 9157950816213373076 | 9159602850913498849 |
      #   Delivery method - Pro Install
    When test user try to update Shopping Cart
    Then test validate shopping cart is updated successfully
    And test user validate at least one cart item should contain price alteration

  Scenario: Validate shopping cart (3)
    Given preconditions by user are selected
    When test user try to validate shopping cart
    Then test error messages should be in shopping cart: 'The requested delivery type for the added Internet equipment does not allign with your Internet delivery method. Please align your delivery method before proceeding.'
#todo: check Validate errors

  Scenario: Change delivery method 
    Given preconditions by user are selected
    And test user set the chars for item:
      | Name                | Value               | Item                |
      | 9157950816213373074 | 9157950816213373075 | 9159602850913498849 |
#      Delivery method - Self Install
    When test user try to update Shopping Cart
    Then test validate shopping cart is updated successfully
    # And user validate at least one cart item should contain price alteration
    # And user validate shopping cart top level item should contain chars:
    #   | Name                | Value    | Item                |
    #   | 9163159338933151737 | GEOFENCE | 9159602850913498849 |
    #   # Geo Type Code = GEOFENCE for Smart Hub Rural Internet 25/10 - 100 GB Monthly Data

  Scenario: Update shopping cart and add shipping details
    Given preconditions by user are selected
    And test user set the chars for item:
      | Name                | Value  			| Item                |
      | 9147912230013832655 | T7A1T3 			| 9147904372813829170 |
			# Shipment.Postal Code = T7A1T3
      | 9148017499713860022 | AB  			| 9147904372813829170 |
			# Shipment.Province = AB
      | 9148017331813859769 | DraytonValley 	| 9147904372813829170 |
			# Shipment.City = DraytonValley
      | 9147904820813829381 | Testing 		| 9147904372813829170 |
			# Shipment.Recipient First Name
      | 9147983057213907287 | LastName 		| 9147904372813829170 |
			# Shipment.Recipient Last Name
    When test user try to update Shopping Cart
    Then test validate shopping cart is updated successfully

  Scenario: Validate shopping cart (4)
    Given preconditions by user are selected
    When test user try to validate shopping cart
    Then test no error messages should be in shopping cart

  Scenario: Submit SC
    Given preconditions by user are selected
    When test user try to submit shopping cart
    Then test sales order id should be returned

  Scenario: Check backend orders validation
    Given preconditions by user are selected
    When try to complete sales order on BE
    Then validate that no errors created on BE
    And validate that all orders are completed successfully
    And validate that all billing actions completed successfully

    And check present order statuses
      | objectTypeId        | Status     |
      # | 9154571915913717019 | Completed  |
      # New Wireless Connectivity RFS Order 
      | 9154572125913717135 | Completed  |
      # New TELUS Wireless Internet Product Order 






