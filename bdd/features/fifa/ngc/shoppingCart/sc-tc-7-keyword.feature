@atlas
@api
@SC
@sc-type-12-keyword
@DBbootstrap=addressBootstrap
@runTimes=1
@DBbootstrapParams={"type":"GPON","suiteName":"shoppingCart"}

Feature: Shopping cart 12 (Create SC with Channel Info, Product Offerings)

  #FIFA TC#7: use in SC 2,3
  Scenario: Get addess for FIFA TC#7
    Given user has address with type FIBER
    And technology type is GPON
    And distribution channel is PILOT3RT
    And customer category is RESIDENTIAL
    When get address based on entered data: '5753461'
    Then address id should be returned


  Scenario: Get service qualification for FIFA TC#7
    Given preconditions by user are selected
    When user check availability
    Then address should be qualified for GPON


  Scenario: Create customer for FIFA TC#7
    Given preconditions by user are selected
    When user try to create customer
    Then external customer id should be returned
    And billing account number is returned
    And credit check is performed


  Scenario: Internet + TV + HomePhone
    Given preconditions by user are selected
    And test user select offers:
      | OfferId             |
      | 9152406687013913547 |
      # TELUS Internet 750/750
      | 9142278346813160836 |
      # Essentials
      | 9136923654113578822 |
      # Home Phone
    When test user try to create Shopping Cart
    Then test validate shopping cart is created successfully
    And test user validate cart item parameters should contain:
      | ParameterName |
      | name          |
    And test user validate cart at least one item should contain price
    And test user validate shopping cart should contain top offers:
      | OfferId             |
      | 9152406687013913547 |
      | 9142278346813160836 |
      | 9136923654113578822 |

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
    When test user try to update Shopping Cart
    Then test validate shopping cart is updated successfully


  Scenario: Validate shopping cart in FIFA TC#7 (1)
    Given preconditions by user are selected
    When test user try to validate shopping cart
    Then test no error messages should be in shopping cart


  Scenario: Submit Cart in FIFA TC#7 (1)
    Given preconditions by user are selected
    When test user try to submit shopping cart
    Then test sales order id should be returned


  Scenario: Check backend orders validation in FIFA TC#7 (1)
    Given preconditions by user are selected
    When try to complete sales order on BE
    Then validate that no errors created on BE
    And validate that all orders are completed successfully
    And validate that all billing actions completed successfully


  Scenario: Create SC to change TLO for FIFA TC#7
    Given preconditions by user are selected
    When test user try to create Shopping Cart
    Then test validate shopping cart is created successfully


  Scenario: Internet Addon - Unlimited HS , Norton VPN Basic
    Given preconditions by user are selected
    And test user select child offer:
      | OfferId             | Parent              |
      | 9150918475013936444 | 9150893104313917439 |
      # Unlimited Data Usage
      | 9153295460913894539 | 9150893104313917439 |
      # Norton Secure VPN - Basic
      | 9136923654113578868 | 9136923654113578822 |
    # Directory Listing
    And test user set the chars for item:
      | Name                | Value               | Item                |
      | 9144240341813171759 | 9144283379913208296 | 9136923654113578822 |
    # Directory listing selection = Yes             Home Phone
      | 9137139491313730091 | 9137225349213783981 | 9136923654113578868 |
    # Address Listing Type =  Partial            Directory listing
      | 9146280548313693663 | 9146280548313693668 | 9136923654113578822 |
    # Telephone Number Porting = Port-in          Home Phone
      | 9157950816213373074 | 9157950816213373076 | 9152406687013913547 |


  Scenario: Validate shopping cart in FIFA TC#7 (2)
    Given preconditions by user are selected
    When test user try to validate shopping cart
    Then test no error messages should be in shopping cart


  Scenario: Submit Cart in FIFA TC#7 (2)
    Given preconditions by user are selected
    When test user try to submit shopping cart
    Then test sales order id should be returned


  Scenario: Check backend orders validation in FIFA TC#7 (2)
    Given preconditions by user are selected
    When try to complete sales order on BE
    Then validate that no errors created on BE
    And validate that all orders are completed successfully
    And validate that all billing actions completed successfully
