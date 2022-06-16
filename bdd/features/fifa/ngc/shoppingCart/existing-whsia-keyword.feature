@atlas
@SC
@existing-whsia-keyword
@DBbootstrap=addressBootstrap
@runTimes=1
@DBbootstrapParams={"type":"LTE","suiteName":"shoppingCart"}

Feature: Existing WHSIA


  Scenario: Check address
    Given user has address with type LTE
#    And EXTERNAL_ID of distribution channel is CPMS_CURRENTCHANNELOUTLETID_0000029199
    And distribution channel is PILOT6RT
    And customer category is RESIDENTIAL
    When get address is: @lpdsid '5753461'
    Then address id should be returned


  Scenario: Check service qualification for an address
    Given preconditions by user are selected
    When user check availability
    Then address should be qualified for LTE

#  Scenario: Create customer
#    Given preconditions by user are selected
#    When user try to create customer
#    Then external customer id should be returned
#    And billing account number is returned
#    And credit check is performed

  Scenario: Create SC with wHSIA
    Given preconditions by user are selected
    And test user select offers:
      | OfferId             |
      | 9159602850913498849 |
    # wHSIA Rural Internet - 100GB monthly data
#      | 9152406687013913547 |
#      # TELUS Internet 750/750
    And test user set the chars for item:
      | Name                | Value               | Item                |
      |9157950816213373074  | 9157950816213373076 | 9159602850913498849 |
#      Delivery method - Pro Install
    When test user try to create Shopping Cart
    Then test validate shopping cart is created successfully
    And test user validate cart item parameters should contain:
      | ParameterName |
      | name          |
    And test user validate cart at least one item should contain price
    And test user validate shopping cart should contain top offers:
      | OfferId             |
      | 9159602850913498849 |
#      | 9152406687013913547 |

#  Scenario: Update SC, add child offer
#    Given preconditions by user are selected
#    And test user select child offer:
#      | OfferId             | Parent              |
#      | 9159709923413548570 | 9159602850913498849 |
#    # 50GB recurring top-up
#      | 9160503720413228868 |  9159602850913498849 |
#      | 9159698239513542765 | 9159602850913498849 |
#      | 9159698239513542765 | 9159602850913498849 |
#    # SIM
##      | 9160503549513228792 | 9159602850913498849 |
##      | 9160571371613319983 | 9159602850913498849 |
#    When test user try to update Shopping Cart
#    Then test validate shopping cart is updated successfully
#    And user validate at least one cart item should contain price alteration

  Scenario: Validate shopping cart 1
    Given preconditions by user are selected
    When test user try to validate shopping cart
    Then test no error messages should be in shopping cart

#  Scenario: Submit SC 1
#    Given preconditions by user are selected
#    When test user try to submit shopping cart
#    Then test sales order id should be returned
#
#  Scenario: Check backend orders validation 1
#    Given preconditions by user are selected
#    When try to complete sales order on BE
#    Then validate that no errors created on BE
#    And validate that all orders are completed successfully
#    And validate that all billing actions completed successfully
#
#  Scenario: Create same SC
#    Given preconditions by user are selected
#    When test user try to create Shopping Cart
#    Then test validate shopping cart is created successfully
#
#  Scenario: Delete TLO
#    Given preconditions by user are selected
#    And test user delete offers:
#    | OfferId             |
#    | 9159602850913498849 |
#     # wHSIA Rural Internet - 100GB monthly data
#    When test user try to update Shopping Cart
#    Then test validate shopping cart is updated successfully
#
#  Scenario: Add new TLO
#    Given preconditions by user are selected
#    And test user select offers:
#    | OfferId             |
#    | 9159683640113535776 |
#    #wHSIA Rural Internet - 500GB monthly data
#    When test user try to update Shopping Cart
#    Then test validate shopping cart is updated successfully
#
#  Scenario: Validate shopping cart 2
#    Given preconditions by user are selected
#    When test user try to validate shopping cart
#    Then test no error messages should be in shopping cart
#
#  Scenario: Submit SC 2
#    Given preconditions by user are selected
#    When test user try to submit shopping cart
#    Then test sales order id should be returned
#
#  Scenario: Check backend orders validation 2
#    Given preconditions by user are selected
#    When try to complete sales order on BE
#    Then validate that no errors created on BE
#    And validate that all orders are completed successfully
#    And validate that all billing actions completed successfully
