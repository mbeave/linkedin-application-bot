export class JobSearch {
    constructor(page) {
        this.page = page;
    }

    async searchForPosition(jobTitle) {
        const searchBox = this.page.getByRole('combobox', { name: 'Search by title, skill, or' });
        await searchBox.click();
        await searchBox.pressSequentially(jobTitle);
    }

    async filterByEasyApply() {
        await this.page.getByLabel('Easy Apply filter.').click();
    }

    async filterByRemote(filter) {
        await this.page.getByLabel('Remote filter. Clicking this').click();
        if (filter == "hybrid") {
            await this.page.locator('label').filter({ hasText: 'Hybrid Filter by Hybrid' }).click();
        } else if (filter == "remote") {
            await this.page.locator('label').filter({ hasText: 'Remote Filter by Remote' }).click();
        } else {
            console.log("No valid option chosen for remote options")
        }
        await this.page.getByRole('button', { name: 'Apply current filter to show' }).click();
    }

    async setLocation(location) {
        const locationBox = this.page.getByRole('combobox', { name: 'City, state, or zip code' });
        await locationBox.click({clickCount: 3});
        await this.page.keyboard.press('Backspace');
        await locationBox.pressSequentially(location);
    }

    async searchJobWithFilters(jobTitle, location, filter) {
        await this.page.getByRole('link', { name : 'Jobs', exact : true }).click();
        await this.searchForPosition(jobTitle);
        await this.setLocation(location);
        await this.page.keyboard.press('Enter');
        await this.filterByEasyApply();
        await this.filterByRemote(filter);
    }

    async dismiss() {
        await this.page.getByRole('button', { name: 'Dismiss' }).first().click();
    }

    async scroll() {
        await this.page.hover('.jobs-search-results-list');
        for (let i = 0; i < 7; i++) {
          await this.page.mouse.wheel(0, Math.floor(Math.random()*200+400));
        }
    }
}