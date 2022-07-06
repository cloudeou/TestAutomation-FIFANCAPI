@-
@regression
@reg_61-keyword
@DBbootstrap=addressBootstrap
@runTimes=1
@DBbootstrapParams={"type":"GPON"}

Feature: Provide TV Premium 4.0 on term with 5 Telus TV Digital Boxes

  Scenario: Check address
    Given user has address with type FIBER
    And technology type is GPON
    When get address is: @lpdsid
    Then address id should be returned

  Scenario: Check service qualification for an address
    Given preconditions by user are selected
    When user check availability
    Then address should be qualified for GPON

  Scenario: Create customer
    Given preconditions by user are selected
    When user try to create customer
    Then external customer id should be returned
    And billing account number is returned
    And credit check is performed

  Scenario: Check create shopping cart with TV Premium
    Given preconditions by user are selected
    And test user select offers:
      | OfferId             |
      | 9163330890538233682 |
	  # 4 Theme Packs + 1 Premium
      | 9154253029913818332 | 
    # Special Offer: Save up to $15 per month on Optik TV for 24 months (NC)
    And test user set the chars for item:
      | Name                | Value               | Item                |
      # | 9158306682113553797 | 9158306751513553872 | 9163330890538233682 |
		# Delivery Method TV - Pro Install
      | 9158306682113553797 | 9158306751513553873 | 9163330890538233682 |
		# Delivery Method TV - Self-Install
      | 9148465520113089778 | 9148465700013089863 | 9163330890538233682 |
		# Number of TVs = 5
    When test user try to create Shopping Cart
    Then test validate shopping cart is created successfully
    And test user validate shopping cart should contain child offers:
      | OfferId             |
      | 9161599819519854106 |
      # TELUS TV Digital Box
      | 9161599819519854106 |
      # TELUS TV Digital Box
      | 9161599875157854109 |
      # TELUS TV Digital Box
      | 9161599875157854109 |
      # TELUS TV Digital Box
      | 9161599875157854109 |
      # TELUS TV Digital Box
    And test user validate shopping cart should contain promotion offers:
      | OfferId             |
      | 9162778234944108492 |
      # Optik TV Digital Box Discount

  Scenario: Check Validate shopping cart
    Given preconditions by user are selected
    When test user try to validate shopping cart
    Then test no error messages should be in shopping cart

  Scenario: Check Submit Shopping Cart Api
    Given preconditions by user are selected
    When test user try to submit shopping cart
    Then test sales order id should be returned

  Scenario: Check backend orders validation
    Given preconditions by user are selected
    When try to complete sales order on BE
    Then validate that no errors created on BE
    And validate that all orders are completed successfully
    # And validate that all billing actions completed successfully
    And check present order statuses
      | objectTypeId        | Status     |
      | 9135774932113406620 | Completed  |
     	# New TELUS Equipment Product Order

  Scenario: Create shopping cart (2)
    Given preconditions by user are selected
    When test user try to create Shopping Cart
    Then test validate shopping cart is created successfully

Scenario: Update SC, cease commitment
    Given preconditions by user are selected
    And test user delete offers:
      | OfferId             |
      | 9154253029913818332 |
    # Special Offer: Save up to $15 per month on Optik TV for 24 months (NC)
    When test user try to update Shopping Cart
    Then test validate shopping cart is updated successfully
    And test user validate shopping cart should contain child offers:
      | OfferId             |
      | 9161599819519854106 |
      # TELUS TV Digital Box
      | 9161599819519854106 |
      # TELUS TV Digital Box
      | 9161599875157854109 |
      # TELUS TV Digital Box
      | 9161599875157854109 |
      # TELUS TV Digital Box
      | 9161599875157854109 |
      # TELUS TV Digital Box
    And test user validate shopping cart should not contain promotion offers:
      | OfferId             |
      | 9162778234944108492 |
      # Optik TV Digital Box Discount

  Scenario: Validate shopping cart (2)
    Given preconditions by user are selected
    When test user try to validate shopping cart
    Then test no error messages should be in shopping cart

  Scenario: Submit SC (2)
    Given preconditions by user are selected
    When test user try to submit shopping cart
    Then test sales order id should be returned

  Scenario: Check backend orders validation (2)
    Given preconditions by user are selected
    When try to complete sales order on BE
    Then validate that no errors created on BE
    And validate that all orders are completed successfully
    And validate that all billing actions completed successfully
    And check present order statuses
      | objectTypeId        | Status     |
      | 9135774932113406620 | Completed  |
     	# New TELUS Equipment Product Order

       #todo chexk billing actions twice