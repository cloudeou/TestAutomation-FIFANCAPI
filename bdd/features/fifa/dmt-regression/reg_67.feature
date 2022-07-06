@-
@regression
@reg_67-keyword
# @DBbootstrap=addressBootstrap
# @runTimes=1
# @DBbootstrapParams={"type":"LTE"}
Feature: Provide LWC MPERS

  Scenario: Check address
    Given user has address with type LTE
    When get address based on entered data: '3295797'
    Then address id should be returned

  Scenario: Check service qualification for an address
    Given preconditions by user are selected
    When user check availability
    Then address should be qualified for LTE

  Scenario: Check product offerings under the livingwell category
    Given preconditions by user are selected
    And distribution channel is CSR
    And customer category is RESIDENTIAL
    And user filter by the following categories:
        | CategoryId          |
        | 9150409998313183108 |
        # LivingWell Home
    When user try to get qualified product offering list
    Then list of the following product offerings should be available:
        | OfferId             |
        | 9163210145801646781 |
        # LivingWell Companion Go - With App
            
  Scenario: Create customer
    Given preconditions by user are selected
    And create real email address for API
    When user try to create customer
    Then external customer id should be returned
    And billing account number is returned
    And credit check is performed

  Scenario: Create shopping cart to order top offer
    Given preconditions by user are selected
    And test user select offers:
        | OfferId             |
        | 9163210145801646781 |
        # Livingwell companion Go - With App
    And test user set the chars for item:
        | Name                | Value               | Item                |
        | 9156198150013903799 | 9156198150013903801 | 9163210145801646781 |
        # Delivery method = Self install
        | 9157589563813025526 | Merlin              | 9163210145801646781 |
        # End User First Name
        | 9157607665813042503 | Automation          | 9163210145801646781 |
        # End User Last Name
        | 9153028682213126502 | 9153028682213126507 | 9163210145801646781 |
       # Acquired From = Paladin
        | 9157581860013018102 | 9157590380013026012 | 9163210145801646781 |
       # Language Preferences Characteristic = English
    When test user try to create Shopping Cart
    Then test validate shopping cart is created successfully
    And test user validate shopping cart should contain child offers:
        | OfferId             |
        | 9161508882306984319 |
        # LivingWell Companion – Activation Fee
        | 9163227219112647539 |
        # LivingWell Companion Go- DASH Device
    And user validate shopping cart promotion price in $ for child offers should be: 
        | OfferId             | Price |
        | 9161508882306984319 |  35   |
        # LivingWell Companion – Activation Fee

  Scenario: Validate shopping cart(1)
    Given preconditions by user are selected
    When test user try to validate shopping cart
    Then test no error messages should be in shopping cart

  Scenario: Update shopping cart and add child offers
    Given preconditions by user are selected
    And test user select child offer:
        | OfferId             | Parent              |
        | 9157582505713018514 | 9163210145801646781 |
        | 9157582505713018514 | 9163210145801646781 |
		# add Emergency Contact
		# duplicated because there are two sets of emergency contact
    And test user set the chars for item:
        | Name                | Value      | Item                | ItemNumber |
        | 9157669257013588259 | Contact 1  | 9157582505713018514 | 1          |
        # Contact Name = Contact 1
        | 9157669241313588257 | 1          | 9157582505713018514 | 1          |
        # Contact Order Preference = 1
        | 9157669218013588255 | 6041234587 | 9157582505713018514 | 1          |
        # Contact Phone Number = 6041234587
        | 9157669257013588259 | Contact 2  | 9157582505713018514 | 2          |
        # Contact Name = Contact 2
        | 9157669241313588257 | 2          | 9157582505713018514 | 2          |
        # Contact Order Preference = 2
        | 9157669218013588255 | 6041224568 | 9157582505713018514 | 2          |
        # Contact Phone Number = 6041224568
    When test user try to update Shopping Cart
    Then test validate shopping cart is updated successfully
  
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

  Scenario: Validate shopping cart(2)
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
      | 9155165078813302481 | Completed  |
      # New API CMS Integration RFS Order
      | 9157420868813350351 | Completed  |
      # New Living Well CFS Order
      | 9157420868813350351 | Completed  |
      # New Living Well CFS Order
      | 9150380965513139161 | Completed  |
      # New ADC Platform RFS Order
      | 9147982277913906943 | Completed  |
      # New Shipment Product Order
    And validate that all billing actions completed successfully
    # And check that the letters was received:
    #   | subject                                     | body                    |
    #   | Your TELUS Home Services order is confirmed | Thank=>TELUS=>confirmed |

#todo: check letters
