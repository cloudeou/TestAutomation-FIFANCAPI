@atlas
@PQ
@retrieve-offers-with-existing-lw-keyword
@DBbootstrap=addressBootstrap
@runTimes=1
@DBbootstrapParams={"type":"GPON","suiteName":"productQualification"}

Feature: Retrieve Offers with exiting LivingWell


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

  Scenario: Create SC with LivingWell offer
    Given preconditions by user are selected
    And test user select offers:
      | OfferId             |
      | 9161482788965984291 |
        # LivingWell Home
    And test user set the chars for item:
      | Name                | Value               | Item                |
      | 9156198150013903799 | 9156198150013903801 | 9161482788965984291 |
        # Delivery method = Self install for Livingwell
      | 9157589563813025526 | Merlin              | 9161482788965984291 |
        # End User First Name
      | 9157607665813042503 | Automation          | 9161482788965984291 |
      # End User Last Name
    When test user try to create Shopping Cart
    Then test validate shopping cart is created successfully
    And test user validate cart item parameters should contain:
      | ParameterName |
      | name          |
    And test user validate cart at least one item should contain price
    And test user validate shopping cart should contain top offers:
      | OfferId             |
      | 9161482788965984291 |

  Scenario: Qualified product offering list with shopping cart
    Given preconditions by user are selected
    And user filter by the following product offering id: 9161482788965984291
                                                          # LW
    When user try to get qualified product offering list with shopping cart
    Then list of the following product offerings should be available:
      | OfferId |
      | any     |
    And validate product offering parameters should contain:
      | ParameterName |
      | name          |
     # | description   |

  Scenario: Validate shopping cart
    Given preconditions by user are selected
    When test user try to validate shopping cart
    Then test no error messages should be in shopping cart

  Scenario: Submit SC
    Given preconditions by user are selected
    When test test user try to submit shopping cart
    Then test test sales order id should be returned

  Scenario: Check backend orders validation
    Given preconditions by user are selected
    When try to complete sales order on BE
    Then validate that no errors created on BE
    And validate that all orders are completed successfully
    And validate that all billing actions completed successfully
