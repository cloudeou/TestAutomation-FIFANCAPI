@ngc
@PC
@retrieve-details-of-coupon-code-offers-keyword

Feature: Retrieve product offering details of a list of Commitment offers

  Scenario: Retrieve product offering details of a list of Commitment offers
    And user set list of offers:
      | OfferId             |
      | 9156377023113145660 |
      | 9151782494813699850 |
      | 9155352401613907466 |
    When user try to retrieve offer details
    Then list of offer details should be returned
    And user validate offers attributes:
      | attributeName |
      | name          |
      | category      |
    And user validate attachment attributes:
      | attributeName               |
      | offeringDetailedDescription |
      | offeringName                |
      | initiativeContext           |
      | conditions                  |
      | benefits                    |
