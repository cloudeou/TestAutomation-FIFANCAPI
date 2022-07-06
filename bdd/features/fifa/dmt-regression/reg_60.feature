@-
@regression
@reg_60-keyword
@DBbootstrap=addressBootstrap
@runTimes=1
@DBbootstrapParams={"type":"wHSIA"}

Feature: Check fees for a customer with wHSIA, a commitment and Easy Pay equipment

  Scenario: Check address
    Given user has address with type LTE
    When get address is: @lpdsid
    Then address id should be returned

  Scenario: Check service qualification for an address
    Given preconditions by user are selected
    When user check availability
    Then address should be qualified for LTE

  Scenario: Create customer
    Given preconditions by user are selected
    When user try to create customer
    Then external customer id should be returned
    And billing account number is returned
    And credit check is performed

  Scenario: Create SC with wHSIA Internet offer
    Given preconditions by user are selected
    And test user select offers:
      | OfferId             |
      | 9159602850913498849 |
      # wHSIA Rural Internet - 100GB monthly data
    And test user select commitments in trial period:
      | OfferId             |
      | 9159621605313507298 |
    # $5 off plus free Rental for 2 years
    And test user set the chars for item:
      | Name                | Value               | Item                |
      # | 9157950816213373074 | 9157950816213373076 | 9159602850913498849 |
      # # Delivery method = Pro Install
      | 9157950816213373074 | 9157950816213373075 | 9159602850913498849 |
      # Delivery method = Self-Install
    When test user try to create Shopping Cart
    Then test validate shopping cart is created successfully
    And test user validate cart item parameters should contain:
      | ParameterName |
      | name          |
    And test user validate cart at least one item should contain price
    And test user validate shopping cart should contain top offers:
      | OfferId             |
      | 9159602850913498849 |
      # | 9159621605313507298 |

  Scenario: Select child offer with Easy Pay
    Given preconditions by user are selected
    And test user select child offer:
      | OfferId             | Parent              |
    #   | 9160503720413228868 | 9159602850913498849 |
      # 5G Indoor Router Easy Payment
      | 9160588767613329201 | 9159602850913498849 |
      # 5G Outdoor Router Easy Pay
      | 9159698239513542765 | 9159602850913498849 |
      #SIM
    And test user set the chars for item:
      | Name                | Value               | Item                |
      | 9151550795513408112 | 9151550795513408113 | 9160588767613329201 |
      # | Purchase Type     | Easy Pay            | 5G Outdoor Router Easy Pay |
    When test user try to update Shopping Cart
    Then test validate shopping cart is updated successfully

  Scenario: Validate shopping cart 1
    Given preconditions by user are selected
    When test user try to validate shopping cart
    Then test no error messages should be in shopping cart

  Scenario: Submit SC (1)
    Given preconditions by user are selected
    When test user try to submit shopping cart
    Then test sales order id should be returned

 Scenario: Check backend orders validation (1)
    Given preconditions by user are selected
    When try to complete sales order on BE
    Then validate that no errors created on BE
    And validate that all orders are completed successfully

Scenario: Create shopping cart (2)
    Given preconditions by user are selected
    When test user try to create Shopping Cart
    Then test validate shopping cart is created successfully

Scenario: Update SC, cease wHSIA service
    Given preconditions by user are selected
    And test user delete offers:
      | OfferId             |
      | 9159602850913498849 |
      # wHSIA Rural Internet - 100GB monthly data
      | 9159621605313507298 |
    # $5 off plus free Rental for 2 years
    When test user try to update Shopping Cart
    Then test validate shopping cart is updated successfully

  Scenario: Validate shopping cart (2)
    Given preconditions by user are selected
    When test user try to validate shopping cart
    Then test no error messages should be in shopping cart

  Scenario: Submit SC (2)
    Given preconditions by user are selected
    When test user try to submit shopping cart
    Then test sales order id should be returned
    And check sales order statuse is: 'Superseded'

  Scenario: Check backend orders validation (2)
    Given preconditions by user are selected
    When try to complete sales order on BE
    Then validate that no errors created on BE
    And validate that all orders are completed successfully
    And validate that all billing actions completed successfully
      