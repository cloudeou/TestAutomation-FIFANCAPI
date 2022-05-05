# SuiteNames
@atlas
@PQ
@retrieve-all-child-offers-per-prod-offering-wco-keyword
@addressType=LTE
Feature: Retrieve all child offers per selected product offering with commitment offerings

	Scenario: Check address
		Given user has address with type LTE
		And distribution channel is PILOT6RT
		And customer category is RESIDENTIAL
		When get address based on entered data: '5652062'
		Then address id should be returned

	Scenario: Check service qualification for an address
		Given preconditions by user are selected
		When user check availability
		Then address should be qualified for LTE

