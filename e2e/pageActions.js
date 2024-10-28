export class JobSearch {
    constructor(page) {
        this.page = page;
    }

    async login() {
        
    }

    async searchForPosition(jobTitle) {
        const searchBox = this.page.getByRole('combobox', { name: 'Search by title, skill, or' });
        await searchBox.click();
        await searchBox.pressSequentially(jobTitle);
    }

    async filterByEasyApply() {
        await this.page.getByLabel('Easy Apply filter.').click();
    }

    async setLocation(location) {
        const locationBox = this.page.getByRole('combobox', { name: 'City, state, or zip code' });
        await locationBox.click({clickCount: 3});
        await this.page.keyboard.press('Backspace');
        await locationBox.pressSequentially(location);
    }

    // Combine all actions into one method
    async searchJobWithFilters(jobTitle, location) {
        await this.page.getByRole('link', { name : 'Jobs', exact : true }).click();
        await this.searchForPosition(jobTitle);
        await this.setLocation(location);
        await this.page.keyboard.press('Enter');
        await this.filterByEasyApply();
    }

    async dismiss() {
        await this.page.getByRole('button', { name: 'Dismiss' }).first().click();
    }

    async scroll() {

    }
}