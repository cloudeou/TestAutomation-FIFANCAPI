#SuiteNames
@regression
@Api
@reg_09-keyword
@DBbootstrap=addressBootstrap
@runTimes=1
@DBbootstrapParams={"type":"GPON","suiteName":"dmt-regression"}

Feature: Provide HSIA with Pik TV: amend cancel and reprovide

  Scenario: Check address
    Given user has address with type GPON
    And distribution channel is CSR
    And customer category is RESIDENTIAL
    When get address is: @lpdsid
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

  Scenario: Create SC with Pik TV and HSIA 1 
    Given preconditions by user are selected
    And test user select offers:
      | OfferId             |
      | 9150529041113486764 |
      # TELUS Internet 75/75
      | 9160783681513938083 |
      #Special Offer: Save on Internet for 24 months (NC)
      | 9146775787813796264 |
    # The Basics + Pik 5
    And test user set the chars for item:
      | Name                | Value               | Item                |
      | 9157950816213373074 | 9157950816213373076 | 9150893104313917439 |
    # Delivery method - Pro Install
    When test user try to create Shopping Cart
    Then test validate shopping cart is created successfully

  Scenario: Validate SC#1
    Given preconditions by user are selected
    When user try to validate shopping cart
    Then no error messages should be in shopping cart

  Scenario: Check Submit SC#1 Api
    Given preconditions by user are selected
    When user try to submit shopping cart
    Then sales order id should be returned
    And check present order statuses
      | objectTypeId        | Status     |
      | 9138418725413841757 | Processing |
      # Work Order
      | 9137993960013452674 | Completed  |
      # Connectivity Order
      | 9134833640013240063 | Completed  |
      # TV Order
      | 9134835128913241445 | Entering   |
      # Internet Order



  Scenario: Cancel sales order in BE
    Given preconditions by user are selected
    When try to cancel sales order on BE
    Then validate that no errors created on BE
    And validate that all orders are canceled successfully
    #todo need to add id Disconnected, Removed
    And check present order statuses
      | objectTypeId        | Status       |
      | 9138418725413841757 | Cancelled    |
      # Work Order
      | 9121059404013834732 | Completed    |
      # Disconnect Product Order - connectivity
      | 9134833640013240074 | Completed |
      # TELUS TV Product Disconnect Order

  Scenario: Create SC with Pik TV and HSIA
    Given preconditions by user are selected
    And test user select offers:
      | OfferId             |
      | 9150529041113486764 |
      # TELUS Internet 75/75
      | 9160783681513938083 |
      #Special Offer: Save on Internet for 24 months (NC)
      | 9146775787813796264 |
    # The Basics + Pik 5
    And test user set the chars for item:
      | Name                | Value               | Item                |
      | 9157950816213373074 | 9157950816213373076 | 9150893104313917439 |
    # Delivery method - Pro Install
    When test user try to create Shopping Cart
    Then test validate shopping cart is created successfully

  Scenario: Validate SC#2
    Given preconditions by user are selected
    When user try to validate shopping cart
    Then no error messages should be in shopping cart

  Scenario: Check Submit SC#2 Api
    Given preconditions by user are selected
    When user try to submit shopping cart
    Then sales order id should be returned
    And check present order statuses
      | objectTypeId        | Status     |
      | 9138418725413841757 | Processing |
      # Work Order
      | 9137993960013452674 | Completed  |
      # Connectivity Order
      | 9134833640013240063 | Completed  |
      # TV Order
      | 9134835128913241445 | Entering   |
      # Internet Order

  Scenario: Check backend orders validation
    Given preconditions by user are selected
    When try to complete sales order on BE
    Then validate that no errors created on BE
    And validate that all orders are completed successfully
    And validate that all billing actions completed successfully



