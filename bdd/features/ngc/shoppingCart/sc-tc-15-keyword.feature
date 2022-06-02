@atlas
@api
@SC
@sc-type-15-keyword
Feature: FIFA TC#15


  Scenario: Check address
    Given user has address with type GPON
    And distribution channel is CSR
    And customer category is RESIDENTIAL
    When get address based on entered data
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

  Scenario: Create SC with HSIA offer
    Given preconditions by user are selected
    And test user select offers:
      | OfferId             |
      | 9150529131613486915 |
    #TELUS Internet 25/25
    And test user set the chars for item:
      | Name                | Value               | Item                |
      | 9157950816213373074 | 9157950816213373076 | 9150529131613486915 |
    # Delivery method - Pro Install
    When test user try to create Shopping Cart
    Then test validate shopping cart is created successfully
    And test user validate cart item parameters should contain:
      | ParameterName |
      | name          |
    And test user validate cart at least one item should contain price
    And test user validate shopping cart should contain top offers:
      | OfferId             |
      | 9150529131613486915 |

  Scenario: Validate shopping cart 1
    Given preconditions by user are selected
    When test user try to validate shopping cart
    Then test no error messages should be in shopping cart

  Scenario: Submit SC 1
    Given preconditions by user are selected
    When test user try to submit shopping cart
    Then test sales order id should be returned

  Scenario: Check backend orders validation 1
    Given preconditions by user are selected
    When try to complete sales order on BE
    Then validate that no errors created on BE
    And validate that all orders are completed successfully
    And validate that all billing actions completed successfully

  Scenario: Create same SC
    Given preconditions by user are selected
    When test user try to create Shopping Cart
    Then test validate shopping cart is created successfully


  Scenario: Update SC, remove some Add Ons, remove Boost WiFi, add commitment offer, change top level offer in SC
    Given preconditions by user are selected
    And test user select offers:
      | OfferId             |
      | 9161238699413455336 |
      #AirPod Pro GWP for High Speed RNW
      | 9159714683413600757 |
      #TELUS Internet 300/300
      | 9162184393413524077 |
    # Control Plus Video
      | 9159389559513259218 |
    # Home Security Commitment for 60 months
    And test user set the chars for item:
      | Name                | Value               | Item                |
      | 9155793580913292047 | 9155793538813291983 | 9162184393413524077 |
      # Delivery method = Tech install
      | 9152694600113929802 | 9154132902813883866 | 9162184393413524077 |
      # Acquired From = Fluent
      | 9152552492613455557 | 9152552492613455566 | 9162184393413524077 |
    # Self-Install = No (BOE rule, cannot change, for validation only)
      | 9157950816213373074 | 9157950816213373076 | 9159714683413600757 |
    # Delivery method pro install for internet
    When test user try to update Shopping Cart
    Then test validate shopping cart is updated successfully

  Scenario: Validate SC 2
    Given preconditions by user are selected
    When test user try to validate shopping cart
    Then test no error messages should be in shopping cart

  Scenario: Submit SC 2
    Given preconditions by user are selected
    When test user try to submit shopping cart
    Then test sales order id should be returned

  Scenario: Check backend orders validation 2s
    Given preconditions by user are selected
    When try to complete sales order on BE
    Then validate that no errors created on BE
    And validate that all orders are completed successfully
    And validate that all billing actions completed successfully



