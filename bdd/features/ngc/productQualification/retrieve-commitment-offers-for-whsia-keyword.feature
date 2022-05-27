@atlas
@PQ
@retrieve-commitment-offers-for-whsia-keyword
Feature: Retrieve Commitment Offers for WHSIA


  Scenario: Check address
    Given user has address with type LTE
#    And EXTERNAL_ID of distribution channel is CPMS_CURRENTCHANNELOUTLETID_0000029199
    And distribution channel is PILOT6RT
    And customer category is RESIDENTIAL
    When get address based on entered data
    Then address id should be returned


  Scenario: Check service qualification for an address
    Given preconditions by user are selected
    When user check availability
    Then address should be qualified for LTE

  Scenario: Create a customer
    Given preconditions by user are selected
    When user try to create customer
    Then external customer id should be returned
    And billing account number is returned
    And credit check is performed

  Scenario: Create SC with Internet offer
    Given preconditions by user are selected
    And user select offers:
      | OfferId             |
      | 9159683640113535776 |
      # wHSIA Rural Internet - 100GB monthly data
    And user select commitments in trial period:
      | OfferId             |
      | 9159621605313507298 |
    # $5 off plus free Rental for 2 years
    And user set the chars for item:
      | Name                | Value               | Item                |
      | 9157950816213373074 | 9157950816213373076 | 9159683640113535776 |
      # Delivery method = Pro Install
    When user try to create Shopping Cart
    Then validate shopping cart is created successfully
    And user validate cart item parameters should contain:
      | ParameterName |
      | name          |
    And user validate cart at least one item should contain price
    And user validate shopping cart should contain top offers:
      | OfferId             |
      | 9159683640113535776 |
      | 9159621605313507298 |

  Scenario: Select child offer
    Given preconditions by user are selected
    And user select child offer:
      | OfferId             | Parent              |
#      | 9160571371613319983 | 9159683640113535776 |
#    #5G Indoor Router
      | 9160503693613228831 | 9159683640113535776 |
      | 9159698239513542765 | 9159683640113535776 |
    When user try to update Shopping Cart
    Then validate shopping cart is updated successfully

  Scenario: Qualified product offering list with shopping cart
    Given preconditions by user are selected
    And user filter by the following product offering id: 9159683640113535776
                                                         # wHSIA Rural Internet - 100GB monthly data
    And user try to get list of the qualified offers by the following commitment id: 9159621605313507298

    # When user try to get qualified product offering list with shopping cart
    #todo: need to check
    Then list of the following product offerings should be available:
      | OfferId |
      | any     |
    And validate product offering parameters should contain:
      | ParameterName |
      | name          |
    #  | description   |


  Scenario: Validate shopping cart (1)
    Given preconditions by user are selected
    When user try to validate shopping cart
    Then no error messages should be in shopping cart

#  Scenario: Submit SC (1)
#    Given preconditions by user are selected
#    When user try to submit shopping cart
#    Then sales order id should be returned
#
#  Scenario: Check backend orders validation (1)
#    Given preconditions by user are selected
#    When try to complete sales order on BE
#    Then validate that no errors created on BE
#    And validate that all orders are completed successfully
#    And validate that all billing actions completed successfully

  Scenario: Update SC, change period of commitment
    Given preconditions by user are selected
    And user delete offers:
      | OfferId             |
      | 9159621605313507298 |
      # $5 off plus free Rental for 2 years
    When user try to update Shopping Cart
    Then validate shopping cart is updated successfully

  Scenario: Validate shopping cart (2)
    Given preconditions by user are selected
    When user try to validate shopping cart
    Then no error messages should be in shopping cart

  Scenario: Submit SC (2)
    Given preconditions by user are selected
    When user try to submit shopping cart
    Then sales order id should be returned

  Scenario: Check backend orders validation (2)
    Given preconditions by user are selected
    When try to complete sales order on BE
    Then validate that no errors created on BE
    And validate that all orders are completed successfully
    And validate that all billing actions completed successfully


