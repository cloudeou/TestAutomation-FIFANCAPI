@atlas
@api
@SC
@sc-type-12-keyword
@DBbootstrap=addressBootstrap
@runTimes=1
@DBbootstrapParams={"type":"GPON"}

Feature: Shopping cart 12 (Create SC with Channel Info, Product Offerings)

  #FIFA TC#12: use in SC 1
  Scenario: Get addess for FIFA TC#12
    Given user has address with type FIBER
    And technology type is GPON
    And distribution channel is F2F
    And customer category is RESIDENTIAL
    When get address is: @lpdsid '5753461'
    Then address id should be returned

  Scenario: Get service qualification for FIFA TC#12
    Given preconditions by user are selected
    When user check availability
    Then address should be qualified for GPON

  Scenario: Create customer for FIFA TC#12
    Given preconditions by user are selected
    When user try to create customer
    Then external customer id should be returned
    And billing account number is returned
    And credit check is performed

  Scenario: Check product offerings under the home security category
    Given preconditions by user are selected
    And distribution channel is PILOT3RT
    And customer category is RESIDENTIAL
    And user filter by the following categories:
      | CategoryId          |
      | 9150392274313172161 |
    # Home Security
    When user try to get qualified product offering list
    Then list of the following product offerings should be available:
      | OfferId             |
      | 9162184182465524071 |
      # Control
      | 9162184393413524077 |
      # Control Plus Video
      | 9150742537813803948 |
      # Home Security
      | 9150751738313808426 |
      # Home Security ADC
      | 9162234688573639328 |
      # Secure
      | 9162234603588639317 |
      # Secure Plus Video
      | 9155119344613072294 |
      # Smart Automation
      | 9155153987813123256 |
      # Smart Automation Plus Video
      | 9162184654783176533 |
  # Smart Camera


  Scenario: Provide Secure Plus Video with CP =5 years
    Given preconditions by user are selected
    And test user select offers:
      | OfferId             |
      | 9162234603588639317 |
      # Secure Plus Video
      | 9159389559513259218 |
    # Home Security Commitment for 60 months
    And test user set the chars for item:
      | Name                | Value               | Item                |
      | 9155793580913292047 | 9155793538813291983 | 9162234603588639317 |
      # Delivery method = Tech install
      | 9152694600113929802 | 9154132902813883866 | 9162234603588639317 |
      # Acquired From = Fluent
      | 9152552492613455557 | 9152552492613455566 | 9162234603588639317 |
    # Self-Install = No (BOE rule, cannot change, for validation only)
    When test user try to create Shopping Cart
    Then test validate shopping cart is created successfully
    And test user validate cart item parameters should contain:
      | ParameterName |
      | name          |
    And test user validate cart at least one item should contain price
    And test user validate shopping cart should contain top offers:
      | OfferId             |
      | 9162234603588639317 |
      | 9159389559513259218 |

  Scenario: +2 Accessories ( 1- Easy Pay,1- One Time)
    Given preconditions by user are selected
    And test user select child offer:
      | OfferId             | Parent              |
      | 9151670335513311270 | 9162234603588639317 |
      #Doorbell Camera - Round TELUS Easy Pay B2C
      | 9150454993513203663 | 9162234603588639317 |
    #Doorbell Camera - Round Purchase
    And test user set the chars for item:
      | Name                | Value               | Item                |
      | 9151550795513408112 | 9151550795513408113 | 9151670335513311270 |
      # | Purchase Type       | Easy Pay           | Doorbell Camera - Round TELUS Easy Pay B2C |
      | 9151550795513408112 | 9151619944313285435 | 9150454993513203663 |
    # | Purchase Type       | One Time            | Doorbell Camera - Round Purchase
    When test user try to update Shopping Cart
    Then test validate shopping cart is updated successfully


  Scenario: Validate shopping cart in FIFA TC#12
    Given preconditions by user are selected
    When test user try to validate shopping cart
    Then test no error messages should be in shopping cart

  Scenario: Submit Cart in FIFA TC#12
    Given preconditions by user are selected
    When test user try to submit shopping cart
    Then test sales order id should be returned

  Scenario: Check backend orders validation in FIFA TC#12
    Given preconditions by user are selected
    When try to complete sales order on BE
    Then validate that no errors created on BE
    And validate that all orders are completed successfully
    And validate that all billing actions completed successfully
