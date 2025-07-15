# Purpose

### tldr;

If you need a kickstart learning automation with Playwright using JavaScript with github actions. Look for values begining with a dollar sign such as:`$locator`. 

You'll need to populate the base URL and the credentials which you can do locally using ENV variables or add them to github secrets which is preferable as nothing is hard coded and thats what I've gone for in the working example I have created this sanitised/generic solution for. 

**NOTE:** Do not expect the code, 'Actions', or PR's with checks to work in its current state. This code is from a framework I built that wasn't used so I decided to make the work public in order to make it useful to 'someone'!

*Personally*, I'd use this as a guide or reference but build your own so you become familiar with what is going on. If you want to reuse my code, all I ask is an 'Author - Ed-Davis 2025' comment by codeblocks or in files (no need to tell me or ask, the universe will judge you, not me). Maybe then set yourself the task of improving on them and making them your own? I am not making this public for you **not** to use, so go for it if some other pressure suggests but again, attribution is just polite and your boss will be impressed you took the quickest route to a working solution :)

## Solution Breakdown

# Approach
After setting up Playwright with JavaScript (not TypeScript), I first structured the tests usiging comments with what the test should do and any notes.

Next, I add 'Given, When, Then' specification by example (BDD) structure descriptions and steps, as I feel this gives a simple but clear guide and starts you thinking about which actions are repeated and which aspects are what you are actually testing.

I then began populating them with actual code, and next identify the locators needed for the first test I am focussed on. Comment out any tests you aren't using to keep it simple. 

Next, I work out which are the most useful, reliable, representative etc. things to assert against are, and note them in the place you want to add them, and then add those assertions as actual code. 

Comfortable with the structure, I created a `beforeAll` and `afterAll` to handle login and window closure, respectively, and made helper functions that make it clear what is going on without things getting messy.

This is my fairly standard approach to getting something going from nothing as it work. Don't beleive that your average QA will remember this stuff; the reality is that you constantly refine the framework as your requirements evolve, you are regularly updating and adding tests, but quite honestly, after nearly 2 decades of experience, I still check the documentation thoroughly before building a new framework. 

Maybe this would be different if I had gone from project to project using the same tools to address the same needs, but quite gladly this is not the case, though I hope not.  If you want to use your favourite hammer all the time, you might not be asking the right questions, as very rarely do you find every job you encounter is a nail (I'll stop with the metaphors now, possibly). Tech-Stack choice and solution design based on the context is a more valuable skill than remembering the specific commands and steps. The broader skills will serve you for a whole career whereas memorising stuff might only get you to the next patch!  

These are quite obscure requirements but were for a tech test written by someone who didn't seem to understand testing but who wanted an off the shelf solution free of charge without employing anyone! Seriously, the CEO even admitted he had no hesitation in using whatever tactics were needed to get the job done with the existing numbers (and skillset) - citing AI or any other method that gets them what they wanted. Therein lies some of the oddities in this solution; the page used archaic locator styles and page structure. Much of the stuff which was to work around this barrier (all software deserves assurance, like it or not!). This is why it is written in Javascript (their dev questioned why JS was used rather that TS, but it was a requirement, and you know what QA types are like when they see one of those!).

I’ve chosen to execute these tests using Chrome, but most browsers can be used, or even, of course, a third-party browser farm service - implementing them is surprisingly east these days.

### A Complexity:
In this challeng, the download file to be tested does not go to disk by default. I had to force that behavior in order to validate the file header—validating the name alone is inadequate since files can be named arbitrarily. I enabled downloads and defined a path in `playwright.config.js` (where the `baseURL` also lives). I also had to disable the PDF extension (which seems counterintuitive) to trigger the proper download behavior. By default, the report opens in a new tab for viewing, but with these options changed, I saw a download button at the end of the progress bar, which allowed me to assert the file’s existence in a lightweight way.

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

## A Request! 
If you clone this and find it useful, please give me a shoutout. If you use it for learning and find a test site or whatever where you fill in the gaps and you can share then please do a pull request. We cam help others that way.

Peace, and may your test runs forever be informative if not neccessarily green.

**— Ed Davis, May 2025**
