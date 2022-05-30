@atlas
@SC
@newSC
Feature: New Customer ordering  Internet, SHS, Boost V2 (Add on Equipment), PikTV


  Scenario: Get address
    Given user has address with type FIBER
    And technology type is GPON
#    And distribution channel is F2F
    And distribution channel is CSR
    And customer category is RESIDENTIAL
    When get address based on entered data: '3238438'
    Then address id should be returned

  Scenario: Get service qualification
    Given preconditions by user are selected
    When user check availability
    Then address should be qualified for LTE

  Scenario: Create customer
    Given preconditions by user are selected
    When user try to create customer
    Then external customer id should be returned
    And billing account number is returned
    And credit check is performed

#  Scenario: Check product offerings under the home security category
#    Given preconditions by user are selected
#    And distribution channel is CSR
#    And customer category is RESIDENTIAL
#    And user filter by the following categories:
#      | CategoryId          |
#      | 9150392274313172161 |
#		# Home Security
#    When user try to get qualified product offering list
#    Then list of the following product offerings should be available:
#      | OfferId             |
#      | 9162184182465524071 |
#			# Control
#      | 9162184393413524077 |
#			# Control Plus Video
#      | 9150742537813803948 |
#			# Home Security
#      | 9150751738313808426 |
#			# Home Security ADC
#      | 9162234688573639328 |
#			# Secure
#      | 9162234603588639317 |
#			# Secure Plus Video
#      | 9155119344613072294 |
#			# Smart Automation
#      | 9155153987813123256 |
#			# Smart Automation Plus Video
#      | 9162184654783176533 |
#	# Smart Camera

  Scenario: Create shopping cart
    Given preconditions by user are selected
    And test user select offers:
      | OfferId             |
      | 9152406687013913547 |
      # TELUS Internet 750/750
      | 9160783963613938850 |
      # Save on Internet only for 24 months (Mass) (NC)
      | 9155153987813123256 |
      # Smart Automation Plus (Automation Hub)
      | 9150400880613177266 |
      # Home Security Commitment on 36 month
      | 9146775787813796264 |
		# The Basics + Pik 5
    And test user set the chars for item:
      | Name                | Value               | Item                |
      | 9152694600113929802 | 9154132902813883884 | 9155153987813123256 |
			# Acquired From = Reliance
    When test user try to create Shopping Cart
    Then test validate shopping cart is created successfully
    And user validate cart item parameters should contain:
      | ParameterName |
      | name          |
    And user validate cart at least one item should contain price
    And user validate shopping cart should contain top offers:
      | OfferId             |
      | 9152406687013913547 |
      | 9160783963613938850 |
      | 9155153987813123256 |
      | 9150400880613177266 |
      | 9146775787813796264 |

  Scenario: Update shopping cart and add child offers
    Given preconditions by user are selected
    And test user select offers:
      | OfferId             |
      | 9148870992313039465 |
      # TELUS Boost Wi-Fi Starter Pack
    When user try to update Shopping Cart
    Then validate shopping cart is updated successfully
#
  Scenario: Validate shopping cart
    Given preconditions by user are selected
    When user try to validate shopping cart
    Then no error messages should be in shopping cart

  Scenario: Submit Shopping Cart
    Given preconditions by user are selected
    When test user try to submit shopping cart
    Then test sales order id should be returned

  Scenario: Check backend orders validation
    Given preconditions by user are selected
    When try to complete sales order on BE
    Then validate that no errors created on BE
    And validate that all orders are completed successfully
	And validate that all billing actions completed successfully
