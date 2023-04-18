/*
 * RERO ILS UI
 * Copyright (C) 2019-2023 RERO
 * Copyright (C) 2019-2023 UCLouvain
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
import { TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { EntityLabelPipe } from './entity-label.pipe';

describe('EntityLabelPipe', () => {

  let entityLabelPipe: EntityLabelPipe;
  let translateService: TranslateService;

  const entities = [{
    authorized_access_point_de: 'Schweizerischer Fischereiverein',
    authorized_access_point_en: 'Swiss Fishing Federation',
    authorized_access_point_fr: 'Fédération suisse de pêche',
    authorized_access_point_it: 'Federazione svizzera della pesca',
  }, {
    authorized_access_point: 'Undefined person',
    authorized_access_point_de: 'German name person',
    authorized_access_point_en: 'English name person',
    authorized_access_point_fr: 'French name person',
    authorized_access_point_it: 'Italian name person',
  }, {
    authorized_access_point: 'Local entity',
  }, {
    dummy_access_point_key: 'No data',
    subdivisions: [
      {entity: {authorized_access_point: 'part1', type:'bf:Topic', genreForm:true}},
      {entity: {authorized_access_point: 'part2', type:'bf:Place'}}
    ]
  }];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot()
      ],
      providers: [
        EntityLabelPipe,
        TranslateService
      ]
    });
    entityLabelPipe = TestBed.inject(EntityLabelPipe);
    translateService = TestBed.inject(TranslateService);
  });

  it('create an instance', () => {
    expect(entityLabelPipe).toBeTruthy();
  });

  it('Test normal transformation behavior', () => {
    translateService.use('fr');
    expect(entityLabelPipe.transform(entities[0])).toEqual('Fédération suisse de pêche');
    expect(entityLabelPipe.transform(entities[1])).toEqual('French name person');

    translateService.use('en');
    expect(entityLabelPipe.transform(entities[0])).toEqual('Swiss Fishing Federation');
    expect(entityLabelPipe.transform(entities[1])).toEqual('English name person');
  });

  it('Test transformation behavior when translations are undefined', () => {
    translateService.use('it');
    expect(entityLabelPipe.transform(entities[0])).toEqual('Federazione svizzera della pesca');
    expect(entityLabelPipe.transform(entities[1])).toEqual('Italian name person');
    expect(entityLabelPipe.transform(entities[2])).toEqual('Local entity');
    expect(entityLabelPipe.transform(entities[3])).toEqual('part1 - part2');
  });

  it('Test transformation behavior when language in unknown', () => {
    translateService.use('ru');
    expect(entityLabelPipe.transform(entities[0])).toEqual('Swiss Fishing Federation');
    expect(entityLabelPipe.transform(entities[1])).toEqual('English name person');
    expect(entityLabelPipe.transform(entities[2])).toEqual('Local entity');
    expect(entityLabelPipe.transform(entities[3])).toEqual('part1 - part2');
  });
});
