@atlas
@api
@SC
@existing-triple-no-change-keyword
Feature: Existing commitment in Regular Period Triple Play no change

  Scenario: Check address
    Given user has address with type FIBER
    Given user has address with type GPON
    And distribution channel is CSR
    And customer category is RESIDENTIAL
    When get address based on entered data: '3238438'
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

  Scenario: Create SC with HSIA(Internet) offrer, TV offer, SHS offer and commitment offer
    Given preconditions by user are selected
    And test user select offers:
      | OfferId             |
      | 9150893104313917439 |
      #TELUS Internet 15/15
      | 9142278346813160836 |
      # Essentials
      | 9162234688573639328 |
      # Secure
      | 9150400880613177266 |
      # Home Security Commitment on 36 month contract
      | 9160783963613938850 |
    #Save on Internet & SHS For 24 months
    And test user set the chars for item:
      | Name                | Value               | Item                |
      | 9158306682113553797 | 9158306751513553873 | 9142278346813160836 |
      # Delivery Method TV - Self Install
      | 9155793580913292047 | 9155793538813291983 | 9162234688573639328 |
      # Delivery method SHS = Pro install
      | 9152694600113929802 | 9154132902813883884 | 9162234688573639328 |
      # Acquired From = Reliance
      | 9152552492613455557 | 9152552492613455566 | 9162234688573639328 |
    # Self-Install = No
    When test user try to create Shopping Cart
    Then test validate shopping cart is created successfully
    And user validate cart item parameters should contain:
      | ParameterName |
      | name          |
    And user validate cart at least one item should contain price
    And user validate shopping cart should contain top offers:
      | OfferId             |
      | 9150893104313917439 |
      | 9142278346813160836 |
      | 9162234688573639328 |
      | 9160783963613938850 |

  Scenario: Update SC with SLO, add Add Ons offer, add Boost WiFi offer, add Equipment(TV, SHS) offers
    Given preconditions by user are selected
    And test user select offers:
      | OfferId             |
      | 9152405677313441444 |
      #Apple TV 4K 32GB
      | 9153586297713374444 |
    # $200 Netflix Gift Card
    And user select child offer:
      | OfferId             | Parent              |
      | 9150280421713159508 | 9150893104313917439 |
      #TELUS Boost Wi-Fi Starter Pack Easy Payment
      | 9144579890813692894 | 9142278346813160836 |
      # 4K PVR
      | 9154703630213381920 | 9162234688573639328 |
    #4 CR2 Battery
    When user try to update Shopping Cart
    Then validate shopping cart is updated successfully

  Scenario: Validate shopping cart 1
    Given preconditions by user are selected
    When user try to validate shopping cart
    Then no error messages should be in shopping cart

  Scenario: Submit SC 1
    Given preconditions by user are selected
    When test user try to submit shopping cart
    Then test sales order id should be returned

  Scenario: Check backend orders validation 1
    Given preconditions by user are selected
    When try to complete sales order on BE
    Then validate that no errors created on BE
    And validate that all orders are completed successfully
    And validate that all billing actions completed successfully

  Scenario: Create same SC
    Given preconditions by user are selected
    When test user try to create Shopping Cart
    Then test validate shopping cart is created successfully

  Scenario: Update SC, remove some Add Ons, remove Boost WiFi
    Given preconditions by user are selected
    And test user delete offers:
      | OfferId             |
      | 9152405677313441444 |
    #Apple TV 4K 32GB
    And user delete child offer:
      | OfferId             | Parent              |
      | 9150280421713159508 | 9150893104313917439 |
    #TELUS Boost Wi-Fi Starter Pack Easy Payment
    When user try to update Shopping Cart
    Then validate shopping cart is updated successfully

  Scenario: Submit SC 2
    Given preconditions by user are selected
    When test user try to submit shopping cart
    Then test sales order id should be returned

  Scenario: Validate shopping cart 2
    Given preconditions by user are selected
    When user try to validate shopping cart
    Then no error messages should be in shopping cart

  Scenario: Check backend orders validation 2
    Given preconditions by user are selected
    When try to complete sales order on BE
    Then validate that no errors created on BE
    And validate that all orders are completed successfully
    And validate that all billing actions completed successfully
