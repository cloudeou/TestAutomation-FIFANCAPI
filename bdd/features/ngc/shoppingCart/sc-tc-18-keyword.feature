@atlas
@SC
@sc-tc-18-keyword
Feature: Shopping cart 18 (Create SC with WHSIA, SHS and Equipment)


  Scenario: Check address
    Given user has address with type LTE
    #And EXTERNAL_ID of distribution channel is CPMS_CURRENTCHANNELOUTLETID_0000029199
    And distribution channel is PILOT6RT
    And customer category is RESIDENTIAL
    When get address based on entered data: '3238438'
    Then address id should be returned


  Scenario: Check service qualification for an address
    Given preconditions by user are selected
    When user check availability
    Then address should be qualified for LTE


  Scenario: Create customer
    Given preconditions by user are selected
    When user try to create customer
    Then external customer id should be returned
    And billing account number is returned
    And credit check is performed


  Scenario: Check product offerings under the home security category
    Given preconditions by user are selected
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
      | 9162234688573639328 |
      # Secure
      | 9162234603588639317 |
      # Secure Plus Video
      | 9162184654783176533 |
  # Smart Camera

  Scenario: Internet Rural 500 GB (2Yr) with Secure Plus Video (3 yr)
    Given preconditions by user are selected
    And test user select offers:
      | OfferId             |
      | 9159683640113535776 |
      #wHSIA Rural Internet - 500GB monthly data
      | 9159621605313507298 |
     # $5 off plus free Rental for 2 years.
      | 9162234603588639317 |
      # Secure Plus Video
      | 9150400880613177266 |
    # Home Security Commitment on 36 month contract
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
    And user validate cart item parameters should contain:
      | ParameterName |
      | name          |
    And user validate cart at least one item should contain price
    And user validate shopping cart should contain top offers:
      | OfferId             |
      | 9159683640113535776 |
      | 9159621605313507298 |
      | 9162234603588639317 |
      | 9150400880613177266 |

  Scenario: Select WHSIA: Smart Hub + SIM + Antenna, SHS: Doorbell Camera - Slimline
    Given preconditions by user are selected
    And user select child offer:
      | OfferId             | Parent              |
      | 9160503549513228792 | 9159683640113535776 |
      | 9160571371613319983 | 9159683640113535776 |
      | 9160574219513321464 | 9159683640113535776 |
      | 9151963809313418384 | 9162234603588639317 |
      # Doorbell Camera - Slimline
    When user try to update Shopping Cart
    Then validate shopping cart is updated successfully

  Scenario: Validate shopping cart
    Given preconditions by user are selected
    When user try to validate shopping cart
    Then no error messages should be in shopping cart

  Scenario: Submit Cart
    Given preconditions by user are selected
    When user try to submit shopping cart
    Then sales order id should be returned

  Scenario: Check backend orders validation
    Given preconditions by user are selected
    When try to complete sales order on BE
    Then validate that no errors created on BE
    And validate that all orders are completed successfully
    And validate that all billing actions completed successfully

