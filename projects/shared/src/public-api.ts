/*
 * RERO ILS UI
 * Copyright (C) 2020 RERO
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

/*
 * Public API Surface of shared
 */

export * from './lib/api/base-api';
export * from './lib/api/user-api.service';
export * from './lib/class/item-status';
export * from './lib/class/user';
export * from './lib/paginator/paginator';
export * from './lib/paginator/show-more-pager/show-more-pager.component';
export * from './lib/pipe/contribution-filter.pipe';
export * from './lib/pipe/contribution-format.pipe';
export * from './lib/pipe/contribution-type.pipe';
export * from './lib/pipe/extract-source-field.pipe';
export * from './lib/pipe/get-translated-label.pipe';
export * from './lib/pipe/id-attribute.pipe';
export * from './lib/pipe/item-holdings-call-number.pipe';
export * from './lib/pipe/join.pipe';
export * from './lib/pipe/key-exists.pipe';
export * from './lib/pipe/main-title.pipe';
export * from './lib/pipe/patron-blocked-message.pipe';
export * from './lib/pipe/provision-activity.pipe';
export * from './lib/pipe/url-active.pipe';
export * from './lib/service/app-settings.service';
export * from './lib/service/search-bar-config.service';
export * from './lib/service/user.service';
export * from './lib/shared.module';
export * from './lib/view/brief/contribution-brief/contribution-brief.component';
export * from './lib/view/brief/contribution-sources/contribution-sources.component';
export * from './lib/view/brief/organisation-brief/organisation-brief.component';
export * from './lib/view/brief/part-of/part-of.component';
export * from './lib/view/brief/person-brief/person-brief.component';
export * from './lib/view/inherited-call-number/inherited-call-number.component';
export * from './lib/view/thumbnail/thumbnail.component';
export * from './tests/user';
