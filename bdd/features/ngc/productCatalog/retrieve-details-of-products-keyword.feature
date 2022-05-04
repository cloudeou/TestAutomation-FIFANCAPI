@ngc
@api
@PC
@retrieve-details-of-products-keyword
Feature: Retrieve product offering details of a list of Product offers

  Scenario: Retrieve product offering details of a list of Product offers
    And user set list of offers:
      | OfferId             |
      | 9138044575813494882 |
      | 9152406687013913547 |
      | 9147904372813829170 |
      | 9152439227513457746 |
      | 9150918475013936444 |
    When user try to retrieve offer details
    Then list of offer details should be returned
#    And user validate offers attributes:
#      | attributeName |
#      | name          |
#      | category      |
#    And user validate attachment attributes:
#      | attributeName               |
#      | offeringDetailedDescription |
#      | offeringName                |
