# IntelliSense.io Takehome Test

### Overview
●	User Email: qateam-auto+guest@intellisense.io
●	Password: QateamIS@2025
●	Dashboard Link: QA Dashboard.
●	Case 1 to implement: On the above dashboard Graph Tooltip Scenario:
○	Hover over the power/energy graph.
○	Assert that the tooltip appears with a correct timestamp.
●	 Case 2 to implement: PDF Export Scenario:
○	Try the PDF export/download functionality.
●	Secure Test Data
○	Do not hardcode login credentials.
○	Store credentials (email, password) in a JSON file.
○	Read from the file inside tests.

🧪 Automation (Playwright + JavaScript)
1.	Set up Playwright project using Node.js and Playwright Test Runner
      ○	Basic setup for Playwright and dependencies, no complex configuration.
2.	Write 2 tests requirement mentioned above in the overview section for core dashboard functionality)
      ○	Write and validate two tests covering both scenarios for core functionality.
3.	Include mocking/stubbing for one test (e.g., mock an API response or alter the user state)
4.	4. Integrate the tests into a simple CI/CD pipeline (e.g., GitHub Actions).
         ○	Set up a basic pipeline for running the tests automatically on GitHub Actions.

🐞 Bug Reporting
1.	Report any issues observed (at least 1) in the UI or behavior
      ○	Identify and report a bug during testing


## Solution Breakdown

### Approach

Structure the project
- Add secrets JSON file
- Analyse question and write GWT tests:

GIVEN

WHEN

THEN

GIVEN

WHEN

THEN
- Analyse the dom and identify locators
- Fill in test logic and assertions
- Set up mocking for at least 1 test (object?)
- Set up a github actions pipeline to execute the tests

### Locators:
●

●

●

●

### Secrets:
These are in the config directory. As I am sending in a zipped up project rather than commiting to git I am including the directory
for ease of set up. I would usually use a secrets file which is included in the .gitignore file so it is not shared at all. I usually use .env files.
●	User Email: qateam-auto+guest@intellisense.io

●	Password: QateamIS@2025

●   Link/URL: https://qa-test.intellisense.io/next/dashboards/g/2082/QA

### Things to assert against
●

●

●

●

●

### Given/When/Then (TDD/BDD)
●

●

●

●

### Mocking solution:


MY NOTES:
time log: Put together project on Friday night 30min, solution structure 30min



