# SuiteNames
@ngc
@PC
@reg_49-keyword
# Address Parameters
# @addressType=FIBER
# @addressPort=GPON
Feature: Try to add a MR STB to an active PikTV

  Scenario: Check address
    Given user has address with type FIBER
    And technology type is GPON
    When get address based on entered data: '5481938'
    Then address id should be returned
   
  Scenario: Check create a customer
    # Given preconditions by user are selected
    When user try to create customer
    Then external customer id should be returned
    And billing account number is returned
    And credit check is performed

    

  
