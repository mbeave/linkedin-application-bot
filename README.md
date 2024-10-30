# LinkedIn Application Bot

## About

This script allows one to automate applying on LinkedIn through the use of their "Easy Apply" functionality. It only applies to jobs with four pages or less to fill out. Any application that it fails to apply to, it'll give a link to the application in the terminal. LinkedIn saves your answers for future applications, so as you fill out more of the failed applications, the bot should work better as time goes on.

This bot was developed with the [Playwright](https://github.com/microsoft/playwright) automation framework.

You can find the documentation for Playwright [here](https://playwright.dev/docs/intro).

## How to Use

### Setup

Recommended editor is [VS Code](https://code.visualstudio.com/), but you can use whatever editor you would like. Just make sure you have ready access to the file structure and a terminal to run the application with.

After cloning the repo into a directory of your choice, first run:

``` 
npm install 
```

Then, create a .env file and copy and paste the contents of .env.tmp file into it. Replace "email" and "password" with your LinkedIn login information (leave out the quote marks though). 

I have no access to this info. This file is made so global-setup.ts (which will run the first time you run the bot) has your login info, but it's still private to your system.

The .env file you've created is listed in the .gitignore file and so won't ever be accidentally pushed to the GitHub repo with your info.

Next, you have three options: you can run the bot in headed mode with:

```
npx playwright test --headed
```

Which will run the test with the browser letting you visually see it running. Or, you can run it in debug mode:

```
npx playwright test --debug
```
Or, just regular:
```
npx playwright test
```
Which will run the bot in headless mode, which essentially means the bot will run the browser in the background and apply to jobs for you while you do other tasks.


### Running the Bot with your Search Terms and Settings

Next, create a config.json file and copy the contents of config.json.tmp file into it. The information you put into this file will determine your search terms, how many jobs to apply to for each search term, the location of the jobs you would like to apply to, and whether you want the jobs to be remote, hybrid or any.
