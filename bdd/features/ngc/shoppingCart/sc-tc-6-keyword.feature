@atlas
@SC
@sc-tc-6-keyword
Feature: Shopping cart 3 (Create SC with Channel Info, Product Offerings and Commitment Offerings)


  Scenario: Get addess
    Given user has address with type FIBER
    And technology type is GPON
    And distribution channel is PILOT3RT
    And customer category is RESIDENTIAL
    When get address based on entered data: '3238438'
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

  Scenario: HS150 + 4 Theme Packs & 1 Premium on 2 year term
    Given preconditions by user are selected
    And test user select offers:
      | OfferId             |
      | 9150564125513493939 |
      # TELUS Internet 150/150
      | 9153347723813004284 |
     # 4 Theme Packs & 1 Premium
      | 9160749291613917553 |
    # Save on Internet only for 24 months (Mass) (NC)
      | 9154252954313818263 |
    # Save up to $10 per month on Optik TV for 24 months (NC)
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
      | 9160749291613917553 |
      | 9154252954313818263 |

  Scenario: Update SC with SLO, add Add Ons for OptikTV offer, add Equipment offers.
    Given preconditions by user are selected
    And test user select child offer:
      | OfferId             | Parent              |
      | 9152633535113644812 | 9153347723813004284 |
      #4K Channel Pack
      | 9144579890813692894 | 9153347723813004284 |
      # 4K PVR
    When test user try to update Shopping Cart
    Then test validate shopping cart is updated successfully

  Scenario: Update SC with SLO, add Add Ons for HSIA offer, add Equipment offers.
    Given preconditions by user are selected
    And test user select child offer:
      | OfferId             | Parent              |
      | 9151960774813952250 | 9150564125513493939 |
      #TELUS Boost Starter Pack PIF
    When test user try to update Shopping Cart
    Then test validate shopping cart is updated successfully

  Scenario: Update shopping cart and add child offers to apply promotion
    Given preconditions by user are selected
    And user apply the following manual discounts:
      | DiscountId          | ReasonCd            | Parent              |
      | 9151676224413062040 | 9149562400313086741 | 9150564125513493939 |
     # HS 12 MO Upsell Discount - $5 with reason TELUS Rewards for HSIA
      | 9149256790313067360 | 9149562400313086741 | 9153347723813004284 |
    # Optik TV 20% Realtor discount - 3 months TELUS Rewards for TV
    When user try to apply promotions
    Then promotions are applied
    And discount savings are correct after apply promotions


  Scenario: Validate shopping cart
    Given preconditions by user are selected
    When test user try to validate shopping cart
    Then test no error messages should be in shopping cart

  Scenario: Submit Cart
    Given preconditions by user are selected
    When test user try to submit shopping cart
    Then test sales order id should be returned

  Scenario: Check backend orders validation
    Given preconditions by user are selected
    When try to complete sales order on BE
    Then validate that no errors created on BE
    And validate that all orders are completed successfully
    And validate that all billing actions completed successfully
