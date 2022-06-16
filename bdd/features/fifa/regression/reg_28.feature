# SuiteNames
@regression
@Api
@reg_28-keyword
Feature: Check SWT Engine Override (special projects) functionality

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

  Scenario: Check create shopping cart
    Given preconditions by user are selected
    And user select offers:
      | OfferId             |
      | 9153347723813004284 |
            # 4 Theme Packs & 1 Premium
      | 9152406687013913547 |
            # TELUS Internet 750/750
      | 9160783681513938083 |
        # Save on Internet only for 24 months (Mass) (NC)
    And user set the chars for item:
      | Name                | Value               | Item                |
      | 9157950816213373074 | 9157950816213373076 | 9152406687013913547 |
            # Delivery Method HSIA - Pro Install
      | 9158306682113553797 | 9158306751513553872 | 9153347723813004284 |
            # Delivery Method TV - Pro Install
    When user try to create Shopping Cart
    Then validate shopping cart is created successfully
    And user validate shopping cart should contain top offers:
      | OfferId             |
      | 9153347723813004284 |
         # 4 Theme Packs & 1 Premium
      | 9152406687013913547 |
        # TELUS Internet 750/750
      | 9160783681513938083 |
        # Save on Internet only for 24 months (Mass) (NC)
      | 9146582143513681890 |
        # Work Offer

  Scenario: Patch Work Offer Cart Item with coupon based offering
    Given preconditions by user are selected
    And user select offers:
      | OfferId             |
      | 9151014680013867743 |
    # New Install Appointment credit
    And user select child offer:
      | OfferId             | Parent              |
      | 9144579890813692894 | 9153347723813004284 |
            # 4K PVR
    And user set the chars for item:
      | Name                | Value                | Item                |
      | 9146582494313682120 | Test Automation oder | 9146582143513681890 |
      # Additional Access Information for Technician
      | 9146583560513682624 | 6048957320           | 9146582143513681890 |
      # Contact Telephone Number
      | 9153946160013528718 | FR                   | 9146582143513681890 |
      # CSD Preferred Language
      | 9146584435613683042 | TEST123              | 9146582143513681890 |
    # Special Project Code
    When user try to update Shopping Cart
    Then validate shopping cart is updated successfully
    And user validate cart item parameters should contain:
      | ParameterName |
      | name          |
    And user validate cart at least one item should contain price
    And user validate cart item should contain price alteration
    And user validate cart item categories should contain:
      | CategoryId          |
      | 9150400521113176960 |
      # Commitment
      #| 9147368267313811293 |
      # Coupon
      | 9137773148713852470 |
      # High Speed Home
      | 9150253640113241856 |
    # Optik TV
    And user validate shopping cart should contain top offers:
      | OfferId             |
      | 9146582143513681890 |
  # Work Offer

  Scenario: Check Validate shopping cart
    Given preconditions by user are selected
    When user try to validate shopping cart
    Then no error messages should be in shopping cart

  Scenario: Check Submit Shopping Cart Api
    Given preconditions by user are selected
    When user try to submit shopping cart
    Then sales order id should be returned

  Scenario: Check backend orders validation
    Given preconditions by user are selected
    When try to complete sales order on BE
    Then validate that no errors created on BE
    And validate that all orders are completed successfully
    And validate that all billing actions completed successfully

