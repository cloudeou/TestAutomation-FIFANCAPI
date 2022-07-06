@regression
@Api
@reg_43-keyword
@DBbootstrap=addressBootstrap
@runTimes=1
@DBbootstrapParams={"type":"LTE"}

Feature: Provide Smart Automation Plus, check bundle, upgrade to Secure, upgrade TOS to Utimate

  Scenario: Check address
    Given user has address with type LTE
    When get address is: @lpdsid
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

  Scenario: Provide Smart Automation Plus
    Given preconditions by user are selected
    And test user select offers:
      | OfferId             |
      | 9162184618979604472 |
     # Smart Automation Plus
      | 9150400880613177266 |
		# Home Security Commitment on 36 month contract
    And test user set the chars for item:
      | Name                | Value               | Item                |
      | 9155793580913292047 | 9155793538813291983 | 9162184618979604472 |
			# Delivery method = Tech install
      | 9152694600113929802 | 9154132902813883872 | 9162184618979604472 |
			# Acquired From = No Security services
      | 9152552492613455557 | 9152552492613455566 | 9162184618979604472 |
		# Self-Install = No (BOE rule, cannot change, for validation only)
    When test user try to create Shopping Cart
    Then test validate shopping cart is created successfully
    And user validate shopping cart should contain top offers:
      | OfferId             |
      | 9157722345313159909 |
   # TELUS Online Security - Basic
    And user validate shopping cart should contain discount:
      | DiscountId          | OfferId             |
      | 9162190579538581825 | 9157722345313159909 |
   # TELUS Online Security Discount

  Scenario: Validate shopping cart (1)
    Given preconditions by user are selected
    When user try to validate shopping cart
    Then no error messages should be in shopping cart

  Scenario: Try to delete offer that can`t be removed
    Given preconditions by user are selected
    And user delete offers:
      | OfferId             |
      | 9157722345313159909 |
			# TELUS Online Security - Basic
    When test user try to update Shopping Cart
    Then validate that offers can not be removed

  Scenario: Change SHS offer to Control
    Given preconditions by user are selected
    Then user try to delete Shopping Cart context
    And test user select offers:
      | OfferId             |
      | 9162184182465524071 |
     # Control
      | 9150400880613177266 |
		# Home Security Commitment on 36 month contract
    And test user set the chars for item:
      | Name                | Value               | Item                |
      | 9155793580913292047 | 9155793538813291983 | 9162184182465524071 |
			# Delivery method = Tech install
      | 9152694600113929802 | 9154132902813883872 | 9162184182465524071 |
			# Acquired From = No Security services
      | 9152552492613455557 | 9152552492613455566 | 9162184182465524071 |
		# Self-Install = No (BOE rule, cannot change, for validation only)
    When test user try to create Shopping Cart
    Then test validate shopping cart is created successfully
    And user validate shopping cart should contain top offers:
      | OfferId             |
      | 9157722449013159935 |
   # TELUS Online Security - Standard
    And user validate shopping cart should contain discount:
      | DiscountId          | OfferId             |
      | 9162237029760639351 | 9157722449013159935 |
  #TELUS Online Security Standard Discount

  Scenario: Validate shopping cart (2)
    Given preconditions by user are selected
    When user try to validate shopping cart
    Then no error messages should be in shopping cart

  Scenario: Change SHS offer to Control (2)
    Given preconditions by user are selected
    Then user try to delete Shopping Cart context
    And test user select offers:
      | OfferId             |
      | 9162184618979604472 |
     # Smart Automation Plus
      | 9150400880613177266 |
		# Home Security Commitment on 36 month contract
    And test user set the chars for item:
      | Name                | Value               | Item                |
      | 9155793580913292047 | 9155793538813291983 | 9162184618979604472 |
			# Delivery method = Tech install
      | 9152694600113929802 | 9154132902813883872 | 9162184618979604472 |
			# Acquired From = No Security services
      | 9152552492613455557 | 9152552492613455566 | 9162184618979604472 |
		# Self-Install = No (BOE rule, cannot change, for validation only)
    When test user try to create Shopping Cart
    Then test validate shopping cart is created successfully
    And user validate shopping cart should contain top offers:
      | OfferId             |
      | 9157722345313159909 |
   # TELUS Online Security - Basic
    And user validate shopping cart should contain discount:
      | DiscountId          | OfferId             |
      | 9162190579538581825 | 9157722345313159909 |
   # TELUS Online Security Discount

  Scenario: Validate shopping cart (3)
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
    And validate that all billing actions completed successfully

  Scenario: Create shopping cart to amend order
    Given preconditions by user are selected
    When test user try to create Shopping Cart
    Then test validate shopping cart is created successfully

  Scenario: Update shopping cart and remove offers
    Given preconditions by user are selected
    And user delete offers:
      | OfferId             |
      | 9162184618979604472 |
		# Smart Automation Plus
      | 9157722345313159909 |
   # TELUS Online Security - Basic
    When test user try to update Shopping Cart
    Then test validate shopping cart is updated successfully

  Scenario: Submit Shopping Cart (2)
    Given preconditions by user are selected
    When user try to submit shopping cart
    Then sales order id should be returned

  Scenario: Check backend orders validation (2)
    Given preconditions by user are selected
    When try to complete sales order on BE
    Then validate that no errors created on BE
    And validate that all orders are completed successfully
    And validate that all billing actions completed successfully

  Scenario: Change SHS offer to Secure
    Given preconditions by user are selected
    Then user try to delete Shopping Cart context
    And test user select offers:
      | OfferId             |
      | 9162234688573639328 |
     # Secure
      | 9150400880613177266 |
		# Home Security Commitment on 36 month contract
    And test user set the chars for item:
      | Name                | Value               | Item                |
      | 9155793580913292047 | 9155793538813291983 | 9162234688573639328 |
			# Delivery method = Tech install
      | 9152694600113929802 | 9154132902813883872 | 9162234688573639328 |
			# Acquired From = No Security services
      | 9152552492613455557 | 9152552492613455566 | 9162234688573639328 |
		# Self-Install = No (BOE rule, cannot change, for validation only)
    When test user try to create Shopping Cart
    Then test validate shopping cart is created successfully
    And user validate shopping cart should contain top offers:
      | OfferId             |
      | 9157722449013159935 |
   # TELUS Online Security - Standard
    And user validate shopping cart should contain discount:
      | DiscountId          | OfferId             |
      | 9162237029760639351 | 9157722449013159935 |
  #TELUS Online Security Standard Discount

  Scenario: Validate shopping cart (4)
    Given preconditions by user are selected
    When user try to validate shopping cart
    Then no error messages should be in shopping cart

  Scenario: Submit Shopping Cart (3)
    Given preconditions by user are selected
    When user try to submit shopping cart
    Then sales order id should be returned

  Scenario: Check backend orders validation (3)
    Given preconditions by user are selected
    When try to complete sales order on BE
    Then validate that no errors created on BE
    And validate that all orders are completed successfully
    And validate that all billing actions completed successfully

  Scenario: Change TOS offer to Ultimate
    Given preconditions by user are selected
    Then user try to delete Shopping Cart context
    And test user select offers:
      | OfferId             |
      | 9157722462813159948 |
     # TELUS Online Security - Ultimate
    When test user try to create Shopping Cart
    Then test validate shopping cart is created successfully

  Scenario: Validate shopping cart (5)
    Given preconditions by user are selected
    When user try to validate shopping cart
    Then no error messages should be in shopping cart

  Scenario: Submit Shopping Cart (4)
    Given preconditions by user are selected
    When user try to submit shopping cart
    Then sales order id should be returned

  Scenario: Check backend orders validation (4)
    Given preconditions by user are selected
    When try to complete sales order on BE
    Then validate that no errors created on BE
    And validate that all orders are completed successfully
    And validate that all billing actions completed successfully