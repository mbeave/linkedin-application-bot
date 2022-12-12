import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  let searchTerm = "help%20desk"; //replace spaces in your search terms and location with "%20" for building the url's; for instance, "React Developer" would be "React%20Developer"
  let easyApply = "?f_AL=true";
  let location = "United%20States"; 
  let remote = "&f_WT=2&geoId=103644278";
  const jobsPerPage = 25;

  var url = "https://www.linkedin.com/jobs/search/" + easyApply + remote + "&keywords=" + searchTerm + "&location=" + location;
  
  await page.goto(url);
  
  //await page.locator('.jobs-search-box__keyboard-text-input').nth(0).type(searchTerm);
  //await page.keyboard.press('Enter');
  //await page.locator('button:has-text("help desk United States · Easy Apply · Remote")').click();
  
  await page.locator('.jobs-search-results__list-item').last().scrollIntoViewIfNeeded();
  await page.hover('.jobs-search-results-list');
  for (let i = 0; i < 7; i++) {
    await page.mouse.wheel(0, 500);
    if (await page.isVisible('.jobs-search-results__list-item')) {
        break;
    }
  }

  let pages = await page.locator('ul.artdeco-pagination__pages .artdeco-pagination__indicator').last().innerText();
  page.on("console", msg => {
    if (msg.type() === 'info') {
        console.info(msg);
    }    
  })
  console.log("There are " + pages + " pages of jobs to apply to.");
//   await page.hover('.jobs-search__left-rail');
//   for (let i = 0; i < 7; i++) {
//     await page.mouse.wheel(0, -500);
//   }
  console.log("Beginning applications...");
  var jobsApplied = 0;
  for (let h = 10; h < parseInt(pages); h++) {
    if (h != 0) {
        let jobPage = jobsPerPage * h;
        console.log("Moving to next page...");
        //await page.locator('ul.artdeco-pagination__pages > li').nth(h).click();
        var url = url + "&start=" + jobPage;
        await page.goto(url);
    }
    for (let i = 0; i < 24; i++) {
        try {
            await page.locator('.job-card-list__title').nth(i).click();
            if (await page.isVisible('span.artdeco-button__text:has-text("Easy Apply")')) {
                await page.locator('span:has-text("Easy Apply")').first().click();
            }
            else {
                console.log("Already applied...");
                continue;
            }
            
            page.waitForTimeout(8000);
            if (await page.isVisible('span.artdeco-button__text:has-text("Submit")')) {
                await page.locator('label:has-text("Follow")').click();
                await page.locator('text=Submit Application').click();
                console.log("Job applied!");
                jobsApplied++;
                await page.locator('.artdeco-button__icon').first().click();
                continue;
            }
            
            await page.locator('span:has-text("Next")').first().click();
            let progressValue = await page.locator("progress").first().getAttribute("Value")

            if (progressValue == "50") {  
                try {
                    await page.locator('span:has-text("Review")').first().first().click();
                    await page.locator('label:has-text("Follow")').click();
                    await page.locator('text=Submit Application').click();
                    console.log("Job applied!");
                    jobsApplied++;
                    await page.locator('.artdeco-button__icon').first().click();
                } catch (e) {
                    await page.locator('.artdeco-button__icon').first().click();
                    await page.locator('span:has-text("Discard")').click();
                    console.log("Can't apply");
                    continue;
                }
            }
            else if (progressValue == "33") {
                try {
                    await page.locator('span:has-text("Next")').first().click();
                    await page.locator('span:has-text("Review")').first().first().click();
                    if (await page.isVisible('text=Please enter a valid answer')) {
                        let jobID = await page.locator('xpath=//div[@data-job-id]').nth(i).getAttribute('data-job-id');
                        let href = "https://www.linkedin.com/jobs/view/" + jobID;
                        console.log("Couldn't apply to job! Apply here: " + href);
                        await page.locator('.artdeco-button__icon').first().click();
                        await page.locator('span:has-text("Discard")').click();
                        continue;
                    }
                    await page.locator('label:has-text("Follow")').click();
                    await page.locator('text=Submit Application').click();
                    console.log("Job applied!");
                    jobsApplied++;
                    await page.locator('.artdeco-button__icon').first().click();
                } catch (e) {
                    await page.locator('.artdeco-button__icon').first().click();
                    await page.locator('span:has-text("Discard")').click();
                    console.log("Can't apply");
                    continue;
                }
            }
            else if (progressValue == "25") {
                try {
                    await page.locator('span:has-text("Next")').first().click();
                    if (await page.isVisible('text=Please enter a valid answer')) {
                        let jobID = await page.locator('xpath=//div[@data-job-id]').nth(i).getAttribute('data-job-id');
                        let href = "https://www.linkedin.com/jobs/view/" + jobID;
                        console.log("Couldn't apply to job! Apply here: " + href);
                        await page.locator('.artdeco-button__icon').first().click();
                        await page.locator('span:has-text("Discard")').click();
                        continue;
                    }
                    await page.locator('span:has-text("Next")').first().click();
                    if (await page.isVisible('text=Please enter a valid answer')) {
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
                    jobsApplied++;
                    await page.locator('.artdeco-button__icon').first().click();
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
  console.log("You applied to " + jobsApplied + " jobs! Congrats!");
  page.waitForTimeout(100000);
  page.close();
});