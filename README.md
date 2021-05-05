# Json-Text-Search

Using the provided data (tickets.json and users.json and organization.json) write a simple command line application to search the data and return the results in a human readable format.

## Installation

### Prerequisites:

- NodeJS
- Yarn

### To install

- Clone the repository
- `yarn` to install dependencies

### Running

- `yarn start` to begin the application
- `yarn test` to run the unit tests
- `yarn test-watch` to run the unit tests in watch mode
- `yarn performance` to run the performance tests
- `yarn build` to build a production version of the application
- `yarn start-production` to run a production version of the application

## Using a hashmap to support O(1)

In essence the search relies on full text matching using a hash map. This forces the brunt of the processing time to be taken up during the initial starting of the application, ensuring all searches occur within exactly the same time-frame regardless of the amount of records present in the application. Performance testing was added to ensure this is the case.

## Performance testing

The search capabilities of the application are performance tested to ensure the exact same performance for all searches regardless of the size of the datasets. The performance compares results between sets of 10 and 50,000 records.

The performance tests are segregated from the regular unit tests in order to preserve the speed and low processing power of the unit tests themselves. It would be extremely detrimental to be running the performance tests every time you needed the unit tests to run.

## Integration tests / End-to-End tests

There are no integration tests included within this solution. End-to-End tests are also not included.

The strategy for adding integration tests for this solution would be to launch the node process within a test as a child process, then manipulate the stdin/stdout streams and validate the responses.

## Tech choices

- NodeJS
- Typescript
- Jest
