import { Browser, Page, test } from '@playwright/test';
import { JobSearch } from './pageActions';
import fs from 'fs';

const email = process.env.EMAIL as string;
const password = process.env.PASSWORD as string;

const configFile = fs.readFileSync('config.json', 'utf-8');
const config = JSON.parse(configFile);

test('linkedin app bot', async ({ browser }) => {
  let page = await login(browser);
  
  var totalJobsApplied = 0;
  const searchTerms = Object.keys(config.searchTerms);

  for (let g = 0; g < searchTerms.length; g++) {
    let searchTerm = searchTerms[g]; 
    const jobsPerPage = 25;

    const jobSearch = new JobSearch(page);
    await jobSearch.searchJobWithFilters(searchTerm, config.location, config.remote);
    
    await jobSearch.scroll();
  
    let pages = await page.locator('ul.artdeco-pagination__pages .artdeco-pagination__indicator').last().innerText();
    console.log("There are " + pages.trim() + " pages of jobs to apply to.");
    console.log("Beginning applications...");
    var jobsApplied = 0;
    var maxJobsApplied = config.searchTerms[searchTerm];
    var jobsOnPage = 24;

    for (let h = 0; h < parseInt(pages); h++) {
      if (jobsApplied >= maxJobsApplied) {
        console.log("You applied to " + jobsApplied + " " + searchTerm + " jobs!");
        totalJobsApplied += jobsApplied;
        break;
      }
      if (h != 0) {
        let jobPage = jobsPerPage * h;
        console.log("You've applied to " + jobsApplied + " jobs!");
        console.log("Moving to next page...");
        await page.locator('ul.artdeco-pagination__pages > li').nth(h).click();
        //url = url + "&start=" + jobPage;
        //await page.goto(url);
        await jobSearch.scroll();
      }
      jobsOnPage = await page.locator('.job-card-list__title').count();
      console.log(jobsOnPage + " jobs on this page");
      for (let i = 0; i < jobsOnPage; i++) {
        if (jobsApplied >= maxJobsApplied) {
          break;
        }
        try {
          await page.hover('.jobs-search-results-list');
          page.waitForTimeout(randomDelay());
          await page.mouse.wheel(0, Math.floor(Math.random()*100+100));
          await page.locator('.job-card-list__title').nth(i).click();
          if (await page.isVisible('span.artdeco-button__text:has-text("Easy Apply")')) {
            // jobTitle = await page.locator('.job-details-jobs-unified-top-card__job-title-link').first().innerText({timeout: 5000});
            // companyTitle = await page.locator('.job-details-jobs-unified-top-card__primary-description-without-tagline').first().innerText({timeout: 5000});
            // const match = companyTitle.match(companyTitleRegex);
            // if (match != null) companyTitle = match[1];
            await page.locator('span.artdeco-button__text:has-text("Easy Apply")').first().click();
          }
          else {
            console.log("Already applied...");
            continue;
          }
              
          page.waitForTimeout(randomDelay());
          if (await page.isVisible('span.artdeco-button__text:has-text("Submit")')) {
            //await page.locator('span:has-text("Choose")').first().click();
            try {await page.locator('label:has-text("Follow")').click({ timeout: 5000 });} catch (e) {console.log("No follow button");}
            await page.locator('text=Submit Application').click({ timeout: 5000 });
            console.log("Job applied!");
            await jobsApplied++;
            await jobSearch.dismiss();
            // csvWriteLine(date, location, searchTerm, jobTitle, companyTitle, filePath);
            continue;
          }
              
          await page.locator('span:has-text("Next")').first().click();
          let progressValue = await page.locator("progress").first().getAttribute("Value")

          if (progressValue == "50") {  
            try {
              page.waitForTimeout(randomDelay());
              //await page.locator('span:has-text("Choose")').first().click();
              await page.locator('span:has-text("Review")').first().first().click();
              try {await page.locator('label:has-text("Follow")').click({ timeout: 5000 });} catch (e) {console.log("No follow button");}
              await page.locator('text=Submit Application').click({ timeout: 5000 });
              console.log("Job applied!");
              await jobsApplied++;
              await jobSearch.dismiss();
              // csvWriteLine(date, location, searchTerm, jobTitle, companyTitle, filePath);
            } catch (e) {
              await jobSearch.dismiss();
              await page.locator('span:has-text("Discard")').click();
              console.log("Can't apply");
              continue;
            }
          }
          else if (progressValue == "33") {
            try {
              page.waitForTimeout(randomDelay());
              //await page.locator('span:has-text("Choose")').first().click();
              await page.locator('span:has-text("Next")').first().click();
              await page.locator('span:has-text("Review")').first().first().click();
              if (await page.isVisible('span.artdeco-inline-feedback__message')) {
                let jobID = await page.locator('xpath=//div[@data-job-id]').nth(i).getAttribute('data-job-id');
                let href = "https://www.linkedin.com/jobs/view/" + jobID;
                console.log("Couldn't apply to job! Apply here: " + href);
                await jobSearch.dismiss();
                await page.locator('span:has-text("Discard")').click();
                continue;
              }
              try {await page.locator('label:has-text("Follow")').click({ timeout: 5000 });} catch (e) {console.log("No follow button");}
              await page.locator('text=Submit Application').click({ timeout: 5000 });
              console.log("Job applied!");
              await jobsApplied++;
              await jobSearch.dismiss();
              // csvWriteLine(date, location, searchTerm, jobTitle, companyTitle, filePath);
            } catch (e) {
              await jobSearch.dismiss();
              await page.locator('span:has-text("Discard")').click();
              console.log("Can't apply");
              continue;
            }
          }
          else if (progressValue == "25") {
            try {
              //await page.locator('span:has-text("Choose")').first().click({timeout: 5000});
              await page.locator('span:has-text("Next")').first().click();
              if (await page.isVisible('span.artdeco-inline-feedback__message')) {
                let jobID = await page.locator('xpath=//div[@data-job-id]').nth(i).getAttribute('data-job-id');
                let href = "https://www.linkedin.com/jobs/view/" + jobID;
                console.log("Couldn't apply to job! Apply here: " + href);
                await jobSearch.dismiss();
                await page.locator('span:has-text("Discard")').click();
                continue;
              }
              await page.locator('span:has-text("Next")').first().click();
              if (await page.isVisible('span.artdeco-inline-feedback__message')) {
                let jobID = await page.locator('xpath=//div[@data-job-id]').nth(i).getAttribute('data-job-id');
                let href = "https://www.linkedin.com/jobs/view/" + jobID;
                console.log("Couldn't apply to job! Apply here: " + href);
                await jobSearch.dismiss();
                await page.locator('span:has-text("Discard")').click();
                continue;
              }
              await page.locator('span:has-text("Review")').first().click();
              try {await page.locator('label:has-text("Follow")').click({ timeout: 5000 });} catch (e) {console.log("No follow button");}
              await page.locator('text=Submit Application').click({ timeout: 5000 });
              console.log("Job applied!");
              await jobsApplied++;
              await jobSearch.dismiss();
              // csvWriteLine(date, location, searchTerm, jobTitle, companyTitle, filePath);
            } catch (e) {
              await jobSearch.dismiss();
              await page.locator('span:has-text("Discard")').click();
              console.log("Can't apply");
              continue;
            }
          }
          else {
            let jobID = await page.locator('xpath=//div[@data-job-id]').nth(i).getAttribute('data-job-id');
            let href = "https://www.linkedin.com/jobs/view/" + jobID;
            await jobSearch.dismiss();
            console.log("5 pages or more. Moving on... Apply here if you would like: " + href);
            await page.locator('span:has-text("Discard")').click();
            continue;
          }
        } catch (e) {
          await jobSearch.dismiss();
          console.log("Failed to apply to job");
          continue;
        }
      }
    }
  }
  console.log("You applied to " + totalJobsApplied + " jobs! Congrats!");
  page.waitForTimeout(100000);
  page.close();
});


async function csvWriteLine(date: string, location: string, searchTerm: string, jobTitle: string, companyTitle: string, filePath: string) {
  let loc = location.split('%20').join(' ');
  let search = searchTerm.split('%20').join(' ');
  let jobData = [date, loc, search, jobTitle, companyTitle];
  const jobCSV = jobData.join(',') + '\n';
  fs.appendFile(filePath, jobCSV, err => {
    if (err) {
      console.error('Error writing CSV file:', err);
    } else {
      console.log('Job data saved.');
    }
  });
}

function randomDelay() {
  const delay = Math.floor(Math.random()*3000) + 5000;
  return delay;
}

async function unfollow(page) {
  try {await page.locator('label:has-text("Follow")').click({ timeout: 5000 });} catch (e) {console.log("No follow button");}

}

async function login(browser: Browser) {
  var fileExists;
  let page: any;

  if (fs.existsSync('./storageState.json')) {
    console.log('File exists');
    fileExists = true;
  } else {
    console.log('File does not exist');
    fileExists = false;
  }
  if (fileExists) {
    const context = await browser.newContext({ storageState: 'storageState.json' });
    page = await context.newPage();
    var url = "https://www.linkedin.com/";
    await page.goto(url);
  } else {
    page = await browser.newPage();
    var url = "https://www.linkedin.com/";
    await page.goto(url);
    try {await page.getByRole('button', { name: 'Sign in' }).first().click({ timeout: 5000 });} catch (e) {console.log("No new user sign in page.");}
    try {await page.getByRole('link', { name: 'Sign in', exact: true }).click({ timeout: 5000 })} catch (e) {console.log("No sign in button");}
    try {await page.getByLabel('Email or phone').pressSequentially(email, { timeout: 5000 });} catch (e) {console.log("Already has email");}
    await page.getByLabel('Password', { exact: true }).pressSequentially(password);
    await page.getByRole('button', { name: 'Sign in' }).first().click();
    await page.context().storageState({ path: 'storageState.json' });
  }

  return page;
}