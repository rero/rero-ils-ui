// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later

// required as json properties is not lowerCamelCase

export class ExternalSourceSetting {
  key: string;
  label = "";
  weight?: number = 100;
  endpoint?: string;

  constructor(obj?: any) {
    Object.assign(this, obj)
  }

  /**
   * Get the import url to use
   * @return: the endpoint url to use to import external sources
   */
  getImportEndpoint(): string {
    return (this.endpoint != undefined)
      ? this.endpoint
      : `import_${this.key}`;
  }
}
