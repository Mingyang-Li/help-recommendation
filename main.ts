export type Page = 'dashboard' | 'devices' | 'locations' | 'files' | 'shipments';

export interface User {
  createdAt: Date;
  devicesRegistered: number;
  locationsRegistered: number;
  currPage: Page;
}

export const daysDifference = (d1: Date, d2: Date) => {
  const diff = new Date(+d2).setHours(12) - new Date(+d1).setHours(12);
  return Math.round(diff/8.64e7);
}

export class ContextHelp {
  static helpButonClicked: boolean;
  static tags: string[];

  private static setHelpButtonClicked() {
    this.helpButonClicked = !this.helpButonClicked;
  }

  private static generateTags(user: User): string[] {
    // checking how long we had this user for
    if (daysDifference(new Date(), user.createdAt) <= 7) {
      ['new_user', 'activation_code'].forEach((tag: string) => {
        this.tags.push(tag);
      })
    }

    // page checks
    switch (user.currPage) {
      case 'dashboard':
        this.tags.push('dashboard');
      case 'devices':
        this.tags.push('devices');
      case 'locations':
        this.tags.push('locations');
      case 'files':
        this.tags.push('files');
      case 'shipments':
        this.tags.push('shipments');
    }

    // device checks
    if (user.devicesRegistered === 0) {
      this.tags.push('device');
    }

    // location checks
    if (user.locationsRegistered === 0) {
      this.tags.push('location')
    }
    return this.tags;
  }

  private static formQueryForSectionAndFaq(tags: string[]) {
    const query = `
      query {
        sections(where: {
            tags_contains_some: ${tags}
        }) {
            title
            content
            tags
        }
        faqs(where: {
            tags_contains_some: ${tags}
        }) {
            question
            answer
            tags
        }
      }

    `;
    return query
  }
}
