@atlas
@SC
@newSC
@DBbootstrap=addressBootstrap
@runTimes=1
@DBbootstrapParams={"type":"LTE"}

Feature: New Customer ordering Internet, and SHS on a QC address


  Scenario: Get address
    Given user has address with type FIBER
    And technology type is GPON
    And distribution channel is F2F
    And customer category is RESIDENTIAL
    When get address is: @lpdsid '5753461'
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

  Scenario: Check product offerings under the home security category
    Given preconditions by user are selected
    And distribution channel is CSR
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
      | 9162184618979604472 |
            # Smart Automation Plus (Automation Hub)
      | 9161281841913481968 |
        # SHS migration offer (Test)
      | 9162234688573639328 |
			# Secure
      | 9162234603588639317 |
			# Secure Plus Video
      | 9162184654783176533 |
	# Smart Camera

  Scenario: Create shopping cart
    Given preconditions by user are selected
    And test user select offers:
      | OfferId             |
      | 9159714683413600757 |
      # TELUS Internet 300/300
      | 9162184618979604472 |
       # Smart Automation Plus (Automation Hub)
      | 9150400880613177266 |
      # Home Security Commitment on 36 month
    And test user set the chars for item:
      | Name                | Value               | Item                |
      | 9152694600113929802 | 9154132902813883884 | 9162184618979604472 |
			# Acquired From = Reliance
    When test user try to create Shopping Cart
    Then test validate shopping cart is created successfully
    And test user validate cart item parameters should contain:
      | ParameterName |
      | name          |
    And test user validate cart at least one item should contain price
    And test user validate shopping cart should contain top offers:
      | OfferId             |
     # | 9159714683413600757 |
      | 9162184618979604472 |
      | 9150400880613177266 |
   #   | 9160906808513649636 |
    # Boost Wi-Fi 6 Free Rental ( should be auto added but it is blocking rule )

  Scenario: Validate shopping cart
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
	And validate that all billing actions completed successfully
