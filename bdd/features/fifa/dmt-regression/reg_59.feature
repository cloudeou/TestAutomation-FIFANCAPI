# SuiteNames
@regression
@Api
@reg_59-keyword
@DBbootstrap=addressBootstrap
@runTimes=1
@DBbootstrapParams={"type":"LTE","suiteName":"dmt-regression"}

Feature: Provide Residential Customer

  Scenario: Check address
    Given user has address with type LTE
    And distribution channel is CSR
    And customer category is RESIDENTIAL
    When get address based on entered data: '5789401'
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

  Scenario: Create shopping cart to order top offer
    Given preconditions by user are selected
    And test user select offers:
      | OfferId             |
      | 9150893104313917439 |
      #TELUS Internet 15/15
      | 9142278346813160836 |
      # Essentials
      | 9162234688573639328 |
      # Secure
      | 9150400880613177266 |
      # Home Security Commitment on 36 month contract
      | 9160783681513938083 |
    #Save on Internet & SHS For 24 months

    And test user set the chars for item:
      | Name                | Value               | Item                |
      | 9158306682113553797 | 9158306751513553872 | 9142278346813160836 |
      # Delivery Method TV - Pro Install
      | 9155793580913292047 | 9155793538813291983 | 9162234688573639328 |
      # Delivery method SHS = Pro install
      | 9152694600113929802 | 9154132902813883884 | 9162234688573639328 |
      # Acquired From = Reliance
      | 9152552492613455557 | 9152552492613455566 | 9162234688573639328 |
    # Self-Install = No
    When test user try to create Shopping Cart
    Then test validate shopping cart is created successfully

  Scenario: Add HD PVR
    Given preconditions by user are selected
    And test user select child offer:
      | OfferId             | Parent              |
      | 9144579890813692873 | 9142278346813160836 |
			# HD PVR
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
    And validate that all billing actions completed successfully

