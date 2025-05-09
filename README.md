# Solution Breakdown

## Approach
After setting up Playwright with JavaScript (not TypeScript), I structured the tests and began populating them as I identified the locators, then added assertions. I created a `beforeAll` and `afterAll` to handle login and window closure, respectively.

I’ve included Given/When/Then BDD/Spec-by-example comments as an extra touch, since we aren't using any test management structure or referring to design docs.

Without going overboard and building a full Page Object Model with constants to make things cleaner and more robust, I’ve kept it simple. For the purposes of this test, I created just one helper function and used `beforeAll`, etc., as mentioned.

I always take an Agile approach: get things working first, then improve them as they grow—avoiding premature optimizations or refinements that might never be needed. I follow the principle of "fail fast" and believe in not letting perfect be the enemy of good. This isn’t how I’d leave a long-term framework, but this is a tech test, so it shouldn’t be seen as a final or elegant solution—just a solution to the questions asked.

I’ve chosen to execute these tests using Chrome, but most browsers can be used—or even a third-party browser farm service.

## The Tests
The tooltip assertion presented some challenges. I always find iFrames problematic, especially when you can’t address them directly from the DOM. The assertion is currently against a fixed point. Ideally, I’d implement more elaborate testing using known data and various points to make it more reflective and dynamic. This would ensure assertions are made against known, stable data that doesn’t "age" badly.

The PDF download test performs exactly as described (note: XLS file options aren’t covered and should be an additional test). It clicks the download button and generates a timestamped file to avoid collisions.

### A Complexity:
The download does not go to disk by default. I had to force that behavior in order to validate the file header—validating the name alone is inadequate since files can be named arbitrarily. I enabled downloads and defined a path in `playwright.config.js` (where the `baseURL` also lives). I also had to disable the PDF extension (which seems counterintuitive) to trigger the proper download behavior. By default, the report opens in a new tab for viewing, but with these options changed, I saw a download button at the end of the progress bar, which allowed me to assert the file’s existence in a lightweight way.

So, the test performs the actions and then checks that the file is called a `.pdf`. As I lightheartedly put in the comments, “PDF by name,” but then it uses `fs` to check the file header to confirm it’s an actual PDF—“PDF by nature”!

## Secrets
Secrets are stored securely in GitHub Secrets and are used to populate the `config.json` file during the test run. They are cleared afterward, returning the file to its default state (i.e., `"username": ""`, etc.).

## Mocking Solution
There is one mocked test to intercept an API call. This isn’t how I’d normally mock tests—in fact, I rarely mock or stub, since I’m not usually asked to write unit tests. This part relied heavily on Googling.

## Running Tests Locally
To run these tests locally:

1. Install Playwright (JavaScript) and clone the repo using `git clone`.
2. Manually amend the `config.json` file in the `config` directory with your credentials.
3. **Important:** Ensure `config.json` is in `.gitignore` so it’s not added to the repo.
4. Modify `headless: false` in `playwright.config.js` if you want to visually see the tests in Chrome (it defaults to `true` for GitHub runs).

### Run commands:
- `npx playwright test` // No mocked test  
- `RUN_MOCKS=true npx playwright test` // Includes mocked test (Mac/Linux)  
- `set RUN_MOCKS=true && npx playwright test` // Windows (not tested)  
- `RUN_MOCKS=true npx playwright test -g "Mock a dashboard"` // Run only mocked test  
- In GitHub: Click **Actions** > rerun last build

## Manual Testing Task – "Raise a Bug"
I ran out of time. While I didn’t find anything clearly broken (given there were no specs, design docs, or requirements), here’s how I would raise a bug:

- A description of the expected vs actual behavior, with references (Figma, requirements, etc.)
- Reproduction steps with technical notes (API endpoints, locators), screenshots, or a test report with rerun instructions.
- I might discuss it with a developer, designer, or platform team—depending on context.
- If needed, I’d involve the Scrum Master or Product Owner to align on priority or impact, possibly arranging a quick call to keep everyone in the loop.

## Comments on This Tech Test
This was one of the most comprehensive tech tests I’ve had to complete—and with more gotchas than any I’ve personally set (and I usually just want to assess problem-solving, code quality, and domain knowledge).

It took a fair amount of time, as the requirements essentially asked for a nascent Playwright test framework with CI/CD implemented.

That said, I really enjoyed it. I like Playwright, and while I haven’t written JavaScript in a couple of years, it’s a language I enjoy once I get back into it. I’ve used TypeScript for Playwright before, and I’m very comfortable with strongly typed languages like C, C++, and Python (which now encourages type annotations for added resilience).

**Thanks for the opportunity.**

**— Ed Davis, May 2025**
