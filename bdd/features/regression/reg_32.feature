@api
@regression
@reg_32-keyword

Feature: RDB checking

	Scenario: check RDB
		And check the RDB_SALES_ORDERS table
		And check that ATTR_TYPE_ID is text