/*
 * RERO ILS UI
 * Copyright (C) 2019 RERO
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

import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';

// _('Your string');

// Resources
_('acq_accounts');
_('acq_order_lines');
_('acq_orders');
_('budgets');
_('circ_policies');
_('documents');
_('item_types');
_('libraries');
_('locations');
_('organisations');
_('Patrons');
_('patron_types');
_('persons');
_('vendors');

// Facets
_('author');

// Day
_('monday');
_('tuesday');
_('wednesday');
_('thursday');
_('friday');
_('saturday');
_('sunday');

// Document type
_('other');

// Roles
_('patron');
_('system_librarian');

// Order type
_('serial');
_('monograph');
_('standing_order');
_('monographic_set');
_('planned_order');
_('multi_volume');

// Order status & Order line status
_('approved');
_('canceled');
_('ordered');
_('pending');
_('received');

// Electronic locator types
_('noInfo');
_('resource');
_('versionOfResource');
_('relatedResource');
_('hiddenUrl');

// Electronic locator content
_('poster');
_('audio');
_('postcard');
_('addition');
_('debriefing');
_('exhibitionDocumentation');
_('erratum');
_('bookplate');
_('extract');
_('educationalSheet');
_('illustrations');
_('coverImage');
_('deliveryInformation');
_('biographicalInformation');
_('introductionPreface');
_('classReading');
_('teachersKit');
_('publishersNote');
_('noteOnContent');
_('titlePage');
_('photography');
_('summarization');
_('onlineResourceViaRERODOC');
_('pressReview');
_('webSite');
_('tableOfContents');
_('fullText');

// Enum values
//  - patron transaction
_('open');
_('closed');
_('fee');
_('payment');
_('dispute');
_('cancel');
//  - ill requests
_('pending');
_('validated');
_('denied');
_('closed');
//  - notification type
_('due_soon');
_('recall');
_('overdue');
_('availability');
//  - loan state
_('CREATED');
_('PENDING');
_('ITEM_ON_LOAN');
_('ITEM_RETURNED');
_('ITEM_IN_TRANSIT_FOR_PICKUP');
_('ITEM_IN_TRANSIT_TO_HOUSE');
_('ITEM_AT_DESK');
_('CANCELLED');
//  - Item note type
_('general_note');
_('staff_note');
_('checkin_note');
_('checkout_note');
_('binding_note');
_('provenance_note');
_('condition_note');
_('patrimonial_note');
_('acquisition_note');
//  - Item circulation action
_('checkout');
_('checkin');
_('request');
_('lose');
_('receive');
_('return_missing');
_('extend_loan');
_('validate');
_('no');

// Item Request messages
_('Request not allowed by the circulation policy.');
_('The item is already checked out or requested by this patron.');
_('Item not found.');
_('The item status does not allow requests.');
_('Library not found.');
_('Patron not found.');
_('Request possible');
_('Circulation policy disallows the operation.');
_('No circulation action performed');
_('Item returned at owning library');
_('The item is {{ status }}');
_('The item is in transit to [{{ destination }}]');
_('Checkout is not allowed by circulation policy');

// item note
_('public_note');
_('staff_note');
_('checkin_note');
_('checkout_note');

// Local fields
_('local_field_1');
_('local_field_2');
_('local_field_3');
_('local_field_4');
_('local_field_5');
_('local_field_6');
_('local_field_7');
_('local_field_8');
_('local_field_9');
_('local_field_10');

// Show more resources
_('{{ counter }} hidden issue');
_('{{ counter }} hidden issues');
_('{{ counter }} hidden item');
_('{{ counter }} hidden items');
_('{{ counter }} hidden holding');
_('{{ counter }} hidden holdings');

// Menu entries
_('User services');
_('Catalog');
_('ILL requests');
_('Import from the web');
_('Corporate bodies');
_('Late issues');
_('Reports & monitoring');
_('Inventory list');
_('Admin');
_('My organisation');
_('My library');
_('Public interface');
_('Logout');

_('Masked');
_('No masked');
