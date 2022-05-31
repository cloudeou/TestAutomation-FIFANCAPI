@regression
@Api
@reg_42-keyword

Feature: Provide 5G wHSIA with P2P Gaming APN add-on

  Scenario: Check address
    Given user has address with type LTE
    When get address based on entered data
    Then address id should be returned


  Scenario: Check service qualification for an address
    Given preconditions by user are selected
    When user check availability
    Then address should be qualified for LTE

  Scenario: Check product offerings under the home security category
    Given preconditions by user are selected
    And distribution channel is PILOT6RT
    And customer category is RESIDENTIAL
    And user filter by the following categories:
      | CategoryId          |
      | 9159601829313498427 |
		# WHSIA
    When user try to get qualified product offering list
    Then list of the following product offerings should be available:
      | OfferId             |
      | 9159602850913498849 |
			# Smart Hub Rural Internet 25/10 - 100 GB Monthly Data
      | 9159683640113535776 |
			# Smart Hub Rural Internet 25/10 - 500 GB Monthly Data

  Scenario: Create customer
    Given preconditions by user are selected
    And create real email address for API
    When user try to create customer
    Then external customer id should be returned
    And billing account number is returned
    And credit check is performed

  Scenario: Create SC with wHSIA
    Given preconditions by user are selected
    And user select offers:
      | OfferId             |
      | 9161414124118156706 |
    # Smart Hub Rural Internet - 50Mbps (500GB)
      | 9159621605313507298 |
     # $5 off plus free Rental for 2 years.
    And user set the chars for item:
      | Name                | Value               | Item                |
      | 9157950816213373074 | 9157950816213373075 | 9161414124118156706 |
#      Delivery method - Self-Install
    When user try to create Shopping Cart
    Then validate shopping cart is created successfully
    And user validate cart item parameters should contain:
      | ParameterName |
      | name          |
    And user validate cart at least one item should contain price
    And user validate shopping cart should contain top offers:
      | OfferId             |
      | 9161414124118156706 |


  Scenario: Update SC, add child offer
    Given preconditions by user are selected
    And user select child offer:
      | OfferId             | Parent              |
      | 9162328806049982024 | 9161414124118156706 |
      # 5G Indoor Router
      | 9159698239513542765 | 9161414124118156706 |
    # Sim
      | 9161879593566731513 | 9161414124118156706 |
    # P2P Gaming APN
    When user try to update Shopping Cart
    Then validate shopping cart is updated successfully
    And user validate at least one cart item should contain price alteration

  Scenario: Update shopping cart and add shipping details in amend
    Given preconditions by user are selected
    And user set the chars for item:
      | Name                | Value  | Item                |
      | 9147912230013832655 | T7A1T3 | 9147904372813829170 |

      | 9148017499713860022 | AB | 9147904372813829170 |

      | 9148017331813859769 | DraytonValley | 9147904372813829170 |

      | 9147904820813829381 | Testing | 9147904372813829170 |

      | 9147983057213907287 | LastName | 9147904372813829170 |
    When user try to update Shopping Cart
    Then validate shopping cart is updated successfully

  Scenario: Validate shopping cart
    Given preconditions by user are selected
    When user try to validate shopping cart
    Then no error messages should be in shopping cart

  Scenario: Submit Shopping Cart
    Given preconditions by user are selected
    When user try to submit shopping cart
    Then sales order id should be returned

  Scenario: Check backend orders validation
    Given preconditions by user are selected
    When try to complete sales order on BE
    Then validate that no errors created on BE
    And validate that all orders are completed successfully
    And validate that all billing actions completed successfully
    And check that the letters was received:
      | subject							  | body                     |
      | Please complete your online profile | Please=>finish=>creating |
