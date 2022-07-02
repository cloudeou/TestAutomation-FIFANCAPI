# SuiteNames
@regression
@Api
@reg_11-keyword
@DBbootstrap=addressBootstrap
@runTimes=1
@DBbootstrapParams={"type":"LTE","suiteName":"dmt-regression"}

Feature: Provide, change, cease TV with Netflix

  Scenario: Check address
    Given user has address with type LTE
    When get address is: @lpdsid
    Then address id should be returned

  Scenario: Check service qualification for an address
    Given preconditions by user are selected
    When user check availability
    Then address should be qualified for LTE

  Scenario: Create a customer
    Given preconditions by user are selected
    And create real email address for API
    When user try to create customer
    Then external customer id should be returned
    And billing account number is returned
    And credit check is performed

  Scenario: Check create shopping cart
    Given preconditions by user are selected
    And test user select offers:
      | OfferId             |
      | 9153347723813004284 |
            # 4 Theme Packs & 1 Premium
      | 9152406687013913547 |
            # TELUS Internet 750/750
      | 9160783681513938083 |
        # Save on Internet only for 24 months (Mass) (NC)
    And test user set the chars for item:
      | Name                | Value               | Item                |
      | 9157950816213373074 | 9157950816213373076 | 9152406687013913547 |
            # Delivery Method HSIA - Pro Install
      | 9158306682113553797 | 9158306751513553872 | 9153347723813004284 |
            # Delivery Method TV - Pro Install
    When test user try to create Shopping Cart
    Then test validate shopping cart is created successfully
    And user validate shopping cart should contain top offers:
      | OfferId             |
      | 9153347723813004284 |
      | 9152406687013913547 |
      | 9160783681513938083 |

  Scenario: Check update shopping cart Api
    Given preconditions by user are selected
    And  test user select child offer:
      | OfferId             | Parent              |
      | 9144579890813692894 | 9153347723813004284 |
            # 4K PVR
      | 9153346572313003606 | 9153347723813004284 |
      # Netflix Premium
      | 9159960387513725198 | 9153347723813004284 |
      # Netflix Standard
    And test user set the chars for item:
      | Name                | Value               | Item                |
      | 9148465520113089778 | 9148465700013089856 | 9153347723813004284 |
        # Number of TVs
    When test user try to update Shopping Cart
    Then test validate shopping cart is updated successfully
    And user validate shopping cart should contain child offers:
      | OfferId             |
      | 9159960387513725198 |
      # Netflix Standard
    And user validate shopping cart should not contain child offers:
      | OfferId             |
      | 9160636637613354402 |
   # Netflix Premium Surcharge
      | 9153346572313003606 |
   # Netflix Premium

  Scenario: Check Validate shopping cart (1)
    Given preconditions by user are selected
    When user try to validate shopping cart
    Then no error messages should be in shopping cart

  Scenario: Check Submit Shopping Cart Api (1)
    Given preconditions by user are selected
    When user try to submit shopping cart
    Then sales order id should be returned

  Scenario: Check backend orders validation (1)
    Given preconditions by user are selected
    When try to complete sales order on BE
    Then validate that no errors created on BE
    And validate that all orders are completed successfully
    #And validate that all billing actions completed successfully

  Scenario: Create shopping cart (2)
    Given preconditions by user are selected
    When test user try to create Shopping Cart
    Then test validate shopping cart is created successfully

  Scenario: Provide Netflix Premium
    Given preconditions by user are selected
    And  test user select child offer:
      | OfferId             | Parent              |
      | 9153346572313003606 | 9153347723813004284 |
      # Netflix Premium
    When test user try to update Shopping Cart
    Then test validate shopping cart is updated successfully
    And user validate shopping cart should contain child offers:
      | OfferId             |
      | 9160636637613354402 |
   # Netflix Premium Surcharge
      | 9153346572313003606 |
   # Netflix Premium
    And user validate shopping cart should not contain child offers:
      | OfferId             |
      | 9159960387513725198 |
      # Netflix Standard

  Scenario: Check Validate shopping cart (2)
    Given preconditions by user are selected
    When user try to validate shopping cart
    Then no error messages should be in shopping cart

  Scenario: Submit Shopping Cart (2)
    Given preconditions by user are selected
    When user try to submit shopping cart
    Then sales order id should be returned

  Scenario: Check backend orders validation (2)
    Given preconditions by user are selected
    When try to complete sales order on BE
    Then validate that no errors created on BE
    And validate that all orders are completed successfully
    #And validate that all billing actions completed successfully

  Scenario: Create shopping cart (2)
    Given preconditions by user are selected
    When test user try to create Shopping Cart
    Then test validate shopping cart is created successfully

  Scenario: Cease TV
    Given preconditions by user are selected
    And user delete offers:
      | OfferId             |
      | 9153347723813004284 |
     # 4 Theme Packs & 1 Premium
    When test user try to update Shopping Cart
    Then test validate shopping cart is updated successfully

  Scenario: Check Validate shopping cart (2)
    Given preconditions by user are selected
    When user try to validate shopping cart
    Then no error messages should be in shopping cart

  Scenario: Submit Shopping Cart (2)
    Given preconditions by user are selected
    When user try to submit shopping cart
    Then sales order id should be returned

  Scenario: Check backend orders validation (2)
    Given preconditions by user are selected
    When try to complete sales order on BE
    Then validate that no errors created on BE
    And validate that all orders are completed successfully
    #And validate that all billing actions completed successfully