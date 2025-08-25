/*
 * RERO ILS UI
 * Copyright (C) 2019-2023 RERO
 * Copyright (C) 2021-2023 UCLouvain
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, version 3 of the License.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
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
