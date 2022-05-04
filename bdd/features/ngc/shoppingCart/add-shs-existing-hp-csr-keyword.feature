@atlas
@SC
@add-shs-existing-hp-csr-keyword
@addressType=FIBER
@addressPort=GPON
Feature: Add New SHS on existing active HP

  Scenario: Get addess
    Given user has address with type FIBER
    And technology type is GPON
    And distribution channel is CSR
    And customer category is RESIDENTIAL
    When get address based on entered data
    Then address id should be returned

  Scenario: Get service qualification
    Given preconditions by user are selected
    When user check availability
    Then address should be qualified for GPON

  Scenario: Create customer
    Given preconditions by user are selected
    When user try to create customer
    Then external customer id should be returned
    And billing account number is returned
    And credit check is performed

  Scenario: Create SC with HP offer
    Given preconditions by user are selected
    And user select offers:
      | OfferId             |
      | 9136923654113578822 |
    # Home Phone
    When user try to create Shopping Cart
    Then validate shopping cart is created successfully
    And user validate cart item parameters should contain:
      | ParameterName |
      | name          |
    And user validate cart at least one item should contain price
    And user validate shopping cart should contain top offers:
      | OfferId             |
      | 9136923654113578822 |

  Scenario: Validate shopping cart 1
    Given preconditions by user are selected
    When user try to validate shopping cart
    Then no error messages should be in shopping cart

  Scenario: Submit Shopping Cart 1
    Given preconditions by user are selected
    When user try to submit shopping cart
    Then sales order id should be returned

  Scenario: Check backend orders validation 1
    Given preconditions by user are selected
    When try to complete sales order on BE
    Then validate that no errors created on BE
    And validate that all orders are completed successfully
    And validate that all billing actions completed successfully

  Scenario: Create SC to add SHS offer
    Given preconditions by user are selected
    When user try to create Shopping Cart
    Then validate shopping cart is created successfully

  Scenario: Check update shopping cart Api
    Given preconditions by user are selected
    And user select offers:
      | OfferId             |
      | 9162234688573639328 |
      # Secure
      | 9150400880613177266 |
    # Home Security Commitment on 36 month contract
    And user set the chars for item:
      | Name                | Value               | Item                |
      | 9155793580913292047 | 9155793538813291983 | 9162234688573639328 |
      # Delivery method SHS = Pro install
      | 9152694600113929802 | 9154132902813883884 | 9162234688573639328 |
      # Acquired From = Reliance
      | 9152552492613455557 | 9152552492613455566 | 9162234688573639328 |
    # Self-Install = No
    When user try to update Shopping Cart
    Then validate shopping cart is updated successfully

  Scenario: Select SHS commitment promotion
    Given preconditions by user are selected
    And user select offers:
      | OfferId             |
      | 9162728983709155290 |
      #3 Months Free SHS 10 M&H
      | 9147904372813829170 |
    # Shipment
    When user try to update Shopping Cart
    Then validate shopping cart is updated successfully

  Scenario: Validate shopping cart 2
    Given preconditions by user are selected
    When user try to validate shopping cart
    Then no error messages should be in shopping cart

  Scenario: Submit Shopping Cart 2
    Given preconditions by user are selected
    When user try to submit shopping cart
    Then sales order id should be returned

  Scenario: Check backend orders validation 2
    Given preconditions by user are selected
    When try to complete sales order on BE
    Then validate that no errors created on BE
    And validate that all orders are completed successfully
    And validate that all billing actions completed successfully


