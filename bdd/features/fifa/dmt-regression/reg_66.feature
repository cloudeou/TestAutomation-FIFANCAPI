@-
@regression
@reg_66-keyword
# @DBbootstrap=addressBootstrap
# @runTimes=1
# @DBbootstrapParams={"type":"LTE"}
Feature: Provide HomePro

  Scenario: Check address
    Given user has address with type LTE
    When get address based on entered data: '5465574'
    Then address id should be returned

  Scenario: Check service qualification for an address
    Given preconditions by user are selected
    When user check availability
    Then address should be qualified for LTE

  Scenario: Check product offerings under the Value added services category
    Given preconditions by user are selected
    And distribution channel is CSR
    And customer category is RESIDENTIAL
    And user filter by the following categories:
        | CategoryId          |
        | 9157723471513163131 |
        # Value added services(VAS)
    When user try to get qualified product offering list
    And validate at least one product offering has categories:
		| CategoryId          |
		| 9163651149692824465 |
		# HomePro
            
  Scenario: Create customer
    Given preconditions by user are selected
    # And create real email address for API
    When user try to create customer
    Then external customer id should be returned
    And billing account number is returned
    And credit check is performed

  Scenario: Create shopping cart to order top offer
    Given preconditions by user are selected
    And test user select offers:
        | OfferId             |
        | 9163686059545645182 |
        # HomePro
    When test user try to create Shopping Cart
    Then test validate shopping cart is created successfully
    And test user validate shopping cart should contain top offers:
        | OfferId             |
        | 9163686059545645182 |
        #HomePro
    And user validate shopping cart promotion price in $ for top offers should be: 
        | OfferId             | Price |
        | 9163686059545645182 |  30   |
        # HomePro

  Scenario: Validate shopping cart(1)
    Given preconditions by user are selected
    When test user try to validate shopping cart
    Then test no error messages should be in shopping cart

  Scenario: Submit Shopping Cart
    Given preconditions by user are selected
    When test user try to submit shopping cart
    Then test sales order id should be returned

  Scenario: Check backend orders validation
    Given preconditions by user are selected
    When try to complete sales order on BE
    Then validate that no errors created on BE
    And validate that all orders are completed successfully
    And check absent work order
    And validate that all billing actions completed successfully
    # And check that the letters was received:
    #   | subject                                     | body                    |
    #   | Your TELUS Home Services order is confirmed | Thank=>TELUS=>confirmed |

# #todo: check letters
