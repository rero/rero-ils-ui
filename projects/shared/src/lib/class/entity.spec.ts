/*
 * RERO ILS UI
 * Copyright (C) 2023 RERO
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
import { EntityTypeIcon } from '@rero/shared';
import { Entity, EntityField$ref, EntityType } from './entity';

describe('Entity', () => {
  it('should return the icon\'s class', () => {
    expect(Entity.getIcon(EntityType.ORGANISATION)).toEqual(EntityTypeIcon.ORGANISATION);
    expect(Entity.getIcon(EntityType.PERSON)).toEqual(EntityTypeIcon.PERSON);
    expect(Entity.getIcon(EntityType.PLACE)).toEqual(EntityTypeIcon.PLACE);
    expect(Entity.getIcon(EntityType.TEMPORAL)).toEqual(EntityTypeIcon.TEMPORAL);
    expect(Entity.getIcon(EntityType.TOPIC)).toEqual(EntityTypeIcon.TOPIC);
    expect(Entity.getIcon(EntityType.WORK)).toEqual(EntityTypeIcon.WORK);
    expect(Entity.getIcon('foo')).toEqual(EntityTypeIcon.MISSING);
  });

  it('should return search fields based on the type', () => {
    expect(Entity.getFieldsSearch(EntityType.ORGANISATION)).toEqual([
      EntityField$ref.CONTRIBUTION,
      EntityField$ref.SUBJECTS
    ]);
    expect(Entity.getFieldsSearch(EntityType.PERSON)).toEqual([
      EntityField$ref.CONTRIBUTION,
      EntityField$ref.SUBJECTS
    ]);
    expect(Entity.getFieldsSearch(EntityType.PLACE)).toEqual([
      EntityField$ref.SUBJECTS
    ]);
    expect(Entity.getFieldsSearch(EntityType.TEMPORAL)).toEqual([
      EntityField$ref.SUBJECTS
    ]);
    expect(Entity.getFieldsSearch(EntityType.TOPIC)).toEqual([
      EntityField$ref.GENRE_FORM,
      EntityField$ref.SUBJECTS
    ]);
    expect(Entity.getFieldsSearch(EntityType.WORK)).toEqual([
      EntityField$ref.SUBJECTS
    ]);
    expect(Entity.getFieldsSearch('foo')).toEqual([
      EntityField$ref.CONTRIBUTION,
      EntityField$ref.GENRE_FORM,
      EntityField$ref.SUBJECTS
    ]);
  });

  it('should return a query for bf:Organisation', () => {
    const query = [
      'contribution.entity.pids.foo:x11',
      'subjects.entity.pids.foo:x11'
    ].join(' OR ');
    expect(Entity.generateSearchQuery(EntityType.ORGANISATION, 'foo', 'x11')).toEqual(query);
  });

  it('should return a query for bf:Topic', () => {
    const query = [
      'genreForm.entity.pids.foo:x11',
      'subjects.entity.pids.foo:x11'
    ].join(' OR ');
    expect(Entity.generateSearchQuery(EntityType.TOPIC, 'foo', 'x11')).toEqual(query);
  });

  it('should return a query with all fields if the type is missing', () => {
    const query = [
      'contribution.entity.pids.foo:x11',
      'genreForm.entity.pids.foo:x11',
      'subjects.entity.pids.foo:x11'
    ].join(' OR ');
    expect(Entity.generateSearchQuery('bf:foo', 'foo', 'x11')).toEqual(query);
  });

  it('should return the search string for an external link', () => {
    const routerLink = ['/records', 'documents'];
    const queryParams = {
      q: 'entity.pid:100',
      page: '1',
      size: '10',
      sort: 'bestmatch',
      simple: '0',

    }
    const link = '/records/documents?q=entity.pid:100&page=1&size=10&sort=bestmatch&simple=0';
    expect(Entity.generateHrefLink(routerLink, queryParams)).toEqual(link);
  });
});
