import { test } from '@playwright/test';
const fs = require('fs');

const configFile = fs.readFileSync('config.json', 'utf-8');
const config = JSON.parse(configFile);
const filePath = config.csvFilePath;
const d = new Date();
const date = d.getMonth() + 1 + "/" + d.getDate() + "/" + d.getFullYear();

test('linkedin app bot', async ({ page }) => {
  var totalJobsApplied = 0;
  const searchTermArray = config.searchTerms;
  
  let remote = "";
  if (config.remote == true) {
    remote = "&f_WT=2&geoId=103644278";
  } else {
    remote = "&geoId=103644278";
  }

  for (let g = 0; g < searchTermArray.length; g++) {
    let searchTerm = searchTermArray[g]; 
    let easyApply = "?f_AL=true";
    let location = config.location; 
    const jobsPerPage = 25;
  
    var url = "https://www.linkedin.com/jobs/search/" + easyApply + remote + "&keywords=" + searchTerm + "&location=" + location;
    
    await page.goto(url);
    
    //await page.locator('.jobs-search-box__keyboard-text-input').nth(0).type(searchTerm);
    //await page.keyboard.press('Enter');
    //await page.locator('button:has-text("help desk United States · Easy Apply · Remote")').click();
    
    //await page.locator('.jobs-search-results__list-item').last().scrollIntoViewIfNeeded();
    await page.hover('.jobs-search-results-list');
    for (let i = 0; i < 7; i++) {
      await page.mouse.wheel(0, 400);
      // if (await page.isVisible('.artdeco-pagination__indicator')) {
      //     break;
      // }
    }
  
    let pages = await page.locator('ul.artdeco-pagination__pages .artdeco-pagination__indicator').last().innerText();
    // page.on("console", msg => {
    //   if (msg.type() === 'info') {
    //       console.info(msg);
    //   }    
    // })
    console.log("There are " + pages + " pages of jobs to apply to.");
    //   await page.hover('.jobs-search__left-rail');
    //   for (let i = 0; i < 7; i++) {
    //     await page.mouse.wheel(0, -500);
    //   }
    console.log("Beginning applications...");
    var jobsApplied = 0;
    var maxJobsApplied = 25;
    var jobsOnPage = 24;
    var jobTitle = "";
    var companyTitle = "";
    var companyTitleRegex = /^(.*?) ·/;
    for (let h = 0; h < parseInt(pages); h++) {
      if (jobsApplied > maxJobsApplied) {
        console.log("You applied to " + jobsApplied + " " + searchTerm + " jobs!");
        totalJobsApplied += jobsApplied;
        break;
      }
      if (h != 0) {
        let jobPage = jobsPerPage * h;
        console.log("You've applied to " + jobsApplied + " jobs!");
        console.log("Moving to next page...");
        //await page.locator('ul.artdeco-pagination__pages > li').nth(h).click();
        url = url + "&start=" + jobPage;
        await page.goto(url);
        await page.hover('.jobs-search-results-list');
        for (let i = 0; i < 7; i++) {
          await page.mouse.wheel(0, 400);
        }
      }
      jobsOnPage = await page.locator('.job-card-list__title').count();
      console.log(jobsOnPage + " jobs on this page");
      for (let i = 0; i < jobsOnPage; i++) {
        try {
          await page.hover('.jobs-search-results-list');
          await page.mouse.wheel(0, 200);
          await page.locator('.job-card-list__title').nth(i).click();
          if (await page.isVisible('span.artdeco-button__text:has-text("Easy Apply")')) {
            jobTitle = await page.locator('.job-details-jobs-unified-top-card__job-title-link').first().innerText({timeout: 10000});
            companyTitle = await page.locator('.job-details-jobs-unified-top-card__primary-description-without-tagline').first().innerText({timeout: 10000});
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
            await page.locator('label:has-text("Follow")').click({ timeout: 10000 });
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
              await page.locator('label:has-text("Follow")').click({ timeout: 10000 });
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
              await page.locator('label:has-text("Follow")').click({ timeout: 10000 });
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
              //await page.locator('span:has-text("Choose")').first().click({timeout: 10000});
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
              await page.locator('label:has-text("Follow")').click({ timeout: 10000 });
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