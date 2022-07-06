#SuiteNames
@regression
@Api
@reg_30-keyword
@DBbootstrap=addressBootstrap
@runTimes=1
@DBbootstrapParams={"type":"LTE"}
  #todo cancel return

Feature: Reverse Logistics: Provide Secure with self install, disconnect Secure, cancel Reverse Logistics order

  Scenario: Check address
    Given user has address with type LTE
    When get address is: @lpdsid
    Then address id should be returned


  Scenario: Check service qualification for an address
    Given preconditions by user are selected
    When user check availability
    Then address should be qualified for LTE

  Scenario: Check product offerings under the home security category
    Given preconditions by user are selected
    And distribution channel is PILOT1RT
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

  Scenario: Check create customer api
    Given preconditions by user are selected
    When user try to create customer
    Then external customer id should be returned
    And billing account number is returned
    And credit check is performed

  Scenario: Create shopping cart to order top offer
    Given preconditions by user are selected
    And test user select offers:
      | OfferId             |
      | 9162234688573639328 |
			# Secure
      | 9150400880613177266 |
		# Home Security Commitment on 36 month contract
    And test user set the chars for item:
      | Name                | Value               | Item                |
      | 9155793580913292047 | 9155793538813292020 | 9162234688573639328 |
			# Delivery method = Self Install
      | 9152694600113929802 | 9154132902813883884 | 9162234688573639328 |
			# Acquired From = Reliance
      | 9152552492613455557 | 9152552492613455566 | 9162234688573639328 |
		# Self-Install = No
    When test user try to create Shopping Cart
    Then test validate shopping cart is created successfully

  Scenario: Validate shopping cart (1)
    Given preconditions by user are selected
    When user try to validate shopping cart
    Then no error messages should be in shopping cart

  Scenario: Submit Shopping Cart (1)
    Given preconditions by user are selected
    When user try to submit shopping cart
    Then sales order id should be returned

  Scenario: Check backend orders validation (1)
    Given preconditions by user are selected
    When try to complete sales order on BE
    Then validate that no errors created on BE
    And validate that all orders are completed successfully


  Scenario: Create shopping cart to remove top offer
    Given preconditions by user are selected
    When test user try to create Shopping Cart
    Then test validate shopping cart is created successfully

  Scenario: Disconnect the service
    Given preconditions by user are selected
    And user delete offers:
      | OfferId             |
      | 9162234688573639328 |
    # SmartHome Security: Secure
    When test user try to update Shopping Cart
    Then test validate shopping cart is updated successfully

  Scenario: Add returner details
    Given preconditions by user are selected
    And test user select offers:
      | OfferId             |
      | 9154332738813526343 |
    #return
    And test user set the chars for item:
      | Name                | Value         | Item                |
      | 9154341731813531459 | T7A1T3        | 9154332738813526343 |
      #postalCode
      | 9154341632513531353 | AB            | 9154332738813526343 |
      #province
      | 9154341612113531351 | DraytonValley | 9154332738813526343 |
      #city
      | 9154341562313531349 | 48B           | 9154332738813526343 |
      #street name
      | 9154341521413531347 | 3712          | 9154332738813526343 |
      #street number
      | 9154341655813531355 | 3712 48B      | 9154332738813526343 |
      # addressLine1
      | 9154341324813531241 | TestName      | 9154332738813526343 |
      # first name
      | 9154341355213531243 | TestLastName  | 9154332738813526343 |
    # last name

    When test user try to update Shopping Cart
    Then test validate shopping cart is updated successfully

  Scenario: Validate shopping cart (2)
    Given preconditions by user are selected
    When user try to validate shopping cart
    Then no error messages should be in shopping cart

  Scenario: Submit Shopping Cart (2)
    Given preconditions by user are selected
    When user try to submit shopping cart
    Then sales order id should be returned

  Scenario: Check backend orders validation (2)
    Given preconditions by user are selected
    When try to complete sales order on BE
    Then validate that no errors created on BE
    And validate that all orders are completed successfully


#  Scenario: Create shopping cart to cancel
#    Given preconditions by user are selected
#    When test user try to create Shopping Cart
#    Then test validate shopping cart is created successfully
#
#
#    #todo need cancel return
#  Scenario: Disconnect the service return
#    Given preconditions by user are selected
#    And user delete offers:
#      | OfferId             |
#      | 9154332738813526343 |
#    #return
##    And test user set the chars for item:
##      | Name                | Value               | Item                |
##      | 9158669606313698918 | 9156711051513485514 | 9154332738813526343 |
#    When test user try to update Shopping Cart
#    Then test validate shopping cart is updated successfully
#
#  Scenario: Validate shopping cart (3)
#    Given preconditions by user are selected
#    When user try to validate shopping cart
#    Then no error messages should be in shopping cart
#
#  Scenario: Submit Shopping Cart (3)
#    Given preconditions by user are selected
#    When user try to submit shopping cart
#    Then sales order id should be returned
