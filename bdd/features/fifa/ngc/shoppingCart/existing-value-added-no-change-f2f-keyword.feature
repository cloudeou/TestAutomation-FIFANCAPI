@atlas
@SC
@existing-value-added-no-change-f2f-keyword
@addressType=FIBER
@addressPort=GPON
@DBbootstrap=addressBootstrap
@runTimes=1
@DBbootstrapParams={"type":"GPON"}

Feature: Existing active Value added Service

  Scenario: Get addess
    Given user has address with type FIBER
    And technology type is GPON
#    And distribution channel is F2F
    And distribution channel is CSR
    And customer category is RESIDENTIAL
    When get address is: @lpdsid '5753461'
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

  Scenario: Create SC with Telus Online Secutity offer
    Given preconditions by user are selected
    And test user select offers:
      | OfferId             |
      | 9157722462813159948 |
    # TELUS Online Security - Ultimate
      | 9161222936213626491 |
      # Gaming
      | 9162267642120575793 |
     # TELUS Wi-Fi Plus
      | 9162969962389409565 |
    #TELUS Internet 25/25
    And test user set the chars for item:
      | Name                | Value               | Item                |
      | 9157950816213373074 | 9157950816213373076 | 9150893104313917439 |
    # Delivery method - Pro Install
    When test user try to create Shopping Cart
    Then test validate shopping cart is created successfully
    And test user validate cart item parameters should contain:
      | ParameterName |
      | name          |
    And test user validate cart at least one item should contain price
    And test user validate shopping cart should contain top offers:
      | OfferId             |
      | 9157722462813159948 |

  Scenario: Update shopping cart add Add On and SLO
    Given preconditions by user are selected
    And test user select offers:
      | OfferId             |
      | 9151498546013354202 |
      # $200 Steam Gift Card
      | 9151919214213285035 |
    # Free LG 55" 4K HDR TV
      | 9161223209113626687 |
         # Nintendo Switch + Nintendo Switch Online - 24 Mo
    When test user try to update Shopping Cart
    Then test validate shopping cart is updated successfully

  Scenario: Validate shopping cart
    Given preconditions by user are selected
    When test user try to validate shopping cart
    Then test no error messages should be in shopping cart

  Scenario: Submit Shopping Cart Api
    Given preconditions by user are selected
    When test user try to submit shopping cart
    Then test sales order id should be returned
#
  Scenario: Check backend orders validation
    Given preconditions by user are selected
    When try to complete sales order on BE
    Then validate that no errors created on BE
    And validate that all orders are completed successfully
    And validate that all billing actions completed successfully

  Scenario: Create SC to remove Add Ons
    Given preconditions by user are selected
    When test user try to create Shopping Cart
    Then test validate shopping cart is created successfully

  Scenario: Update shopping remove and retain Add Ons
    Given preconditions by user are selected
    And test user delete offers:
      | OfferId             |
      | 9151919214213285035 |
    # Free LG 55" 4K HDR TV
    When test user try to update Shopping Cart
    Then test validate shopping cart is updated successfully

  Scenario: Validate shopping cart2
    Given preconditions by user are selected
    When test user try to validate shopping cart
    Then test no error messages should be in shopping cart

  Scenario: Submit Shopping Cart Api2
    Given preconditions by user are selected
    When test user try to submit shopping cart
    Then test sales order id should be returned

  Scenario: Check backend orders validation2
    Given preconditions by user are selected
    When try to complete sales order on BE
    Then validate that no errors created on BE
    And validate that all orders are completed successfully
    And validate that all billing actions completed successfully




