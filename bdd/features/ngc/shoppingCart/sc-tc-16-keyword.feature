@atlas
@api
@SC
@sc-type-16-keyword
Feature: FIFA TC#16


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

  Scenario: Create SC with HS300,TV,SHS
    Given preconditions by user are selected
    And user select offers:
      | OfferId             |
      | 9159714683413600757 |
      #TELUS Internet 300/300
      | 9162184393413524077 |
    # Control Plus Video
      | 9159389559513259218 |
    # Home Security Commitment for 60 months
      | 9142278346813160836 |
      # Essentials
    And user set the chars for item:
      | Name                | Value               | Item                |
      | 9155793580913292047 | 9155793538813291983 | 9162184393413524077 |
      # Delivery method = Tech install
      | 9152694600113929802 | 9154132902813883866 | 9162184393413524077 |
      # Acquired From = Fluent
      | 9152552492613455557 | 9152552492613455566 | 9162184393413524077 |
    # Self-Install = No (BOE rule, cannot change, for validation only)
      | 9157950816213373074 | 9157950816213373076 | 9159714683413600757 |
    # Delivery method pro install for internet
    When user try to update Shopping Cart
    Then validate shopping cart is updated successfully

  Scenario: Add PVR
    Given preconditions by user are selected
    And user select child offer:
      | OfferId             | Parent              |
      | 9148267172313921553 | 9142278346813160836 |
      # Optik 4K PVR
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


  Scenario: Update SC, remove some Add Ons, remove Boost WiFi, add commitment offer, change top level offer in SC
    Given preconditions by user are selected
    And user select offers:
      | OfferId             |
      | 9152406687013913547 |
      # TELUS Internet 750/750
      | 9153347723813004284 |
     # 4 Theme Packs & 1 Premium
      | 9160783800613938284 |
    # Save on Internet & Optik TV For 24 months
      | 9153525538913326122 |
    # $200 Optik TV One Time Credit
    And user set the chars for item:
      | Name                | Value               | Item                |
      | 9155793580913292047 | 9155793538813291983 | 9162184393413524077 |
      # Delivery method = Tech install
      | 9152694600113929802 | 9154132902813883866 | 9162184393413524077 |
      # Acquired From = Fluent
      | 9152552492613455557 | 9152552492613455566 | 9162184393413524077 |
    # Self-Install = No (BOE rule, cannot change, for validation only)
      | 9157950816213373074 | 9157950816213373076 | 9159714683413600757 |
    # Delivery method pro install for internet
    When user try to update Shopping Cart
    Then validate shopping cart is updated successfully

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

  Scenario: Validate SC 2
    Given preconditions by user are selected
    When user try to validate shopping cart
    Then no error messages should be in shopping cart

  Scenario: Submit SC 2
    Given preconditions by user are selected
    When user try to submit shopping cart
    Then sales order id should be returned

  Scenario: Check backend orders validation 2s
    Given preconditions by user are selected
    When try to complete sales order on BE
    Then validate that no errors created on BE
    And validate that all orders are completed successfully
    And validate that all billing actions completed successfully



