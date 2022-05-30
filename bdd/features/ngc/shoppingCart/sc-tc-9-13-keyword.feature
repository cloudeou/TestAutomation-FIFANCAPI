@atlas
@SC
@sc-tc-9-13-keyword.feature
Feature: Shopping cart 3 (Create SC with Channel Info, Product Offerings and Commitment Offerings)

  Scenario: Get addess 9
    Given user has address with type FIBER
    And technology type is GPON
    When get address based on entered data: '3238438'
    Then address id should be returned

  Scenario: Get service qualification 9
    Given preconditions by user are selected
    When user check availability
    Then address should be qualified for GPON

  Scenario: Create customer 9
    Given preconditions by user are selected
    And distribution channel is PILOT3RT
    And customer category is RESIDENTIAL
    When user try to create customer
    Then external customer id should be returned
    And billing account number is returned
    And credit check is performed

  Scenario: Create SC HS25+ 7 Theme pack + 1 premium
    Given preconditions by user are selected
    And test user select offers:
      | OfferId             |
      | 9150529131613486915 |
      # TELUS Internet 25/25
      | 9153357971813013786 |
    # 7 Theme Packs & 1 Premium
    And test user select child offer:
      | OfferId             | Parent              |
      | 9155519369313230144 | 9153357971813013786 |
      # Cinema One
      | 9136080259513413648 | 9153357971813013786 |
      # Beijing TV
      | 9143332428313728737 | 9153357971813013786 |
      # Disney Time
      | 9136080260713413919 | 9153357971813013786 |
      # EuroNews
      | 9136080259413413620 | 9153357971813013786 |
      # BBC World News
      | 9142278431513160895 | 9153357971813013786 |
      # Favourite Films
      | 9136080259113413556 | 9153357971813013786 |
      # Lifetime HD
      | 9140066935713112206 | 9153357971813013786 |
      # Crave(Premium)
      | 9150280421713159508 | 9150529131613486915 |
      # TELUS Boost Wi-Fi Starter Pack Easy Payment
      | 9148871359813039639 | 9150529131613486915 |
    # TELUS Boost Wi-Fi Expansion Pack Purchase
    When test user try to create Shopping Cart
    Then test validate shopping cart is created successfully
    And test user validate cart item parameters should contain:
      | ParameterName |
      | name          |
    And test user validate cart at least one item should contain price
    And test user validate shopping cart should contain top offers:
      | OfferId             |
      | 9150529131613486915 |
      # TELUS Internet 25/25
      | 9153357971813013786 |
  # 7 Theme Packs & 1 Premium

  Scenario: Update SC with SLO, add Add Ons for OptikTV offer, add Equipment offers.
    Given preconditions by user are selected
    And test user select child offer:
      | OfferId             | Parent              |
      | 9144579890813692894 | 9153357971813013786 |
      # 4K PVR
    When test user try to update Shopping Cart
    Then test validate shopping cart is updated successfully

  Scenario: Update SC upgrade to 11 Theme Packs & 1 Premium
    Given preconditions by user are selected
    And test user select child offer:
      | OfferId             | Parent              |
      | 9142952842813225187 | 9153357971813013786 |
      #Filipino Movies
      | 9154822355013209830 | 9153357971813013786 |
      #South Asian Cricket Pack
      | 9155652349213847987 | 9153357971813013786 |
      #Arabic Pack
      | 9155528473113237365 | 9153357971813013786 |
    #German entertainment
    And test prepare context data for Upgrade
      | From                | To                  |
      | 9153357971813013786 | 9153358200213013887 |
    #7 Theme Packs & 1 Premium | 11 Theme Packs & 2 Premium
    When test user try to update Shopping Cart
    Then test validate shopping cart is updated successfully

  Scenario: Update SC add charge additionally channels
    Given preconditions by user are selected
    And test user select child offer:
      | OfferId             | Parent              |
      | 9145925448313321985 | 9153358200213013887 |
    #Crave+Movies+HBO
      | 9144579890813692894 | 9153358200213013887 |
      # 4K PVR
    When test user try to update Shopping Cart
    Then test validate shopping cart is updated successfully
    And test user validate at least one cart item should contain price alteration

  Scenario: Add promotion
    And user apply the following manual discounts:
      | DiscountId          | ReasonCd            | Parent              |
      | 9159632109613026262 | 9149562400313086741 | 9153358200213013887 |
    # $10 Off Optik TV (Ongoing)
    When user try to apply promotions
    Then promotions are applied
    And discount savings are correct after apply promotions

  Scenario: Validate shopping cart 9
    Given preconditions by user are selected
    When test user try to validate shopping cart
    Then test no error messages should be in shopping cart

  Scenario: Submit Cart 9
    Given preconditions by user are selected
    When test user try to submit shopping cart
    Then test sales order id should be returned

  Scenario: Check backend orders validation 9
    Given preconditions by user are selected
    When try to complete sales order on BE
    Then validate that no errors created on BE
    And validate that all orders are completed successfully
    And validate that all billing actions completed successfully
