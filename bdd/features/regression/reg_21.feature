@regression
@Api
@reg_21-keyword
Feature: Provide STORK Email for QC customer
#todo need to add french language
  Scenario: Check address
    Given user has address with type LTE
    When get address based on entered data
    Then address id should be returned

  Scenario: Check service qualification for an address
    Given preconditions by user are selected
    When user check availability
    Then address should be qualified for LTE

  Scenario: Create a customer
    Given preconditions by user are selected
    And create real email address for API
    When user try to create customer
    Then external customer id should be returned
    And billing account number is returned
    And credit check is performed

  Scenario: Check create shopping cart
    Given preconditions by user are selected
    And user select offers:
      | OfferId             |
      | 9156969857113555176 |
		# Email
    When user try to create Shopping Cart
    Then validate shopping cart is created successfully

  Scenario: Check update shopping cart Api
    Given preconditions by user are selected
    And user set the chars for item:
      | Name                | Value                            | Item                |
      | 9157151853413959580 | resourceid                       | 9156969931213555193 |
			#resourceid
      | 9157929072513393732 | randomEmail                      | 9156969931213555193 |
			#email
      | 9157151829213959578 | bd2103035a8021942390a78a431ba0c4 | 9156969931213555193 |
			#password use md5 hashed key
      | 9157152836513959990 | jest                             | 9156969931213555193 |
			#firstName
      | 9157152846813960092 | lastnaem                         | 9156969931213555193 |
			#Lastname
      | 9157178661213982944 | username                         | 9156969931213555193 |
		#username
    When user try to update Shopping Cart

  Scenario: Check update shopping cart Api with multiple child and chars
    Given preconditions by user are selected
    And user select child offer:
      | OfferId             | Parent              |
      | 9156969931213555193 | 9156969857113555176 |
			# Mailbox 1
      | 9156969931213555193 | 9156969857113555176 |
		# Mailbox 2
      | 9156969931213555193 | 9156969857113555176 |
		# Mailbox 3
      | 9156969931213555193 | 9156969857113555176 |
		# Mailbox 4
      | 9156969931213555193 | 9156969857113555176 |
		# Mailbox 5
      | 9156969931213555193 | 9156969857113555176 |
		# Mailbox 6
      | 9156969931213555193 | 9156969857113555176 |
		# Mailbox 7
      | 9156969931213555193 | 9156969857113555176 |
		# Mailbox 8
      | 9156969931213555193 | 9156969857113555176 |
		# Mailbox 9
      | 9156969931213555193 | 9156969857113555176 |
		# Mailbox 10
      | 9156969931213555193 | 9156969857113555176 |
		# Mailbox 11
    And user set the chars for item:
      | Name                | Value                            | Item                | ItemNumber |
      | 9157151853413959580 | resourceid                       | 9156969931213555193 | 1          |
			#resourceid
      | 9157929072513393732 | randomEmail                      | 9156969931213555193 | 1          |
			#email
      | 9157151829213959578 | bd2103035a8021942390a78a431ba0c4 | 9156969931213555193 | 1          |
			#password use md5 hashed key
      | 9157152836513959990 | jest                             | 9156969931213555193 | 1          |
			#firstName
      | 9157152846813960092 | lastnaem                         | 9156969931213555193 | 1          |
			#Lastname
      | 9157178661213982944 | username                         | 9156969931213555193 | 1          |
			#username
      | 9157151853413959580 | resourceid                       | 9156969931213555193 | 2          |
			#resourceid
      | 9157929072513393732 | randomEmail                      | 9156969931213555193 | 2          |
			#email
      | 9157151829213959578 | bd2103035a8021942390a78a431ba0c4 | 9156969931213555193 | 2          |
			#password use md5 hashed key
      | 9157152836513959990 | jest                             | 9156969931213555193 | 2          |
			#firstName
      | 9157152846813960092 | lastnaem                         | 9156969931213555193 | 2          |
			#Lastname
      | 9157178661213982944 | username                         | 9156969931213555193 | 2          |
		#username
      | 9157151853413959580 | resourceid                       | 9156969931213555193 | 3          |
			#resourceid
      | 9157929072513393732 | randomEmail                      | 9156969931213555193 | 3          |
			#email
      | 9157151829213959578 | bd2103035a8021942390a78a431ba0c4 | 9156969931213555193 | 3          |
			#password use md5 hashed key
      | 9157152836513959990 | jest                             | 9156969931213555193 | 3          |
			#firstName
      | 9157152846813960092 | lastnaem                         | 9156969931213555193 | 3          |
			#Lastname
      | 9157178661213982944 | username                         | 9156969931213555193 | 3          |
		#username
      | 9157151853413959580 | resourceid                       | 9156969931213555193 | 4          |
			#resourceid
      | 9157929072513393732 | randomEmail                      | 9156969931213555193 | 4          |
			#email
      | 9157151829213959578 | bd2103035a8021942390a78a431ba0c4 | 9156969931213555193 | 4          |
			#password use md5 hashed key
      | 9157152836513959990 | jest                             | 9156969931213555193 | 4          |
			#firstName
      | 9157152846813960092 | lastnaem                         | 9156969931213555193 | 4          |
			#Lastname
      | 9157178661213982944 | username                         | 9156969931213555193 | 4          |
		#username
      | 9157151853413959580 | resourceid                       | 9156969931213555193 | 5          |
			#resourceid
      | 9157929072513393732 | randomEmail                      | 9156969931213555193 | 5          |
			#email
      | 9157151829213959578 | bd2103035a8021942390a78a431ba0c4 | 9156969931213555193 | 5          |
			#password use md5 hashed key
      | 9157152836513959990 | jest                             | 9156969931213555193 | 5          |
			#firstName
      | 9157152846813960092 | lastnaem                         | 9156969931213555193 | 5          |
			#Lastname
      | 9157178661213982944 | username                         | 9156969931213555193 | 5          |
		#username
      | 9157151853413959580 | resourceid                       | 9156969931213555193 | 6          |
			#resourceid
      | 9157929072513393732 | randomEmail                      | 9156969931213555193 | 6          |
			#email
      | 9157151829213959578 | bd2103035a8021942390a78a431ba0c4 | 9156969931213555193 | 6          |
			#password use md5 hashed key
      | 9157152836513959990 | jest                             | 9156969931213555193 | 6          |
			#firstName
      | 9157152846813960092 | lastnaem                         | 9156969931213555193 | 6          |
			#Lastname
      | 9157178661213982944 | username                         | 9156969931213555193 | 6          |
		#username
      | 9157151853413959580 | resourceid                       | 9156969931213555193 | 7          |
			#resourceid
      | 9157929072513393732 | randomEmail                      | 9156969931213555193 | 7          |
			#email
      | 9157151829213959578 | bd2103035a8021942390a78a431ba0c4 | 9156969931213555193 | 7          |
			#password use md5 hashed key
      | 9157152836513959990 | jest                             | 9156969931213555193 | 7          |
			#firstName
      | 9157152846813960092 | lastnaem                         | 9156969931213555193 | 7          |
			#Lastname
      | 9157178661213982944 | username                         | 9156969931213555193 | 7          |
		#username
      | 9157151853413959580 | resourceid                       | 9156969931213555193 | 8          |
			#resourceid
      | 9157929072513393732 | randomEmail                      | 9156969931213555193 | 8          |
			#email
      | 9157151829213959578 | bd2103035a8021942390a78a431ba0c4 | 9156969931213555193 | 8          |
			#password use md5 hashed key
      | 9157152836513959990 | jest                             | 9156969931213555193 | 8          |
			#firstName
      | 9157152846813960092 | lastnaem                         | 9156969931213555193 | 8          |
			#Lastname
      | 9157178661213982944 | username                         | 9156969931213555193 | 8          |
		#username
      | 9157151853413959580 | resourceid                       | 9156969931213555193 | 9          |
			#resourceid
      | 9157929072513393732 | randomEmail                      | 9156969931213555193 | 9          |
			#email
      | 9157151829213959578 | bd2103035a8021942390a78a431ba0c4 | 9156969931213555193 | 9          |
			#password use md5 hashed key
      | 9157152836513959990 | jest                             | 9156969931213555193 | 9          |
			#firstName
      | 9157152846813960092 | lastnaem                         | 9156969931213555193 | 9          |
			#Lastname
      | 9157178661213982944 | username                         | 9156969931213555193 | 9          |
		#username
      | 9157151853413959580 | resourceid                       | 9156969931213555193 | 10         |
			#resourceid
      | 9157929072513393732 | randomEmail                      | 9156969931213555193 | 10         |
			#email
      | 9157151829213959578 | bd2103035a8021942390a78a431ba0c4 | 9156969931213555193 | 10         |
			#password use md5 hashed key
      | 9157152836513959990 | jest                             | 9156969931213555193 | 10         |
			#firstName
      | 9157152846813960092 | lastnaem                         | 9156969931213555193 | 10         |
			#Lastname
      | 9157178661213982944 | username                         | 9156969931213555193 | 10         |
		#username
      | 9157151853413959580 | resourceid                       | 9156969931213555193 | 11         |
			#resourceid
      | 9157929072513393732 | randomEmail                      | 9156969931213555193 | 11         |
			#email
      | 9157151829213959578 | bd2103035a8021942390a78a431ba0c4 | 9156969931213555193 | 11         |
			#password use md5 hashed key
      | 9157152836513959990 | jest                             | 9156969931213555193 | 11         |
			#firstName
      | 9157152846813960092 | lastnaem                         | 9156969931213555193 | 11         |
			#Lastname
      | 9157178661213982944 | username                         | 9156969931213555193 | 11         |
		#username
    When user try to update Shopping Cart
    Then validate shopping cart is created successfully

  Scenario: Check Validate shopping cart
    Given preconditions by user are selected
    When user try to validate shopping cart
    Then no error messages should be in shopping cart

  Scenario: Check Submit Shopping Cart Api
    Given preconditions by user are selected
    When user try to submit shopping cart
    Then sales order id should be returned

  Scenario: Check Product Inventory
    Given preconditions by user are selected
    And user set the limit = 1
    When user try to get product instances
    Then the list of following product instances shall be available:
      | OfferId |
      | Email   |
    And status of the products shall be the following:
      | product offering id | status              |
      | 9156969857113555176 | 4063055154013004346 |
	# Email - entering

  Scenario: Check backend orders validation
    Given preconditions by user are selected
    When try to complete sales order on BE
    Then validate that no errors created on BE
    And validate that all orders are completed successfully
    And validate that all billing actions completed successfully
  #todo need to add french language
#    And check that the letters was received:
#      | subject                             | body                     |
#      | Please complete your online profile | Please=>finish=>creating |
