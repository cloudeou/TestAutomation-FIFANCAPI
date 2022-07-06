@atlas
@SC
@sc-tc-6-keyword
@DBbootstrap=addressBootstrap
@runTimes=1
@DBbootstrapParams={"type":"GPON"}

Feature: Shopping cart 3 (Create SC with Channel Info, Product Offerings and Commitment Offerings)
#https://flcncapp-itn02.tsl.telus.com/common/uobject.jsp?tab=_Orders&object=9163680933013447942

  Scenario: Get addess 6
    Given user has address with type FIBER
    And technology type is GPON
    And distribution channel is PILOT3RT
    And customer category is RESIDENTIAL
    When get address is: @lpdsid '5753461'
    Then address id should be returned

  Scenario: Get service qualification 6
    Given preconditions by user are selected
    When user check availability
    Then address should be qualified for GPON

  Scenario: Create customer 6
    Given preconditions by user are selected
    When user try to create customer
    Then external customer id should be returned
    And billing account number is returned
    And credit check is performed

  Scenario: HS150 + 4 Theme Packs & 1 Premium on 2 year term
    Given preconditions by user are selected
    And test user select offers:
      | OfferId             |
      | 9150564125513493939 |
      # TELUS Internet 150/150
      | 9153347723813004284 |
     # 4 Theme Packs & 1 Premium
      | 9160783800613938284 |
    # Save on Internet & Optik TV For 24 months
      | 9153525538913326122 |
    # $200 Optik TV One Time Credit
    And test user set the chars for item:
      | Name                | Value    | Item                |
      | 9147361018813807887 | OPTIK200 | 9153525538913326122 |
    # | Coupon Code       |          |  $200 Optik TV One Time Credit |
    When test user try to create Shopping Cart
    Then test validate shopping cart is created successfully
    And test user validate cart item parameters should contain:
      | ParameterName |
      | name          |
    And test user validate cart at least one item should contain price
    And test user validate shopping cart should contain top offers:
      | OfferId             |
      | 9150564125513493939 |
      | 9153347723813004284 |
      | 9160783800613938284 |
     # | 9153525538913326122 |

  Scenario: Update SC with SLO, add Add Ons for OptikTV offer, add Equipment offers.
    Given preconditions by user are selected
    And test user select child offer:
      | OfferId             | Parent              |
      | 9152633535113644812 | 9153347723813004284 |
      #4K Channel Pack
      | 9154703630213381920 | 9162234688573639328 |
    #4 CR2 Battery
      | 9144579890813692894 | 9153347723813004284 |
      # 4K PVR
      | 9153346572313003606 | 9153347723813004284 |
      # Netflix Premium
    When test user try to update Shopping Cart
    Then test validate shopping cart is updated successfully


  Scenario: Validate shopping cart 6
    Given preconditions by user are selected
    When test user try to validate shopping cart
    Then test no error messages should be in shopping cart

  Scenario: Submit Cart 6
    Given preconditions by user are selected
    When test user try to submit shopping cart
    Then test sales order id should be returned

  Scenario: Check backend orders validation 6
    Given preconditions by user are selected
    When try to complete sales order on BE
    Then validate that no errors created on BE
    And validate that all orders are completed successfully
    And validate that all billing actions completed successfully

  Scenario: Create SC to change TLO 6
    Given preconditions by user are selected
    When test user try to create Shopping Cart
    Then test validate shopping cart is created successfully
