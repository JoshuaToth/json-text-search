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

### Adding extra files

If extra files want to be added to be searched, add the json file into the `content/` directory and add a record into the `files.json` file. No code change should be necessary.

## Using a hashmap to support O(1)

In essence the search relies on full text matching using a hash map. This forces the brunt of the processing time to be taken up during the initial starting of the application, ensuring all searches occur within exactly the same time-frame regardless of the amount of records present in the application. Performance testing was added to ensure this is the case.

## Pre-calc approach as opposed to an on-demand approach

I chose to go with a pre-calc approach where all of the files are processed at the begging of the program starting up. The trade off here is a small amount of processing time at the beginning with lightning fast search results during the runtime of the application.

If the program was to be launched for a limited set of searches across a subset of the files, an on-demand approach could be substituted instead, especially if there are many many files that wouldn't necessarily be used.

A third approach would be to load the file only when it's first targeted by a search and then cache the data, sort of a hybrid approach to both of these methods. Meaning the initial first search would be slower per file, but all subsequent searches would be much faster.

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
