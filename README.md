# Purpose

## tl;dr

If you're looking to kickstart your journey into automation with Playwright using JavaScript and GitHub Actions, this should help. Look for variables starting with a dollar sign, such as: `$locator`.

You’ll need to populate the base URL and credentials. Do this locally using environment variables or, preferably, via GitHub secrets — nothing is hardcoded, and that’s how this example is configured.

**NOTE:** Don’t expect the code, GitHub Actions, or PR checks to work in its current state. This is a sanitised and generic version of a working solution I built for a framework that wasn’t used. Rather than let it go to waste, I decided to make it public in case it's useful to someone.

*Personally*, I recommend using this as a reference. Build your own version so you understand how it works. If you reuse my code, all I ask is that you credit me with an `'Author - Ed Davis 2025'` comment next to the code blocks or files. No need to ask or tell me — the universe will judge you, not me. Attribution is just polite, and your boss will likely be impressed that you took the fastest route to a working solution :)

## Solution Breakdown

### Approach

After setting up Playwright with JavaScript (not TypeScript), I first structured the tests with comments describing what each test should do, along with any notes.

I used a 'Given, When, Then' (BDD-style) structure to make the tests easier to read and maintain. This also helps identify repeated actions versus what’s actually being tested.

I then populated the tests with real code, focusing on the necessary locators first. Comment out any unused tests to keep things clean and focused.

Once the structure was in place, I worked out the most useful and reliable assertions to make. These were added where needed to verify outcomes.

After that, I added a `beforeAll` and `afterAll` to handle login and window closure, and wrote helper functions to keep things tidy and readable.

This is my go-to approach when starting from scratch. Even with nearly two decades in QA, I still check the docs before building a new framework — because every situation is different. It’s rare that every job is a nail, so you shouldn't always reach for the same hammer. Choose your tools and approach based on context; that’s a skill worth cultivating.

This particular codebase stems from a tech test written by someone who clearly didn’t understand testing but wanted a free, off-the-shelf solution. The CEO even admitted they’d use any tactic necessary — including AI — to get the job done with the existing team and skillset. As a result, the locators and page structure were awkward, and the code reflects the workarounds I had to implement.

JavaScript was used instead of TypeScript because it was a stated requirement, despite some objections. If your own app is more “testable,” you can definitely implement slicker solutions. Use this as a guide, not gospel.

### A Complexity: File Downloads

In this challenge, the file to be tested didn’t go to disk by default. I had to force downloads in `playwright.config.js` and disable the PDF extension (oddly) to trigger the expected behavior. By default, the report opened in a new tab. With these changes, a download button appeared after the progress bar, which allowed me to check that the file was downloaded.

The test checks that the file is named as a `.pdf` — “PDF by name” — and then uses Node’s `fs` module to validate the file header — “PDF by nature.”

### Secrets

Secrets are stored securely in GitHub Secrets. During test runs, these populate the `config.json` file, which is cleared afterwards, resetting it to its default state (`"username": ""`, etc.).

### Mocking Solution

There’s one test that mocks an API call. This isn’t how I usually write tests — I rarely mock or stub unless asked to do unit testing. I leaned heavily on Google for this part.

### Running Tests Locally

1. Install Playwright (JavaScript) and clone the repo.
2. Manually update the `config.json` file in the `config` directory with your credentials.
3. **Important:** Ensure `config.json` is in `.gitignore` so it’s not added to version control.
4. To visually observe tests in Chrome, set `headless: false` in `playwright.config.js` (it defaults to `true` in GitHub Actions).

### Run Commands

- `npx playwright test` – Run tests (no mocking)  
- `RUN_MOCKS=true npx playwright test` – Includes mocked test (Mac/Linux)  
- `set RUN_MOCKS=true && npx playwright test` – Windows (not tested)  
- `RUN_MOCKS=true npx playwright test -g "Mock a dashboard"` – Run only the mocked test  
- In GitHub: Click **Actions** → Rerun last build

## A Request!

If you clone this and find it useful, please give me a shoutout. If you end up using it as a learning tool and can contribute improvements — e.g., with a test site or extended coverage — feel free to submit a pull request.

Peace — and may your test runs always be informative (if not always green).

**— Ed Davis, May 2025**
