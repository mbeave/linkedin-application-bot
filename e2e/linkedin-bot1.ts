import { test } from '@playwright/test';
const fs = require('fs/promises');

const configFile = await fs.readFile('config.json', 'utf-8');
const config = JSON.parse(configFile);
const filePath = config.csvFilePath;
const d = new Date();
const date = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;

test('linkedin app bot', async ({ page }) => {
  let totalJobsApplied = 0;
  const searchTermArray = config.searchTerms;

  const getRemoteQueryParam = () => (config.remote ? '&f_WT=2&geoId=103644278' : '&geoId=103644278');

  const buildUrl = (searchTerm) => {
    const easyApply = '?f_AL=true';
    const location = config.location;
    const remoteQueryParam = getRemoteQueryParam();
    return `https://www.linkedin.com/jobs/search/${easyApply}${remoteQueryParam}&keywords=${searchTerm}&location=${location}`;
  };

  const scrollToBottom = async () => {
    await page.hover('.jobs-search-results-list');
    for (let i = 0; i < 7; i++) {
      await page.mouse.wheel(0, 400);
    }
  };

  const getPagesCount = async () => {
    const pages = await page.locator('ul.artdeco-pagination__pages .artdeco-pagination__indicator').last().innerText();
    console.log(`There are ${pages} pages of jobs to apply to.`);
    return parseInt(pages);
  };

  const applyToJob = async (jobTitle, companyTitle) => {
    try {
        await page.hover('.jobs-search-results-list');
        await page.mouse.wheel(0, 200);
        await page.locator('.job-card-list__title').nth(i).click();
        if (await page.isVisible('span.artdeco-button__text:has-text("Easy Apply")')) {
          jobTitle = await page.locator('.job-details-jobs-unified-top-card__job-title-link').first().innerText({timeout: 5000});
          companyTitle = await page.locator('.job-details-jobs-unified-top-card__primary-description-without-tagline').first().innerText({timeout: 5000});
          const match = companyTitle.match(companyTitleRegex);
          if (match != null) companyTitle = match[1];
          await page.locator('span:has-text("Easy Apply")').first().click();
        }
        else {
          console.log("Already applied...");
          continue;
        }
            
        page.waitForTimeout(8000);
        if (await page.isVisible('span.artdeco-button__text:has-text("Submit")')) {
          //await page.locator('span:has-text("Choose")').first().click();
          await page.locator('label:has-text("Follow")').click({ timeout: 5000 });
          await page.locator('text=Submit Application').click();
          console.log("Job applied!");
          await jobsApplied++;
          await page.locator('.artdeco-button__icon').first().click();
          csvWriteLine(date, location, searchTerm, jobTitle, companyTitle, filePath);
          continue;
        }
            
        await page.locator('span:has-text("Next")').first().click();
        let progressValue = await page.locator("progress").first().getAttribute("Value")

        if (progressValue == "50") {  
          try {
            //await page.locator('span:has-text("Choose")').first().click();
            await page.locator('span:has-text("Review")').first().first().click();
            await page.locator('label:has-text("Follow")').click({ timeout: 5000 });
            await page.locator('text=Submit Application').click();
            console.log("Job applied!");
            await jobsApplied++;
            await page.locator('.artdeco-button__icon').first().click();
            csvWriteLine(date, location, searchTerm, jobTitle, companyTitle, filePath);
          } catch (e) {
            await page.locator('.artdeco-button__icon').first().click();
            await page.locator('span:has-text("Discard")').click();
            console.log("Can't apply");
            continue;
          }
        }
        else if (progressValue == "33") {
          try {
            //await page.locator('span:has-text("Choose")').first().click();
            await page.locator('span:has-text("Next")').first().click();
            await page.locator('span:has-text("Review")').first().first().click();
            if (await page.isVisible('span.artdeco-inline-feedback__message')) {
              let jobID = await page.locator('xpath=//div[@data-job-id]').nth(i).getAttribute('data-job-id');
              let href = "https://www.linkedin.com/jobs/view/" + jobID;
              console.log("Couldn't apply to job! Apply here: " + href);
              await page.locator('.artdeco-button__icon').first().click();
              await page.locator('span:has-text("Discard")').click();
              continue;
            }
            await page.locator('label:has-text("Follow")').click({ timeout: 5000 });
            await page.locator('text=Submit Application').click();
            console.log("Job applied!");
            await jobsApplied++;
            await page.locator('.artdeco-button__icon').first().click();
            csvWriteLine(date, location, searchTerm, jobTitle, companyTitle, filePath);
          } catch (e) {
            await page.locator('.artdeco-button__icon').first().click();
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
              await page.locator('.artdeco-button__icon').first().click();
              await page.locator('span:has-text("Discard")').click();
              continue;
            }
            await page.locator('span:has-text("Next")').first().click();
            if (await page.isVisible('span.artdeco-inline-feedback__message')) {
              let jobID = await page.locator('xpath=//div[@data-job-id]').nth(i).getAttribute('data-job-id');
              let href = "https://www.linkedin.com/jobs/view/" + jobID;
              console.log("Couldn't apply to job! Apply here: " + href);
              await page.locator('.artdeco-button__icon').first().click();
              await page.locator('span:has-text("Discard")').click();
              continue;
            }
            await page.locator('span:has-text("Review")').first().click();
            await page.locator('label:has-text("Follow")').click({ timeout: 5000 });
            await page.locator('text=Submit Application').click();
            console.log("Job applied!");
            await jobsApplied++;
            await page.locator('.artdeco-button__icon').first().click();
            csvWriteLine(date, location, searchTerm, jobTitle, companyTitle, filePath);
          } catch (e) {
            await page.locator('.artdeco-button__icon').first().click();
            await page.locator('span:has-text("Discard")').click();
            console.log("Can't apply");
            continue;
          }
        }
        else {
          let jobID = await page.locator('xpath=//div[@data-job-id]').nth(i).getAttribute('data-job-id');
          let href = "https://www.linkedin.com/jobs/view/" + jobID;
          await page.locator('.artdeco-button__icon').first().click();
          console.log("5 pages or more. Moving on... Apply here if you would like: " + href);
          await page.locator('span:has-text("Discard")').click();
          continue;
        }
      } catch (e) {
        await page.locator('.artdeco-button__icon').first().click();
        console.log("Failed to apply to job");
        continue;
      }
    await csvWriteLine(date, config.location, searchTerm, jobTitle, companyTitle, filePath);
    totalJobsApplied++;
  };

  const navigateToPage = async (url) => {
    await page.goto(url);
    await scrollToBottom();
  };

  const processJobsOnPage = async () => {
    // Your implementation for processing jobs on a page
    // ...
  };

  for (const searchTerm of searchTermArray) {
    const url = buildUrl(searchTerm);
    await navigateToPage(url);
    const pagesCount = await getPagesCount();

    for (let pageIndex = 0; pageIndex < pagesCount; pageIndex++) {
      if (totalJobsApplied > 25) {
        console.log(`You applied to ${totalJobsApplied} ${searchTerm} jobs!`);
        break;
      }

      if (pageIndex !== 0) {
        const jobPage = jobsPerPage * pageIndex;
        console.log(`You've applied to ${totalJobsApplied} jobs!`);
        console.log('Moving to next page...');
        await navigateToPage(`${url}&start=${jobPage}`);
      }

      await processJobsOnPage();
    }
  }

  console.log(`You applied to ${totalJobsApplied} jobs! Congrats!`);
  await page.waitForTimeout(100000);
  await page.close();
});

async function csvWriteLine(date, location, searchTerm, jobTitle, companyTitle, filePath) {
  const loc = location.split('%20').join(' ');
  const search = searchTerm.split('%20').join(' ');
  const jobData = [date, loc, search, jobTitle, companyTitle];
  const jobCSV = jobData.join(',') + '\n';

  try {
    await fs.appendFile(filePath, jobCSV);
    console.log('Job data saved.');
  } catch (err) {
    console.error('Error writing CSV file:', err);
  }
}
