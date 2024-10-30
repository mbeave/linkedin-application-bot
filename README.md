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

Next, you have two options: you can run the bot in headed mode with:

```
npx playwright test --headed
```

Which will run the test with the browser letting you visually see it running. Or, you can run it in debug mode:

```
npx playwright test --debug
```

Debug mode is recommended because it lets you not only see the bot running in the browser, but also gives you a visual of the code as it's running through the [Playwright Inspector](https://playwright.dev/docs/debug). It also lets you pause and step through the code as well.

Finally, after the bot has successfully logged in once, you can comment out this code `globalSetup: require.resolve('./global-setup'),` in the playwright.config.ts file. This will disable the global-setup.ts file so the bot doesn't log in each time. 

Now, whenever the bot is run it will go straight to your logged in LinkedIn profile and to your search url. If, after a week or so, you find yourself logged out of LinkedIn when you run the bot, just uncomment that line of code in the playwright config file and run it again so it can store your authentication info in storageState.json.

### Running the Bot with your Search Terms and Settings

In the file e2e/linkedin-bot.spec.ts (the main script) you will find four lines of code in the beginning:

```
  let searchTerm = "help%20desk"; 
  let easyApply = "?f_AL=true";
  let location = "United%20States"; 
  let remote = "&f_WT=2&geoId=103644278";
```

The two main variables to worry about are *searchTerm* and *location*. *searchTerm* is where you put what job you are interested in (replaces spaces with "%20") and *location* is where you put the location of the jobs you want to apply to. If you don't want remote jobs just delete it from the url variable:

```
var url = "https://www.linkedin.com/jobs/search/" + easyApply + remote + "&keywords=" + searchTerm + "&location=" + location;
```

Like so: 

```
var url = "https://www.linkedin.com/jobs/search/" + easyApply + "&keywords=" + searchTerm + "&location=" + location;
```