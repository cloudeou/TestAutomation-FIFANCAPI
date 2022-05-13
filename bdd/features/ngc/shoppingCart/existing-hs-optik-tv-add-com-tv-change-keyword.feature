@atlas
@SC
@existing-hs-optik-tv-add-com-tv-change-keyword
Feature: Existing customer with active HS+Optik TV change TLO

  Scenario: Check address
    Given user has address with type FIBER
    Given user has address with type GPON
#    And distribution channel is CSR
    And distribution channel is PILOT3RT
    And customer category is RESIDENTIAL
    When get address based on entered data: '5481938'
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

  Scenario: Create SC with HS(Home security) offer and Optick TV offer
    Given preconditions by user are selected
    And user select offers:
      | OfferId             |
      | 9162234688573639328 |
      #Secure
      | 9153347723813004284 |
      #4 Theme Packs
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
    When user try to create Shopping Cart
    Then validate shopping cart is created successfully
    And user validate cart item parameters should contain:
      | ParameterName |
      | name          |
    And user validate cart at least one item should contain price
    And user validate shopping cart should contain top offers:
      | OfferId             |
      | 9162234688573639328 |
      | 9153347723813004284 |

  Scenario: Update SC with SLO, add Add Ons for OptikTV offer, add Equipment offers.
    Given preconditions by user are selected
    And user select child offer:
      | OfferId             | Parent              |
      | 9152633535113644812 | 9153347723813004284 |
      #4K Channel Pack
      | 9154703630213381920 | 9162234688573639328 |
    #4 CR2 Battery
      | 9144579890813692894 | 9153347723813004284 |
      # 4K PVR
    When user try to update Shopping Cart
    Then validate shopping cart is updated successfully


  Scenario: Validate shopping cart 1
    Given preconditions by user are selected
    When user try to validate shopping cart
    Then no error messages should be in shopping cart

  Scenario: Submit SC 1
    Given preconditions by user are selected
    When user try to submit shopping cart
    Then sales order id should be returned

  Scenario: Check backend orders validation 1
    Given preconditions by user are selected
    When try to complete sales order on BE
    Then validate that no errors created on BE
    And validate that all orders are completed successfully
    And validate that all billing actions completed successfully

  Scenario: Create same SC
    Given preconditions by user are selected
    When user try to create Shopping Cart
    Then validate shopping cart is created successfully

  Scenario: Add commitment offer to SC, change TV offer
    Given preconditions by user are selected
    And user select offers:
      | OfferId             |
      | 9152915333713768704 |
      #TELUS Internet & Optik TV Commitment
      | 9142278346813160836 |
    # Essentials
    When user try to update Shopping Cart
    Then validate shopping cart is updated successfully

 Scenario: Submit SC 2
   Given preconditions by user are selected
   When user try to submit shopping cart
   Then sales order id should be returned

 Scenario: Validate shopping cart 2
   Given preconditions by user are selected
   When user try to validate shopping cart
   Then no error messages should be in shopping cart

 Scenario: Check backend orders validation 2
   Given preconditions by user are selected
   When try to complete sales order on BE
   Then validate that no errors created on BE
   And validate that all orders are completed successfully
   And validate that all billing actions completed successfully
