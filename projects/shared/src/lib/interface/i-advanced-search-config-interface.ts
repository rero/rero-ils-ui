// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
export type IAdvancedSearchConfig = {
  fieldsConfig: ILabelValueField[];
  fieldsData: IFieldsData
}

export type IFieldsData = {
  canton: ILabelValue[],
  country: ILabelValue[],
  rdaCarrierType: ILabelValue[],
  rdaContentType: ILabelValue[],
  rdaMediaType: ILabelValue[],
}

export type ILabelValueField = {
  field: string
  options: {
    search_type: ILabelValue[];
  }
} & ILabelValue

export type ILabelValue = {
  label: string;
  value: string;
}

export type ISearch = {
  field: string;
  term?: string;
  operator: string;
  searchType: string;
}

export type ISearchModel = {
  field: string;
  term: string;
  searchType: string;
  search: ISearch[]
}

export type ISelectOptions = {
  label: string;
  value: string;
  preferred?: boolean;
}

export type IFieldsType = Record<string, ILabelValue[]>;
