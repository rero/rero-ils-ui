# Changelog

## [v19.0.1](https://github.com/rero/rero-ils-ui/tree/v19.0.1) (2025-07-22)

[Full Changelog](https://github.com/rero/rero-ils-ui/compare/v19.0.0...v19.0.1)

**Fixes:**

* fix(menu): open signout link in a new tab [\#1339](https://github.com/rero/rero-ils-ui/pull/1339) (by @jma)
* fix(circulation): wrong request disappears when deleted [\#1340](https://github.com/rero/rero-ils-ui/pull/1340) (by @jma)
* fix(circulation): patron message [\#1338](https://github.com/rero/rero-ils-ui/pull/1338) (by @Garfield-fr)
* fix(preview email): add email manually on input [\#1335](https://github.com/rero/rero-ils-ui/pull/1335) (by @Garfield-fr)
* fix: global document search not filtered [\#1332](https://github.com/rero/rero-ils-ui/pull/1332) (by @Garfield-fr)
* fix(loan): make expire_request_date correct [\#1327](https://github.com/rero/rero-ils-ui/pull/1327) (by @PascalRepond)
* fix(item): request list pickup location [\#1331](https://github.com/rero/rero-ils-ui/pull/1331) (by @Garfield-fr)
* fix: missing notification info in circulation history [\#1330](https://github.com/rero/rero-ils-ui/pull/1330) (by @Garfield-fr)
* style(library): enhance exception dates [\#1320](https://github.com/rero/rero-ils-ui/pull/1320) (by @PascalRepond)
* feat(acquisition): display vendor notes [\#1323](https://github.com/rero/rero-ils-ui/pull/1323) (by @PascalRepond)
* fix: fix bad key for local entity genre-form [\#1321](https://github.com/rero/rero-ils-ui/pull/1321) (by @Garfield-fr)
* fix: rename temporary circulation category [\#1326](https://github.com/rero/rero-ils-ui/pull/1326) (by @PascalRepond)
* style(debug): harmonise debug button colour and margins [\#1328](https://github.com/rero/rero-ils-ui/pull/1328) (by @PascalRepond)

## [v19.0.0](https://github.com/rero/rero-ils-ui/tree/v19.0.0) (2025-06-27)

[Full Changelog](https://github.com/rero/rero-ils-ui/compare/v17.2.1...v19.0.0)

**New features:**

- Migration to Angular19/PrimeNG/TailwindCSS [\#1282](https://github.com/rero/rero-ils-ui/pull/1282) (by @Garfield-fr & @jma) (large refactoring: see PR for full list of commits and changes)
- feat: display validation errors on submit [\#1283](https://github.com/rero/rero-ils-ui/pull/1283) (by @jma)

**Enhancements:**

- feat(acquisition): enhance the receipt editor [\#1317](https://github.com/rero/rero-ils-ui/pull/1317) (by @jma)
- fix(requests): add filters for the pickup locations [\#1299](https://github.com/rero/rero-ils-ui/pull/1299) (by @jma)
- fix(menu): duplicate id [\#1293](https://github.com/rero/rero-ils-ui/pull/1293) (by @Garfield-fr)
- chore(orders): remove type aggregation [\#1292](https://github.com/rero/rero-ils-ui/pull/1292) (by @PascalRepond)
- refactor(requests): expand items by default [\#1296](https://github.com/rero/rero-ils-ui/pull/1296) (by @PascalRepond)
- fix(pro ui): remove footer [\#1290](https://github.com/rero/rero-ils-ui/pull/1290) (by @PasccalRepond & @jma)
- admin: improve app menu [\#1225](https://github.com/rero/rero-ils-ui/pull/1225) (by @Garfield-fr)
- style(document): improve display of elements [\#1249](https://github.com/rero/rero-ils-ui/pull/1249) (by @Garfield-fr)
- acquisitions: add expand/collapse all acquisition accounts [\#1252](https://github.com/rero/rero-ils-ui/pull/1252) (by @jma)
- primeng: circulation [\#1248](https://github.com/rero/rero-ils-ui/pull/1248) (by @Garfield-fr)
- primeng: fix PO issue [\#1251](https://github.com/rero/rero-ils-ui/pull/1251) (by @jma)
- primeng: acquisitions accounts [\#1247](https://github.com/rero/rero-ils-ui/pull/1247) (by @jma)
- primeng: admin late issues [\#1246](https://github.com/rero/rero-ils-ui/pull/1246) (by @jma)
- primeng: admin orders [\#1245](https://github.com/rero/rero-ils-ui/pull/1245) (by @jma)
- primeng: admin budgets [\#1244](https://github.com/rero/rero-ils-ui/pull/1244) (by @jma)
- primeng: admin vendors [\#1243](https://github.com/rero/rero-ils-ui/pull/1243) (by @jma)
- primeng: admin libraries [\#1242](https://github.com/rero/rero-ils-ui/pull/1242) (by @jma)
- primeng: admin migrations [\#1241](https://github.com/rero/rero-ils-ui/pull/1241) (by @jma)
- primeng: admin permissions [\#1240](https://github.com/rero/rero-ils-ui/pull/1240) (by @jma)
- primeng: admin templates [\#1239](https://github.com/rero/rero-ils-ui/pull/1239) (by @jma)
- primeng: admin patron types [\#1238](https://github.com/rero/rero-ils-ui/pull/1238) (by @jma)
- primeng: admin item types [\#1237](https://github.com/rero/rero-ils-ui/pull/1237) (by @jma)
- primeng: admin circulatin policies [\#1236](https://github.com/rero/rero-ils-ui/pull/1236) (by @jma)
- primeng: admin stat configurations [\#1235](https://github.com/rero/rero-ils-ui/pull/1235) (by @jma)
- primeng: admin fees [\#1234](https://github.com/rero/rero-ils-ui/pull/1234) (by @jma)
- primeng: admin inventories [\#1233](https://github.com/rero/rero-ils-ui/pull/1233) (by @jma)
- primeng: admin entities [\#1232](https://github.com/rero/rero-ils-ui/pull/1232) (by @jma)
- primeng: fix first admin tests [\#1231](https://github.com/rero/rero-ils-ui/pull/1231) (by @jma)
- primeng: admin documents [\#1230](https://github.com/rero/rero-ils-ui/pull/1230) (by @jma)
- primeng: admin loans [\#1229](https://github.com/rero/rero-ils-ui/pull/1229) (by @jma)
- primeng: admin collections [\#1228](https://github.com/rero/rero-ils-ui/pull/1228) (by @jma)
- primeng: admin patrons [\#1227](https://github.com/rero/rero-ils-ui/pull/1227) (by @jma)
- primeng: admin ill requests [\#1226](https://github.com/rero/rero-ils-ui/pull/1226) (by @jma)

**Fixes:**

- fix(circulation): update fees tab data [\#1318](https://github.com/rero/rero-ils-ui/pull/1318) (by @jma)
- fix(babeltheque): display "more info" after loading the ng app [\#1311](https://github.com/rero/rero-ils-ui/pull/1311) (by @PascalRepond)
- fix(circ): prevent partially hidden type select when adding fees [\#1312](https://github.com/rero/rero-ils-ui/pull/1312) (by @PascalRepond)
- feat(acquistions): add receipt line editor [\#1313](https://github.com/rero/rero-ils-ui/pull/1313) (by @jma)
- fix: advanced search type disabled if only one type [\#1314](https://github.com/rero/rero-ils-ui/pull/1314) (by @Garfield-fr)
- fix(editor): display of user infos [\#1315](https://github.com/rero/rero-ils-ui/pull/1315) (by @Garfield-fr)
- fix(circulation): fix wrong library destination for in transit for pickup [\#1316](https://github.com/rero/rero-ils-ui/pull/1316) (by @jma)
- feat(acquistions): add receipt editor [\#1310](https://github.com/rero/rero-ils-ui/pull/1310) (by @jma)
- fix(babeltheque): display "more info" after loading the ng app [\#1311](https://github.com/rero/rero-ils-ui/pull/1311) (by @PascalRepond)
- fix: update library code in menus during switch [\#1297](https://github.com/rero/rero-ils-ui/pull/1297) (by @Garfield-fr)
- fix: resource delete message [\#1300](https://github.com/rero/rero-ils-ui/pull/1300) (by @Garfield-fr)
- fix(holdings): auto expand only if there is only one holdings [\#1298](https://github.com/rero/rero-ils-ui/pull/1298) (by @Garfield-fr)
- fix(circulation): circulation messages [\#1308](https://github.com/rero/rero-ils-ui/pull/1308) (by @Garfield-fr)
- fix(acquisition): add priority on order line [\#1301](https://github.com/rero/rero-ils-ui/pull/1301) (by @Garfield-fr)
- style(acquisition): account select menu [\#1307](https://github.com/rero/rero-ils-ui/pull/1307) (by @Garfield-fr)
- fix(circulation): fix highlight loans that are late [\#1302](https://github.com/rero/rero-ils-ui/pull/1302) (by @jma)
- fix(circulation): set autofocus after each circulation operation [\#1303](https://github.com/rero/rero-ils-ui/pull/1303) (by @jma)
- refactor(acquisitions): fix message when a receipt cannot be added [\#1305](https://github.com/rero/rero-ils-ui/pull/1305) (by @PascalRepond)
- fix(circulation): fix fixed date checkout [\#1306](https://github.com/rero/rero-ils-ui/pull/1306) (by @jma)
- fix(patron profile): update the "approaching due date" after a renew [\#1309](https://github.com/rero/rero-ils-ui/pull/1309) (by @jma)
- fix(menu): duplicate id [\#1293](https://github.com/rero/rero-ils-ui/pull/1293) (by @Garfield-fr)
- chore(orders): remove type aggregation [\#1292](https://github.com/rero/rero-ils-ui/pull/1292) (by @PascalRepond)
- fix(request list): enhance print display [\#1291](https://github.com/rero/rero-ils-ui/pull/1291) (by @PascalRepond)
- fix(acquisition): action tab on click [\#1281](https://github.com/rero/rero-ils-ui/pull/1281) (by @Garfield-fr)
- fix(acquisition): disabled button on receipt [\#1279](https://github.com/rero/rero-ils-ui/pull/1279) (by @Garfield-fr)
- fix(acquisition): dynamic routes on child [\#1278](https://github.com/rero/rero-ils-ui/pull/1278) (by @Garfield-fr)
- fix(circulation): statistics [\#1287](https://github.com/rero/rero-ils-ui/pull/1287) (by @Garfield-fr)
- fix: keep history updated after any action in the fees view [\#1289](https://github.com/rero/rero-ils-ui/pull/1289) (by @jma)
- fix(cipo): editor addon wrap display [\#1276](https://github.com/rero/rero-ils-ui/pull/1276) (by @PascalRepond)
- Fix tests [\#1274](https://github.com/rero/rero-ils-ui/pull/1274) (by @Garfield-fr)
- fix(theme): colors [\#1268](https://github.com/rero/rero-ils-ui/pull/1268) (by @PascalRepond)
- fix: add support tailwind css prefix for UI [\#1265](https://github.com/rero/rero-ils-ui/pull/1265) (by @Garfield-fr)
- fix: primeng PO tests [\#1253](https://github.com/rero/rero-ils-ui/pull/1253) (by @jma)

**Other changes:**

- chore: improve loading record [\#1294](https://github.com/rero/rero-ils-ui/pull/1294) (by @Garfield-fr)
- chore: update dependencies [\#1282](https://github.com/rero/rero-ils-ui/pull/1282) (by @Garfield-fr)
- chore: update dependencies [\#1277](https://github.com/rero/rero-ils-ui/pull/1277) (by @Garfield-fr)
- chore: fixes some elements after tests [\#1275](https://github.com/rero/rero-ils-ui/pull/1275) (by @Garfield-fr)
- chore: fix track value in templates [\#1280](https://github.com/rero/rero-ils-ui/pull/1280) (by @jma)
- chore(theme): move tag link color to ng-core [\#1273](https://github.com/rero/rero-ils-ui/pull/1273) (by @PascalRepond)
- chore: replace translate extract library [\#1272](https://github.com/rero/rero-ils-ui/pull/1272) (by @Garfield-fr)
- chore: adjust layout [\#1271](https://github.com/rero/rero-ils-ui/pull/1271) (by @Garfield-fr)
- chore(circulation): fix and enhancement layout [\#1270](https://github.com/rero/rero-ils-ui/pull/1270) (by @Garfield-fr)
- chore: change deprecated elements [\#1267](https://github.com/rero/rero-ils-ui/pull/1267) (by @Garfield-fr)
- chore: update packages [\#1269](https://github.com/rero/rero-ils-ui/pull/1269) (by @Garfield-fr)
- chore: layout enhancement [\#1266](https://github.com/rero/rero-ils-ui/pull/1266) (by @Garfield-fr)
- chore(theme): change color for header and menu backgrounds [\#1264](https://github.com/rero/rero-ils-ui/pull/1264) (by @PascalRepond)
- chore(holdings/items): primeng + tailwind [\#1263](https://github.com/rero/rero-ils-ui/pull/1263) (by @Garfield-fr)
- chore(patron): patron profile primeng + tailwind [\#1262](https://github.com/rero/rero-ils-ui/pull/1262) (by @Garfield-fr)
- chore: personalize the error page [\#1261](https://github.com/rero/rero-ils-ui/pull/1261) (by @Garfield-fr)
- chore(acquistion): primeng and tailwindcss [\#1260](https://github.com/rero/rero-ils-ui/pull/1260) (by @Garfield-fr)
- chore: upgrade to angular 19 [\#1258](https://github.com/rero/rero-ils-ui/pull/1258) (by @jma)
- chore: improvements and fixes [\#1254](https://github.com/rero/rero-ils-ui/pull/1254) (by @Garfield-fr)
- chore: improvements and fixes [\#1250](https://github.com/rero/rero-ils-ui/pull/1250) (by @Garfield-fr)

## [v17.2.1](https://github.com/rero/rero-ils-ui/tree/v17.2.1) (2024-12-04)

[Full Changelog](https://github.com/rero/rero-ils-ui/compare/v17.2.0...v17.2.1)

**Other changes:**

- various: fix some display problems [\#1220](https://github.com/rero/rero-ils-ui/pull/1220) (by @rerowep)

## [v17.2.0](https://github.com/rero/rero-ils-ui/tree/v17.2.0) (2024-10-25)

[Full Changelog](https://github.com/rero/rero-ils-ui/compare/v17.1.1...v17.2.0)

**New features:**

- migrations: create the migration module [\#1208](https://github.com/rero/rero-ils-ui/pull/1208) (by @jma)
- feat(circulation): enhance enumeration and chronology display [\#1194](https://github.com/rero/rero-ils-ui/pull/1194) (by @PascalRepond)

**Enhancements:**

- refactor(entity): add identifiedBy on all ressources [\#1196](https://github.com/rero/rero-ils-ui/pull/1196) (by @Garfield-fr)

**Fixes:**

- fix(entities): add fields in pro detailed view [\#1195](https://github.com/rero/rero-ils-ui/pull/1195) (by @PascalRepond)
- fix(thumbnail): display by isbn if no link [\#1205](https://github.com/rero/rero-ils-ui/pull/1205) (by @Garfield-fr)

## [v17.1.1](https://github.com/rero/rero-ils-ui/tree/v17.1.1) (2024-08-26)

[Full Changelog](https://github.com/rero/rero-ils-ui/compare/v17.1.0...v17.1.1)

**Enhancements:**

- production: add old browser support for the public interface [\#1190](https://github.com/rero/rero-ils-ui/pull/1190) (by @jma)

## [v17.1.0](https://github.com/rero/rero-ils-ui/tree/v17.1.0) (2024-08-12)

[Full Changelog](https://github.com/rero/rero-ils-ui/compare/v17.0.1...v17.1.0)

**New features:**

- fix(detailed cipo): display automatic renewal [\#1184](https://github.com/rero/rero-ils-ui/pull/1184) (by @PascalRepond)
- feat(circulation): automatic renewals [\#1177](https://github.com/rero/rero-ils-ui/pull/1177) (by @PascalRepond)

**Fixes:**

- fix(circ): error when no item note [\#1189](https://github.com/rero/rero-ils-ui/pull/1189) (by @PascalRepond)
- acquisition editor: fix missing initial value in the account select [\#1186](https://github.com/rero/rero-ils-ui/pull/1186) (by @jma)
- fix: update ngx-formly [\#1185](https://github.com/rero/rero-ils-ui/pull/1185) (by @PascalRepond)

## [v17.0.1](https://github.com/rero/rero-ils-ui/tree/v17.0.1) (2024-06-06)

**Fixes:**

- chore: update ngx-formly to the version 6.3.2 [\#1180](https://github.com/rero/rero-ils-ui/pull/1180) (by @Garfield-fr)

## [v17.0.0](https://github.com/rero/rero-ils-ui/tree/v17.0.0) (2024-06-03)

[Full Changelog](https://github.com/rero/rero-ils-ui/compare/v14.7.3...v17.0.0)

**New features:**

- aggregation: change for isFiction [\#1132](https://github.com/rero/rero-ils-ui/pull/1132) & [\#1167](https://github.com/rero/rero-ils-ui/pull/1167) (by @rerowep)
- Us 2172 files [\#1168](https://github.com/rero/rero-ils-ui/pull/1168) (by @jma)
- feat(item): add fees on item detail view [\#1151](https://github.com/rero/rero-ils-ui/pull/1151) (by @Garfield-fr)
- feat(acquisition): select/deselect lines [\#1129](https://github.com/rero/rero-ils-ui/pull/1129) (by @Garfield-fr)

**Enhancements:**

- fix(items): restore legacy checkout count [\#1174](https://github.com/rero/rero-ils-ui/pull/1174) (by @PascalRepond)
- feat(circulation): add informations message [\#1146](https://github.com/rero/rero-ils-ui/pull/1146) (by @Garfield-fr)
- feat(circulation): add message on alert [\#1142](https://github.com/rero/rero-ils-ui/pull/1142) (by @Garfield-fr)
- feat(circulation): add temporary location name [\#1133](https://github.com/rero/rero-ils-ui/pull/1133) (by @Garfield-fr)
- feat(circulation): display check-in note [\#1130](https://github.com/rero/rero-ils-ui/pull/1130) (by @Garfield-fr)
- chore(item): delete legacy fields [\#1165](https://github.com/rero/rero-ils-ui/pull/1165) (by @PascalRepond)
- chore(permissions): item and holdings [\#1152](https://github.com/rero/rero-ils-ui/pull/1152) (by @Garfield-fr)
- chore(menu): add query params on some routes [\#1136](https://github.com/rero/rero-ils-ui/pull/1136) (by @Garfield-fr)
- feat: detail views enhancements [\#1135](https://github.com/rero/rero-ils-ui/pull/1135) (by @Garfield-fr)

**Fixes:**

- fix(patron profile): multi-organisation selector [\#1179](https://github.com/rero/rero-ils-ui/pull/1179) (by @PascalRepond)
- fix(fiction): makes the facet higher and open [\#1178](https://github.com/rero/rero-ils-ui/pull/1178) (by @PascalRepond)
- fix(patron): ill request count [\#1176](https://github.com/rero/rero-ils-ui/pull/1176) (by @PascalRepond)
- fix(editor): item switch location [\#1173](https://github.com/rero/rero-ils-ui/pull/1174) (by @Garfield-fr)
- fix(editor): entity typeahead clear value [\#1166](https://github.com/rero/rero-ils-ui/pull/1166) (by @Garfield-fr)
- fix(document): import with many identifiers [\#1155](https://github.com/rero/rero-ils-ui/pull/1155) (by @Garfield-fr)
- fix(editor): fix the new syntax of hodlings [\#1163](https://github.com/rero/rero-ils-ui/pull/1163) (by @Garfield-fr)
- fix: incorrect wording in item component [\#1158](https://github.com/rero/rero-ils-ui/pull/1158) (by @PascalRepond)
- fix(document): language facet translation [\#1149](https://github.com/rero/rero-ils-ui/pull/1149) (by @Garfield-fr)
- fix(ill): add filter parameter [\#1145](https://github.com/rero/rero-ils-ui/pull/1145) (by @Garfield-fr)
- fix(editor): use the new process json schema [\#1150](https://github.com/rero/rero-ils-ui/pull/1150) (by @Garfield-fr)
- fix(filter): add a new key for translation [\#1154](https://github.com/rero/rero-ils-ui/pull/1154) (by @Garfield-fr)
- fix(fee): form options on add manual fee [\#1153](https://github.com/rero/rero-ils-ui/pull/1153) (by @Garfield-fr)
- fix(inventory list): remove default lib filter [\#1144](https://github.com/rero/rero-ils-ui/pull/1144) (by @PascalRepond)
- fix(permission): missing collections message [\#1131](https://github.com/rero/rero-ils-ui/pull/1131) (by @Garfield-fr)
- fix(document): availability [\#1134](https://github.com/rero/rero-ils-ui/pull/1134) (by @Garfield-fr)

**Other changes:**

- chore: update dependencies [\#1139](https://github.com/rero/rero-ils-ui/pull/1139) (by @Garfield-fr)
- chore: upgrade Angular 17 and Formly v6 [\#1115](https://github.com/rero/rero-ils-ui/pull/1115) (by @Garfield-fr)

## [v14.7.3](https://github.com/rero/rero-ils-ui/tree/v14.7.3) (2024-02-28)

[Full Changelog](https://github.com/rero/rero-ils-ui/compare/v14.7.2...v14.7.3)

**Fixes:**

- fix(circulation): no loan info on receive [\#1124](https://github.com/rero/rero-ils-ui/pull/1124) (by @jma & @PascalRepond)

## [v14.7.2](https://github.com/rero/rero-ils-ui/tree/v14.7.2) (2024-02-21)

[Full Changelog](https://github.com/rero/rero-ils-ui/compare/v14.7.1...v14.7.2)

**Fixes:**

- fix(aggregation): add translate for claims count [\#1121](https://github.com/rero/rero-ils-ui/pull/1121) (by @Garfield-fr)

## [v14.7.1](https://github.com/rero/rero-ils-ui/tree/v14.7.1) (2024-02-20)

[Full Changelog](https://github.com/rero/rero-ils-ui/compare/v14.7.0...v14.7.1)

**Fixes:**

- fix(aggregation): don't translate default facet [\#1118](https://github.com/rero/rero-ils-ui/pull/1118) (by @Garfield-fr)

## [v14.7.0](https://github.com/rero/rero-ils-ui/tree/v14.7.0) (2024-02-15)

[Full Changelog](https://github.com/rero/rero-ils-ui/compare/v14.6.0...v14.7.0)

**New features:**

- document: implement advanced search [\#1069](https://github.com/rero/rero-ils-ui/pull/1069) (by @Garfield-fr)
- feat(documents): hide related entities tab [\#1099](https://github.com/rero/rero-ils-ui/pull/1099) (by @Garfield-fr)
- document: add acquisition aggregation [\#1076](https://github.com/rero/rero-ils-ui/pull/1076) (by @Garfield-fr)
- circulation: item on check-in list without loan [\#1085](https://github.com/rero/rero-ils-ui/pull/1085) (by @Garfield-fr)
- circulation: add sort on location (checkout) [\#1086](https://github.com/rero/rero-ils-ui/pull/1086) (by @Garfield-fr)
- patron: add blocked and expired filters [\#1088](https://github.com/rero/rero-ils-ui/pull/1088) (by @Garfield-fr)

**Enhancements:**

- acquisition: displaying more document information [\#1062](https://github.com/rero/rero-ils-ui/pull/1062) (by @lauren-d)
- acquisition: add sort config [\#1063](https://github.com/rero/rero-ils-ui/pull/1063) (by @lauren-d)
- entities: some improve navigation and links [\#1081](https://github.com/rero/rero-ils-ui/pull/1081) (by @Garfield-fr)
- chore: implement new handle error service [\#1094](https://github.com/rero/rero-ils-ui/pull/1094) (by @Garfield-fr)

**Fixes:**

- patron: fix total pending requests number [\#1095](https://github.com/rero/rero-ils-ui/pull/1095) (by @PascalRepond)
- ill requests: adapt facet label [\#1096](https://github.com/rero/rero-ils-ui/pull/1096) (by @PascalRepond)
- translations: fix untranslated notif setting [\#1092](https://github.com/rero/rero-ils-ui/pull/1092) (by @PascalRepond)
- circulation: fix patron history [\#1084](https://github.com/rero/rero-ils-ui/pull/1084) (by @Garfield-fr)
- aggregation: fix library filter facet [\#1091](https://github.com/rero/rero-ils-ui/pull/1091) (by @Garfield-fr)

**Other changes:**

- chore: upgrade to node v16 [\#1098](https://github.com/rero/rero-ils-ui/pull/1098) (by @Garfield-fr)
- documents: refactoring action buttons [\#1090](https://github.com/rero/rero-ils-ui/pull/1090) (by @Garfield-fr)
- dependencies: update [\#1108](https://github.com/rero/rero-ils-ui/pull/1108) (by @PascalRepond)

## [v14.6.0](https://github.com/rero/rero-ils-ui/tree/v14.6.0) (2023-11-21)

[Full Changelog](https://github.com/rero/rero-ils-ui/compare/v14.5.0...v14.6.0)

**New features:**

- New statistics module UI [\#1077](https://github.com/rero/rero-ils-ui/pull/1077) (by @jma)

**Enhancements:**

- menus: add new icons [\#1073](https://github.com/rero/rero-ils-ui/pull/1073) (by @PascalRepond)
- ill requests: improve pro patron view [\#1070](https://github.com/rero/rero-ils-ui/pull/1070) (by @PascalRepond)

**Fixes:**

- libraries: add editor validation [\#1082](https://github.com/rero/rero-ils-ui/pull/1082) (by @jma)
- documents: fix notes display [\#1075](https://github.com/rero/rero-ils-ui/pull/1075) (by @Garfield-fr)
- circulation: fix checkin patron info [\#1072](https://github.com/rero/rero-ils-ui/pull/1072) (by @PascalRepond)
- patron: fix display of optional address fields [\#1056](https://github.com/rero/rero-ils-ui/pull/1056) (by @Garfield-fr)
- library switch: always show the menu [\#1058](https://github.com/rero/rero-ils-ui/pull/1058) (by @Garfield-fr)
- library switch: fix switch on mobile [\#1059](https://github.com/rero/rero-ils-ui/pull/1059) (by @Garfield-fr)
- entity detailed view: uniformize icon placement [\#1071](https://github.com/rero/rero-ils-ui/pull/1071) (by @PascalRepond)
- github actions: fix labeler [\#1089](https://github.com/rero/rero-ils-ui/pull/1089) (by @PascalRepond)

## [v14.5.0](https://github.com/rero/rero-ils-ui/tree/v14.5.0) (2023-10-10)

[Full Changelog](https://github.com/rero/rero-ils-ui/compare/v14.4.0...v14.5.0)

**New features:**

- Add local entities [\#1037](https://github.com/rero/rero-ils-ui/pull/1037) (by @zannkukai)
- entities: add place and temporal display [\#1046](https://github.com/rero/rero-ils-ui/pull/1046) (by @Garfield-fr)

**Enhancements:**

- Improve performance [\#1044](https://github.com/rero/rero-ils-ui/pull/1044) (by @Garfield-fr)
- items: sorting for standard holdings [\#1038](https://github.com/rero/rero-ils-ui/pull/1038) (by @Garfield-fr)
- document: improved display of genre form field [\#1032](https://github.com/rero/rero-ils-ui/pull/1032) (by @Garfield-fr)
- editor: add icon type on entity typeahead [\#1050](https://github.com/rero/rero-ils-ui/pull/1050) (by @Garfield-fr)
- circulation: add pickup name on checkin [\#1036](https://github.com/rero/rero-ils-ui/pull/1036) (by @Garfield-fr)
- ILL Request: better display into patron circulation [\#1018](https://github.com/rero/rero-ils-ui/pull/1018) (by @zannkukai)

**Fixes:**

- entities: fix sources order by language [\#1068](https://github.com/rero/rero-ils-ui/pull/1068) (by @Garfield-fr)
- entities: fix source search button [\#1067](https://github.com/rero/rero-ils-ui/pull/1067) (by @Garfield-fr)
- fix: certain texts get unselected on keystroke [\#1033](https://github.com/rero/rero-ils-ui/pull/1033) (by @Garfield-fr)
- history: fix duplicate records [\#1047](https://github.com/rero/rero-ils-ui/pull/1047) (by @Garfield-fr)
- fix: display manual overdue [\#1034](https://github.com/rero/rero-ils-ui/pull/1034) (by @Garfield-fr)
- library: fix communication language on add [\#1051](https://github.com/rero/rero-ils-ui/pull/1051) (by @Garfield-fr)
- item: update status after request [\#1039](https://github.com/rero/rero-ils-ui/pull/1039) (by @Garfield-fr)
- circulation: fix patron barcode [\#1045](https://github.com/rero/rero-ils-ui/pull/1045) (by @Garfield-fr)
- fix: help shortcut [\#1035](https://github.com/rero/rero-ils-ui/pull/1035) (by @Garfield-fr)
- fees: fix error on display [\#1040](https://github.com/rero/rero-ils-ui/pull/1040) (by @Garfield-fr)
- document: fix expand to global view [\#1042](https://github.com/rero/rero-ils-ui/pull/1042) (by @Garfield-fr)
- shared: enable translations [\#1052](https://github.com/rero/rero-ils-ui/pull/1052) (by @jma)
- operation history: fix pickup location label [\#1031](https://github.com/rero/rero-ils-ui/pull/1031) (by @PascalRepond)
- issues: fix status display into holding detail view [\#1016](https://github.com/rero/rero-ils-ui/pull/1016) (by @zannkukai)
- translations: add missing menu manual translation [\#1022](https://github.com/rero/rero-ils-ui/pull/1022) (by @PascalRepond)
- circulation: fix item properties access on item view [\#1019](https://github.com/rero/rero-ils-ui/pull/1019) (by @zannkukai)

## [v14.4.0](https://github.com/rero/rero-ils-ui/tree/v14.4.0) (2023-07-13)

[Full Changelog](https://github.com/rero/rero-ils-ui/compare/v14.3.0...v14.4.0)

**New features:**

- editor: add can deactivate guard [\#1000](https://github.com/rero/rero-ils-ui/pull/1000) (by @Garfield-fr)
- patron profile: show overdue preview fees [\#1001](https://github.com/rero/rero-ils-ui/pull/1001) (by @Garfield-fr)
- user: default active library [\#995](https://github.com/rero/rero-ils-ui/pull/995) (by @Garfield-fr)
- http: add current_library parameter on api call [\#996](https://github.com/rero/rero-ils-ui/pull/996) (by @Garfield-fr)
- Add claim mechanism for periodical issues [\#998](https://github.com/rero/rero-ils-ui/pull/998) (by @zannkukai)
- circulation: remember fixed date checkout [\#991](https://github.com/rero/rero-ils-ui/pull/991) (by @Garfield-fr)
- circulation: add ill requests tab [\#978](https://github.com/rero/rero-ils-ui/pull/978) (by @Garfield-fr)

**Enhancements:**

- fees: add invoice payment method [\#997](https://github.com/rero/rero-ils-ui/pull/997) (by @PascalRepond)
- item: delete the default value [\#977](https://github.com/rero/rero-ils-ui/pull/977) (by @Garfield-fr)
- keyboard shortcuts: add inventory list hotkey [\#992](https://github.com/rero/rero-ils-ui/pull/992) (by @PascalRepond)

**Fixes:**

- holdings: issue creation permission management [\#999](https://github.com/rero/rero-ils-ui/pull/999) (by @zannkukai)
- patron profile: fix bug on contributions [\#1002](https://github.com/rero/rero-ils-ui/pull/1002) (by @Garfield-fr)
- item: add circulation information [\#976](https://github.com/rero/rero-ils-ui/pull/976) (by @Garfield-fr)

## [v14.3.0](https://github.com/rero/rero-ils-ui/tree/v14.3.0) (2023-05-16)

[Full Changelog](https://github.com/rero/rero-ils-ui/compare/v14.2.0...v14.3.0)

**New features:**

- entity: use entity instead of contribution [\#941](https://github.com/rero/rero-ils-ui/pull/941) (by @Garfield-fr)
- entities: improves entities management [\#975](https://github.com/rero/rero-ils-ui/pull/975) (by @zannkukai)

## [v14.2.0](https://github.com/rero/rero-ils-ui/tree/v14.2.0) (2023-05-10)

[Full Changelog](https://github.com/rero/rero-ils-ui/compare/v14.1.1...v14.2.0)

**New features:**

- item operation history: add statistics [\#974](https://github.com/rero/rero-ils-ui/pull/974) (by @Garfield-fr)
- operation log: add library name after operator [\#972](https://github.com/rero/rero-ils-ui/pull/972) (by @Garfield-fr)
- ill request: ill pickup name [\#968](https://github.com/rero/rero-ils-ui/pull/968) (by @Garfield-fr)
- patron profile: fix tooltip message on extend [\#963](https://github.com/rero/rero-ils-ui/pull/963) (by @Garfield-fr)
- item circulation history: add notification [\#962](https://github.com/rero/rero-ils-ui/pull/962) (by @Garfield-fr)

**Enhancements:**

- inventory list: add descending sorting [\#969](https://github.com/rero/rero-ils-ui/pull/969) (by @Garfield-fr)
- circulation: add cancel request on pending tag [\#973](https://github.com/rero/rero-ils-ui/pull/973) (by @Garfield-fr)
- library switch menu: fix sort by name [\#970](https://github.com/rero/rero-ils-ui/pull/970) (by @Garfield-fr)

**Fixes:**

- items: increase permission scope [\#966](https://github.com/rero/rero-ils-ui/pull/966) (by @zannkukai)
- items: update default sort for serial holding to `issue_sort_date` [\#965](https://github.com/rero/rero-ils-ui/pull/965) (by @zannkukai)
- Transactions: fix transactions total amount calculation [\#961](https://github.com/rero/rero-ils-ui/pull/961) (by @zannkukai)
- circulation: fix fixed date sunday not disabled [\#971](https://github.com/rero/rero-ils-ui/pull/971) (by @Garfield-fr)
- menus: add missing translation [\#964](https://github.com/rero/rero-ils-ui/pull/964) (by @PascalRepond)
- translations: add missing translate attribute [\#959](https://github.com/rero/rero-ils-ui/pull/959) (by @PascalRepond)
- circulation: fix clear patron button display [\#949](https://github.com/rero/rero-ils-ui/pull/949) (by @zannkukai)
- documents: default search filters on resource search input [\#938](https://github.com/rero/rero-ils-ui/pull/938) (by @zannkukai)

**Other changes:**

- dependencies: update [\#960](https://github.com/rero/rero-ils-ui/pull/960) (by @rerowep)

## [v14.1.1](https://github.com/rero/rero-ils-ui/tree/v14.1.1) (2023-03-20)

[Full Changelog](https://github.com/rero/rero-ils-ui/compare/v14.1.0...v14.1.1)

**Fixes:**

- patron: fix the display of the badges on brief view [\#955](https://github.com/rero/rero-ils-ui/pull/955) (by @Garfield-fr)
- circulation: fix password change on patron profile [\#953](https://github.com/rero/rero-ils-ui/pull/953) (by @Garfield-fr)
- profile: fix translations on change password form [\#954](https://github.com/rero/rero-ils-ui/pull/954) (by @Garfield-fr)
- translations: fix string translation i18n pipe [\#951](https://github.com/rero/rero-ils-ui/pull/951) (by @Garfield-fr)

## [v14.1.0](https://github.com/rero/rero-ils-ui/tree/v14.1.0) (2023-02-28)

[Full Changelog](https://github.com/rero/rero-ils-ui/compare/v14.0.1...v14.1.0)

**New features:**

- Add permissions [\#937](https://github.com/rero/rero-ils-ui/pull/937) (by @zannkukai)
- inventory: current pending requests [\#930](https://github.com/rero/rero-ils-ui/pull/930) (by @Garfield-fr)
- user: password validator [\#915](https://github.com/rero/rero-ils-ui/pull/915) (by @Garfield-fr)
- circulation: add manuel fee [\#917](https://github.com/rero/rero-ils-ui/pull/917) (by @Garfield-fr)

**Fixes:**

- circulation: fix manual fee modal dialog [\#940](https://github.com/rero/rero-ils-ui/pull/940) (by @zannkukai)
- library: fix editor [\#935](https://github.com/rero/rero-ils-ui/pull/935) (by @zannkukai)
- menu: fix generate menu with variables [\#939](https://github.com/rero/rero-ils-ui/pull/939) (by @Garfield-fr)
- local_fields: fix local fields orders [\#905](https://github.com/rero/rero-ils-ui/pull/905) (by @zannkukai)
- issues: fix issue sorting [\#932](https://github.com/rero/rero-ils-ui/pull/932) (by @zannkukai)

**Other changes:**

- dev: add better support of `npm link` [\#929](https://github.com/rero/rero-ils-ui/pull/929) (by @jma)

## [v14.0.1](https://github.com/rero/rero-ils-ui/tree/v14.0.1) (2023-01-13)

[Full Changelog](https://github.com/rero/rero-ils-ui/compare/v14.0.0...v14.0.1)

**Fixes:**

- Fees: fix labels for missing data [\#925](https://github.com/rero/rero-ils-ui/pull/925) (by @zannkukai)
- items: url opens in a new tab [\#923](https://github.com/rero/rero-ils-ui/pull/923) (by @PascalRepond)
- patron history: fix contributions display [\#924](https://github.com/rero/rero-ils-ui/pull/924) (by @Garfield-fr)

## [v14.0.0](https://github.com/rero/rero-ils-ui/tree/v14.0.0) (2022-12-19)

[Full Changelog](https://github.com/rero/rero-ils-ui/compare/v0.25.0...v14.0.0)

**New features:**

- Fees: Fee brief view [\#912](https://github.com/rero/rero-ils-ui/pull/912) (by @zannkukai)
- Add rollover settings [\#918](https://github.com/rero/rero-ils-ui/pull/918) (by @zannkukai & @Garfield-fr)

**Enhancements:**

- documents: add linked documents button [\#893](https://github.com/rero/rero-ils-ui/pull/893) (by @Garfield-fr)
- document: improve import control [\#899](https://github.com/rero/rero-ils-ui/pull/899) (by @Garfield-fr)
- circulation: add link to patron name [\#894](https://github.com/rero/rero-ils-ui/pull/894) (by @Garfield-fr)

**Fixes:**

- document: open electronicLocator in new tab [\#909](https://github.com/rero/rero-ils-ui/pull/909) (by @PascalRepond)
- search result: show facets on no result found [\#901](https://github.com/rero/rero-ils-ui/pull/901) (by @Garfield-fr)
- holdings: fix display in small screens [\#892](https://github.com/rero/rero-ils-ui/pull/892) (by @Garfield-fr)
- patron profile: fix wrong url on the contributor [\#897](https://github.com/rero/rero-ils-ui/pull/897) (by @Garfield-fr)
- document: filter on the remote typeahead [\#898](https://github.com/rero/rero-ils-ui/pull/898) (by @Garfield-fr)

**Changes:**

- devel: add keep alive header for proxy [\#916](https://github.com/rero/rero-ils-ui/pull/916) (by @jma)
- dependencies: upgrade to angular 14 [\#903](https://github.com/rero/rero-ils-ui/pull/903) (by @jma)

## [v0.25.0](https://github.com/rero/rero-ils-ui/tree/v0.25.0) (2022-09-06)

[Full Changelog](https://github.com/rero/rero-ils-ui/compare/v0.24.0...v0.25.0)

**Changes:**

- documents: formatting of the title variant [\#895](https://github.com/rero/rero-ils-ui/pull/895) (by @Garfield-fr)
- menu: translation for current loans [\#891](https://github.com/rero/rero-ils-ui/pull/891) (by @Garfield-fr)
- Loans: loans brief view [\#879](https://github.com/rero/rero-ils-ui/pull/879) (by @zannkukai)
- merge US-Acquisition-export [\#886](https://github.com/rero/rero-ils-ui/pull/886) (by @lauren-d)
- acquisitions: fix message info on order line edit button [\#875](https://github.com/rero/rero-ils-ui/pull/875) (by @lauren-d)
- document: fix collection display [\#885](https://github.com/rero/rero-ils-ui/pull/885) (by @jma)
- documents: open aggregation with filters and add more facets for documents search [\#867](https://github.com/rero/rero-ils-ui/pull/867) (by @vgranata)
- documents: Improved display of the request button on the holdings [\#883](https://github.com/rero/rero-ils-ui/pull/883) (by @Garfield-fr)
- circulation: add call-numbers on loan circulation information. [\#884](https://github.com/rero/rero-ils-ui/pull/884) (by @zannkukai)
- acquisition: rollover [\#880](https://github.com/rero/rero-ils-ui/pull/880) (by @Garfield-fr)
- templates: update footer info [\#882](https://github.com/rero/rero-ils-ui/pull/882) (by @PascalRepond)

## [v0.24.0](https://github.com/rero/rero-ils-ui/tree/v0.24.0) (2022-07-08)

[Full Changelog](https://github.com/rero/rero-ils-ui/compare/v0.23.0...v0.24.0)

**Changes:**

- holdings: small ui fix [\#858](https://github.com/rero/rero-ils-ui/pull/858) (by @PascalRepond)
- documents: fix the thumbnail size on different devices [\#877](https://github.com/rero/rero-ils-ui/pull/877) (by @Garfield-fr)
- library switch menu: fix storage current library [\#876](https://github.com/rero/rero-ils-ui/pull/876) (by @Garfield-fr)
- documents: export records [\#848](https://github.com/rero/rero-ils-ui/pull/848) (by @lauren-d)
- fix: extract missing translation [\#871](https://github.com/rero/rero-ils-ui/pull/871) (by @PascalRepond)
- guard: fix tests on CanAccessGuard [\#869](https://github.com/rero/rero-ils-ui/pull/869) (by @Garfield-fr)
- document: fix size of the thumbnail on mobile brief view [\#868](https://github.com/rero/rero-ils-ui/pull/868) (by @Garfield-fr)
- editor: adapt code to new widget structure on jsonschema [\#835](https://github.com/rero/rero-ils-ui/pull/835) (by @Garfield-fr)
- translations: fix missing request translation [\#865](https://github.com/rero/rero-ils-ui/pull/865) (by @PascalRepond)
- forms: add email validation behavior [\#861](https://github.com/rero/rero-ils-ui/pull/861) (by @zannkukai)
- requests: add location/pickup-location sort criteria. [\#859](https://github.com/rero/rero-ils-ui/pull/859) (by @zannkukai)
- document: `identifiedBy` duplicate check. [\#855](https://github.com/rero/rero-ils-ui/pull/855) (by @zannkukai)
- general: fix error 400 bad request [\#864](https://github.com/rero/rero-ils-ui/pull/864) (by @Garfield-fr)
- general: Safe URL pipe [\#857](https://github.com/rero/rero-ils-ui/pull/857) (by @zannkukai)
- notification_types: mark missing translation [\#856](https://github.com/rero/rero-ils-ui/pull/856) (by @PascalRepond)
- circulation: display due date at checkin [\#827](https://github.com/rero/rero-ils-ui/pull/827) (by @vgranata)

## [v0.23.0](https://github.com/rero/rero-ils-ui/tree/v0.23.0) (2022-05-16)

[Full Changelog](https://github.com/rero/rero-ils-ui/compare/v0.22.1...v0.23.0)

**Other changes:**

- patron view: fix missing translations [\#851](https://github.com/rero/rero-ils-ui/pull/851) (by @PascalRepond)
- translations: fix missing translations [\#845](https://github.com/rero/rero-ils-ui/pull/845) (by @PascalRepond)
- library: 'at_desk' notification [\#831](https://github.com/rero/rero-ils-ui/pull/831) (by @zannkukai)
- document: subject subdivisions display [\#828](https://github.com/rero/rero-ils-ui/pull/828) (by @zannkukai)
- patron: improve patron profile [\#833](https://github.com/rero/rero-ils-ui/pull/833) (by @zannkukai)
- document: improve isbn and issn check [\#847](https://github.com/rero/rero-ils-ui/pull/847) (by @Garfield-fr)
- holdings: new 'access note' note type. [\#841](https://github.com/rero/rero-ils-ui/pull/841) (by @zannkukai)
- Circulation: allow extend all items button [\#844](https://github.com/rero/rero-ils-ui/pull/844) (by @zannkukai)
- circulation: enter patron barcode when checkin form contains items [\#834](https://github.com/rero/rero-ils-ui/pull/834) (by @vgranata)
- transactions: better transactions history display. [\#842](https://github.com/rero/rero-ils-ui/pull/842) (by @zannkukai)
- holdings: allow new line for `enumerationAndChronology` field [\#837](https://github.com/rero/rero-ils-ui/pull/837) (by @zannkukai)

## [v0.22.1](https://github.com/rero/rero-ils-ui/tree/v0.22.1) (2022-04-11)

**Changes:**

- Fixed an an error in node package publication

[Full Changelog](https://github.com/rero/rero-ils-ui/compare/v0.22.0...v0.22.1)

## [v0.22.0](https://github.com/rero/rero-ils-ui/tree/v0.22.0) (2022-04-04)

[Full Changelog](https://github.com/rero/rero-ils-ui/compare/v0.21.1...v0.22.0)

**Fixed bugs:**

- import: fix check of duplicates during import from the web [\#807](https://github.com/rero/rero-ils-ui/pull/807) [[f: professional ui](https://github.com/rero/rero-ils-ui/labels/f:%20professional%20ui)] ([benerken](https://github.com/benerken))

**Merged pull requests:**

- items: fix request of item in detail view [\#838](https://github.com/rero/rero-ils-ui/pull/838) ([vgranata](https://github.com/vgranata))
- documents: fix display of serial items for other organisations [\#836](https://github.com/rero/rero-ils-ui/pull/836) ([vgranata](https://github.com/vgranata))
- circulation: disambiguate checkout error message [\#825](https://github.com/rero/rero-ils-ui/pull/825) [[f: professional ui](https://github.com/rero/rero-ils-ui/labels/f:%20professional%20ui)] [[f: circulation](https://github.com/rero/rero-ils-ui/labels/f:%20circulation)] [[f: user management](https://github.com/rero/rero-ils-ui/labels/f:%20user%20management)] ([PascalRepond](https://github.com/PascalRepond))
- patron profile: change the number of loans to 20 [\#824](https://github.com/rero/rero-ils-ui/pull/824) [[f: circulation](https://github.com/rero/rero-ils-ui/labels/f:%20circulation)] [[f: public ui](https://github.com/rero/rero-ils-ui/labels/f:%20public%20ui)] [[f: user management](https://github.com/rero/rero-ils-ui/labels/f:%20user%20management)] ([Garfield-fr](https://github.com/Garfield-fr))
- documents: add order on holdings/items [\#823](https://github.com/rero/rero-ils-ui/pull/823) [[f: public ui](https://github.com/rero/rero-ils-ui/labels/f:%20public%20ui)] ([Garfield-fr](https://github.com/Garfield-fr))
- documentation: improve changelog generation and labeler [\#821](https://github.com/rero/rero-ils-ui/pull/821) ([PascalRepond](https://github.com/PascalRepond))
- patron: select the current profile view [\#801](https://github.com/rero/rero-ils-ui/pull/801) [[f: professional ui](https://github.com/rero/rero-ils-ui/labels/f:%20professional%20ui)] [[f: public ui](https://github.com/rero/rero-ils-ui/labels/f:%20public%20ui)] [[f: user management](https://github.com/rero/rero-ils-ui/labels/f:%20user%20management)] ([Garfield-fr](https://github.com/Garfield-fr))
- Merge US holding request to staging [\#777](https://github.com/rero/rero-ils-ui/pull/777) [[f: professional ui](https://github.com/rero/rero-ils-ui/labels/f:%20professional%20ui)] [[f: circulation](https://github.com/rero/rero-ils-ui/labels/f:%20circulation)] [[f: public ui](https://github.com/rero/rero-ils-ui/labels/f:%20public%20ui)] ([vgranata](https://github.com/vgranata))
- patron profile: add sort by due date [\#774](https://github.com/rero/rero-ils-ui/pull/774) [[f: circulation](https://github.com/rero/rero-ils-ui/labels/f:%20circulation)] [[f: public ui](https://github.com/rero/rero-ils-ui/labels/f:%20public%20ui)] [[f: user management](https://github.com/rero/rero-ils-ui/labels/f:%20user%20management)] ([vgranata](https://github.com/vgranata))

## [v0.21.1](https://github.com/rero/rero-ils-ui/tree/v0.21.1) (2022-02-24)

[Full Changelog](https://github.com/rero/rero-ils-ui/compare/v0.21.0...v0.21.1)

**Merged pull requests:**

- holdings: fix detailed view for issue items. [\#815](https://github.com/rero/rero-ils-ui/pull/815) ([zannkukai](https://github.com/zannkukai))
- holdings: fix item collapsing [\#814](https://github.com/rero/rero-ils-ui/pull/814) ([zannkukai](https://github.com/zannkukai))
- document: move edition statement into brief view [\#813](https://github.com/rero/rero-ils-ui/pull/813) ([zannkukai](https://github.com/zannkukai))
- cir policy: fix detailed view [\#812](https://github.com/rero/rero-ils-ui/pull/812) ([jma](https://github.com/jma))
- item: add organisation filter [\#810](https://github.com/rero/rero-ils-ui/pull/810) ([Garfield-fr](https://github.com/Garfield-fr))

## [v0.21.0](https://github.com/rero/rero-ils-ui/tree/v0.11.0) (2022-02-14)

[Full Changelog](https://github.com/rero/rero-ils-ui/compare/v0.20.0...v0.11.0)

**Merged pull requests:**

- search: fix default sort parameters [\#802](https://github.com/rero/rero-ils-ui/pull/802) ([jma](https://github.com/jma))
- patrons: display patron `creation_date` field [\#800](https://github.com/rero/rero-ils-ui/pull/800) ([zannkukai](https://github.com/zannkukai))
- library: improve library detail view and exception dates management [\#799](https://github.com/rero/rero-ils-ui/pull/799) ([zannkukai](https://github.com/zannkukai))
- V1.7.0 [\#798](https://github.com/rero/rero-ils-ui/pull/798) ([zannkukai](https://github.com/zannkukai))
- holding: display issue brief view as block [\#796](https://github.com/rero/rero-ils-ui/pull/796) ([zannkukai](https://github.com/zannkukai))
- patron_type: display of unpaid subscription limit [\#794](https://github.com/rero/rero-ils-ui/pull/794) ([zannkukai](https://github.com/zannkukai))
- request: display the request time [\#793](https://github.com/rero/rero-ils-ui/pull/793) ([zannkukai](https://github.com/zannkukai))
- document: fix title display on brief view [\#792](https://github.com/rero/rero-ils-ui/pull/792) ([zannkukai](https://github.com/zannkukai))
- circulation policies: fix detail view [\#791](https://github.com/rero/rero-ils-ui/pull/791) ([zannkukai](https://github.com/zannkukai))
- patron: fix some translations [\#787](https://github.com/rero/rero-ils-ui/pull/787) ([zannkukai](https://github.com/zannkukai))
- holdings: fix item collapsing. [\#786](https://github.com/rero/rero-ils-ui/pull/786) ([zannkukai](https://github.com/zannkukai))
- item: fix item availability status. [\#785](https://github.com/rero/rero-ils-ui/pull/785) ([zannkukai](https://github.com/zannkukai))
- items: configure new facets for inventory list [\#773](https://github.com/rero/rero-ils-ui/pull/773) ([lauren-d](https://github.com/lauren-d))
- circ_policies: fix detail view [\#762](https://github.com/rero/rero-ils-ui/pull/762) ([zannkukai](https://github.com/zannkukai))

## [v0.20.0](https://github.com/rero/rero-ils-ui/tree/v0.20.0) (2022-01-12)

[Full Changelog](https://github.com/rero/rero-ils-ui/compare/v0.19.0...v0.20.0)

**Fixed bugs:**

- circulation: fix display patron profile on checkout [\#778](https://github.com/rero/rero-ils-ui/pull/778) ([lauren-d](https://github.com/lauren-d))

**Merged pull requests:**

- acquisition: fix receipt date in order brief view [\#783](https://github.com/rero/rero-ils-ui/pull/783) ([zannkukai](https://github.com/zannkukai))
- circulation: checkin operations when item/patron barcode are identical [\#776](https://github.com/rero/rero-ils-ui/pull/776) ([Garfield-fr](https://github.com/Garfield-fr))
- Merge `US\_acquisition` on `staging` [\#775](https://github.com/rero/rero-ils-ui/pull/775) ([zannkukai](https://github.com/zannkukai))
- dependencies: update ngx-formly to version 5.10.27 [\#771](https://github.com/rero/rero-ils-ui/pull/771) ([Garfield-fr](https://github.com/Garfield-fr))
- patrons: fix display of patron transaction event [\#764](https://github.com/rero/rero-ils-ui/pull/764) ([zannkukai](https://github.com/zannkukai))
- circulation: add debug information panels [\#761](https://github.com/rero/rero-ils-ui/pull/761) ([zannkukai](https://github.com/zannkukai))
- patrons: improve patron detailed view [\#759](https://github.com/rero/rero-ils-ui/pull/759) ([zannkukai](https://github.com/zannkukai))
- users: fix user editor title [\#758](https://github.com/rero/rero-ils-ui/pull/758) ([zannkukai](https://github.com/zannkukai))
- ui: fix language selection [\#753](https://github.com/rero/rero-ils-ui/pull/753) ([jma](https://github.com/jma))
- documents: allow to show other organisations holdings/items [\#749](https://github.com/rero/rero-ils-ui/pull/749) ([Garfield-fr](https://github.com/Garfield-fr))

## [v0.19.0](https://github.com/rero/rero-ils-ui/tree/v0.19.0) (2021-12-09)

[Full Changelog](https://github.com/rero/rero-ils-ui/compare/v0.18.1...v0.19.0)

**Merged pull requests:**

- circulation: fix patron transaction error message. [\#756](https://github.com/rero/rero-ils-ui/pull/756) ([zannkukai](https://github.com/zannkukai))
- operation logs: Fix the window display if no record [\#750](https://github.com/rero/rero-ils-ui/pull/750) ([Garfield-fr](https://github.com/Garfield-fr))
- circulation: add item link on the patron history tab [\#748](https://github.com/rero/rero-ils-ui/pull/748) ([Garfield-fr](https://github.com/Garfield-fr))
- requests: display request expiration date [\#747](https://github.com/rero/rero-ils-ui/pull/747) ([zannkukai](https://github.com/zannkukai))
- import: add new sources to import from the web [\#705](https://github.com/rero/rero-ils-ui/pull/705) ([benerken](https://github.com/benerken))

## [v0.18.1](https://github.com/rero/rero-ils-ui/tree/v0.18.1) (2021-10-28)

[Full Changelog](https://github.com/rero/rero-ils-ui/compare/v0.18.0...v0.18.1)

**Merged pull requests:**

- translations: translate v0.18.1 [\#738](https://github.com/rero/rero-ils-ui/pull/738) ([iGormilhit](https://github.com/iGormilhit))

## [v0.18.0](https://github.com/rero/rero-ils-ui/tree/v0.18.0) (2021-10-27)

[Full Changelog](https://github.com/rero/rero-ils-ui/compare/v0.17.1...v0.18.0)

**Merged pull requests:**

- release: v0.18.0 [\#736](https://github.com/rero/rero-ils-ui/pull/736) ([jma](https://github.com/jma))
- items: fix collection url [\#735](https://github.com/rero/rero-ils-ui/pull/735) ([Garfield-fr](https://github.com/Garfield-fr))
- documents: display electronic holdings [\#734](https://github.com/rero/rero-ils-ui/pull/734) ([jma](https://github.com/jma))
- documents: improve work access point field [\#730](https://github.com/rero/rero-ils-ui/pull/730) ([Garfield-fr](https://github.com/Garfield-fr))
- documents: translate issuance subtype [\#727](https://github.com/rero/rero-ils-ui/pull/727) ([Garfield-fr](https://github.com/Garfield-fr))
- translations: translate v0.18.0 [\#725](https://github.com/rero/rero-ils-ui/pull/725) ([iGormilhit](https://github.com/iGormilhit))
- patrons: use link instead of button for circulation link. [\#720](https://github.com/rero/rero-ils-ui/pull/720) ([zannkukai](https://github.com/zannkukai))
- circulation: fix notifications display [\#719](https://github.com/rero/rero-ils-ui/pull/719) ([zannkukai](https://github.com/zannkukai))
- patron: improve patron detail view [\#718](https://github.com/rero/rero-ils-ui/pull/718) ([zannkukai](https://github.com/zannkukai))
- circulation: restore missing translations [\#716](https://github.com/rero/rero-ils-ui/pull/716) ([Garfield-fr](https://github.com/Garfield-fr))
- search: added sort on some resources [\#704](https://github.com/rero/rero-ils-ui/pull/704) ([Garfield-fr](https://github.com/Garfield-fr))

## [v0.17.1](https://github.com/rero/rero-ils-ui/tree/v0.17.1) (2021-10-06)

[Full Changelog](https://github.com/rero/rero-ils-ui/compare/v0.17.0...v0.17.1)

**Merged pull requests:**

- release: v0.17.1 [\#715](https://github.com/rero/rero-ils-ui/pull/715) ([iGormilhit](https://github.com/iGormilhit))
- circulation: remove loading wheels [\#714](https://github.com/rero/rero-ils-ui/pull/714) ([jma](https://github.com/jma))
- document: fix wrong URL on collection [\#710](https://github.com/rero/rero-ils-ui/pull/710) ([Garfield-fr](https://github.com/Garfield-fr))

## [v0.17.0](https://github.com/rero/rero-ils-ui/tree/v0.17.0) (2021-09-30)

[Full Changelog](https://github.com/rero/rero-ils-ui/compare/v0.16.13...v0.17.0)

**Merged pull requests:**

- release: v0.17.0 [\#713](https://github.com/rero/rero-ils-ui/pull/713) ([iGormilhit](https://github.com/iGormilhit))
- translations: complete v0.17.0 translations [\#712](https://github.com/rero/rero-ils-ui/pull/712) ([iGormilhit](https://github.com/iGormilhit))
- translations: translate v0.17.0 [\#708](https://github.com/rero/rero-ils-ui/pull/708) ([iGormilhit](https://github.com/iGormilhit))
- contributions: remove link on source title [\#695](https://github.com/rero/rero-ils-ui/pull/695) ([Garfield-fr](https://github.com/Garfield-fr))
- circulation: clear input after checkout action [\#694](https://github.com/rero/rero-ils-ui/pull/694) ([Garfield-fr](https://github.com/Garfield-fr))
- fees: add message for delete information [\#688](https://github.com/rero/rero-ils-ui/pull/688) ([Garfield-fr](https://github.com/Garfield-fr))
- patron: improve patron brief view [\#682](https://github.com/rero/rero-ils-ui/pull/682) ([zannkukai](https://github.com/zannkukai))
- documents: display all fields on the detail view [\#679](https://github.com/rero/rero-ils-ui/pull/679) ([Garfield-fr](https://github.com/Garfield-fr))

## [v0.16.13](https://github.com/rero/rero-ils-ui/tree/v0.16.13) (2021-09-09)

[Full Changelog](https://github.com/rero/rero-ils-ui/compare/v0.16.12...v0.16.13)

**Merged pull requests:**

- release: v0.16.13 [\#703](https://github.com/rero/rero-ils-ui/pull/703) ([jma](https://github.com/jma))
- editor: search everywhere for resource linking [\#702](https://github.com/rero/rero-ils-ui/pull/702) ([jma](https://github.com/jma))
- items: add spinner during request process [\#696](https://github.com/rero/rero-ils-ui/pull/696) ([zannkukai](https://github.com/zannkukai))
- issues: late issues filtered by current library [\#693](https://github.com/rero/rero-ils-ui/pull/693) ([zannkukai](https://github.com/zannkukai))
- editor: add ISBN/ISSN on document typeahead [\#687](https://github.com/rero/rero-ils-ui/pull/687) ([Garfield-fr](https://github.com/Garfield-fr))

## [v0.16.12](https://github.com/rero/rero-ils-ui/tree/v0.16.12) (2021-08-26)

[Full Changelog](https://github.com/rero/rero-ils-ui/compare/v0.16.11...v0.16.12)

**Merged pull requests:**

- release: v0.16.12 [\#698](https://github.com/rero/rero-ils-ui/pull/698) ([jma](https://github.com/jma))
- documents: restore item per page setting [\#697](https://github.com/rero/rero-ils-ui/pull/697) ([zannkukai](https://github.com/zannkukai))

## [v0.16.11](https://github.com/rero/rero-ils-ui/tree/v0.16.11) (2021-08-20)

[Full Changelog](https://github.com/rero/rero-ils-ui/compare/v0.16.10...v0.16.11)

**Merged pull requests:**

- search: fix several issues [\#692](https://github.com/rero/rero-ils-ui/pull/692) ([sebdeleze](https://github.com/sebdeleze))

## [v0.16.10](https://github.com/rero/rero-ils-ui/tree/v0.16.10) (2021-08-12)

[Full Changelog](https://github.com/rero/rero-ils-ui/compare/v0.16.9...v0.16.10)

**Merged pull requests:**

- release: v0.16.10 [\#691](https://github.com/rero/rero-ils-ui/pull/691) ([jma](https://github.com/jma))
- translations: translate v0.16.10 [\#690](https://github.com/rero/rero-ils-ui/pull/690) ([jma](https://github.com/jma))
- local fields: improve query result [\#684](https://github.com/rero/rero-ils-ui/pull/684) ([Garfield-fr](https://github.com/Garfield-fr))
- holdings: customize the delete message [\#683](https://github.com/rero/rero-ils-ui/pull/683) ([Garfield-fr](https://github.com/Garfield-fr))
- document: dynamic loading for items informations [\#681](https://github.com/rero/rero-ils-ui/pull/681) ([zannkukai](https://github.com/zannkukai))
- requests: display pickup location name [\#678](https://github.com/rero/rero-ils-ui/pull/678) ([zannkukai](https://github.com/zannkukai))
- ill requests: removes extra parenthesis [\#673](https://github.com/rero/rero-ils-ui/pull/673) ([Garfield-fr](https://github.com/Garfield-fr))
- users: translate the gender [\#670](https://github.com/rero/rero-ils-ui/pull/670) ([Garfield-fr](https://github.com/Garfield-fr))
- search: fix document brief view [\#667](https://github.com/rero/rero-ils-ui/pull/667) ([zannkukai](https://github.com/zannkukai))

## [v0.16.9](https://github.com/rero/rero-ils-ui/tree/v0.16.9) (2021-07-22)

[Full Changelog](https://github.com/rero/rero-ils-ui/compare/v0.16.8...v0.16.9)

## [v0.16.8](https://github.com/rero/rero-ils-ui/tree/v0.16.8) (2021-07-20)

[Full Changelog](https://github.com/rero/rero-ils-ui/compare/v0.16.7...v0.16.8)

**Merged pull requests:**

- documents: optimize holdings/items display [\#671](https://github.com/rero/rero-ils-ui/pull/671) ([zannkukai](https://github.com/zannkukai))

## [v0.16.7](https://github.com/rero/rero-ils-ui/tree/v0.16.7) (2021-07-19)

[Full Changelog](https://github.com/rero/rero-ils-ui/compare/v0.16.6...v0.16.7)

**Merged pull requests:**

- release: v0.16.7 [\#677](https://github.com/rero/rero-ils-ui/pull/677) ([iGormilhit](https://github.com/iGormilhit))
- admin: do not display default result list [\#676](https://github.com/rero/rero-ils-ui/pull/676) ([jma](https://github.com/jma))
- users: close modal by clicking outside the form [\#675](https://github.com/rero/rero-ils-ui/pull/675) ([zannkukai](https://github.com/zannkukai))

## [v0.16.6](https://github.com/rero/rero-ils-ui/tree/v0.16.6) (2021-07-14)

[Full Changelog](https://github.com/rero/rero-ils-ui/compare/v0.16.5...v0.16.6)

**Merged pull requests:**

- release: v0.16.6 [\#674](https://github.com/rero/rero-ils-ui/pull/674) ([iGormilhit](https://github.com/iGormilhit))
- circulation: improve requested loans tab [\#672](https://github.com/rero/rero-ils-ui/pull/672) ([Garfield-fr](https://github.com/Garfield-fr))

## [v0.16.5](https://github.com/rero/rero-ils-ui/tree/v0.16.5) (2021-07-09)

[Full Changelog](https://github.com/rero/rero-ils-ui/compare/v0.16.3...v0.16.5)

## [v0.16.3](https://github.com/rero/rero-ils-ui/tree/v0.16.3) (2021-07-07)

[Full Changelog](https://github.com/rero/rero-ils-ui/compare/v0.15.0...v0.16.3)

**Implemented enhancements:**

- documents: improve display of uniform resource locator [\#645](https://github.com/rero/rero-ils-ui/pull/645) ([Garfield-fr](https://github.com/Garfield-fr))

**Merged pull requests:**

- translations: complete the v1.4.0 translations [\#665](https://github.com/rero/rero-ils-ui/pull/665) ([iGormilhit](https://github.com/iGormilhit))
- documents: fix translation on circulation informations [\#663](https://github.com/rero/rero-ils-ui/pull/663) ([Garfield-fr](https://github.com/Garfield-fr))
- Restores operation logs and transaction history [\#662](https://github.com/rero/rero-ils-ui/pull/662) ([Garfield-fr](https://github.com/Garfield-fr))
- users: fix unique email check [\#661](https://github.com/rero/rero-ils-ui/pull/661) ([zannkukai](https://github.com/zannkukai))
- search: fix corporate bodies search [\#658](https://github.com/rero/rero-ils-ui/pull/658) ([zannkukai](https://github.com/zannkukai))
- translations: translate v1.4.0 [\#657](https://github.com/rero/rero-ils-ui/pull/657) ([iGormilhit](https://github.com/iGormilhit))
- documentation: extend gh-actions labeler rules [\#654](https://github.com/rero/rero-ils-ui/pull/654) ([iGormilhit](https://github.com/iGormilhit))
- items: implement circulation history [\#653](https://github.com/rero/rero-ils-ui/pull/653) ([Garfield-fr](https://github.com/Garfield-fr))
- items: add temporary location field [\#652](https://github.com/rero/rero-ils-ui/pull/652) ([Garfield-fr](https://github.com/Garfield-fr))
- global: fix HTML copyright [\#651](https://github.com/rero/rero-ils-ui/pull/651) ([zannkukai](https://github.com/zannkukai))
- ILL requests: fix public view [\#650](https://github.com/rero/rero-ils-ui/pull/650) ([zannkukai](https://github.com/zannkukai))
- circulation: display position into request queue [\#647](https://github.com/rero/rero-ils-ui/pull/647) ([zannkukai](https://github.com/zannkukai))
- documentation: remove duplicate label rule [\#646](https://github.com/rero/rero-ils-ui/pull/646) ([iGormilhit](https://github.com/iGormilhit))
- documentation: extend gh-actions labeler rules [\#644](https://github.com/rero/rero-ils-ui/pull/644) ([iGormilhit](https://github.com/iGormilhit))
- editor: fix circulation policy setting widget [\#643](https://github.com/rero/rero-ils-ui/pull/643) ([zannkukai](https://github.com/zannkukai))

## [v0.15.0](https://github.com/rero/rero-ils-ui/tree/v0.15.0) (2021-06-16)

[Full Changelog](https://github.com/rero/rero-ils-ui/compare/v0.14.1...v0.15.0)

**Implemented enhancements:**

- Issue: update links on late issue brief view [\#602](https://github.com/rero/rero-ils-ui/pull/602) ([zannkukai](https://github.com/zannkukai))
- circulation: add data into pending/pickup patron profile [\#601](https://github.com/rero/rero-ils-ui/pull/601) ([zannkukai](https://github.com/zannkukai))

**Fixed bugs:**

- circulation: display circulation messages [\#620](https://github.com/rero/rero-ils-ui/pull/620) ([zannkukai](https://github.com/zannkukai))
- general: fix several UI issues. [\#446](https://github.com/rero/rero-ils-ui/pull/446) ([zannkukai](https://github.com/zannkukai))
- editor: fix patron editor [\#443](https://github.com/rero/rero-ils-ui/pull/443) ([zannkukai](https://github.com/zannkukai))

**Merged pull requests:**

- release: v0.15.0 [\#638](https://github.com/rero/rero-ils-ui/pull/638) ([jma](https://github.com/jma))
- ui: fix hide or show searchbar on pro interface [\#636](https://github.com/rero/rero-ils-ui/pull/636) ([Garfield-fr](https://github.com/Garfield-fr))
- serials: inform when there's no item attached to the holdings [\#635](https://github.com/rero/rero-ils-ui/pull/635) ([Garfield-fr](https://github.com/Garfield-fr))
- ui: fix language setting on the public interface [\#634](https://github.com/rero/rero-ils-ui/pull/634) ([Garfield-fr](https://github.com/Garfield-fr))
- organisations: fix translation of labels [\#633](https://github.com/rero/rero-ils-ui/pull/633) ([Garfield-fr](https://github.com/Garfield-fr))
- documents: enable the search bar on the detail view [\#632](https://github.com/rero/rero-ils-ui/pull/632) ([Garfield-fr](https://github.com/Garfield-fr))
- documents: fix detailed view [\#631](https://github.com/rero/rero-ils-ui/pull/631) ([Garfield-fr](https://github.com/Garfield-fr))
- libraries: fix translation on notification settings [\#630](https://github.com/rero/rero-ils-ui/pull/630) ([Garfield-fr](https://github.com/Garfield-fr))
- translations: translate v1.3.0 [\#629](https://github.com/rero/rero-ils-ui/pull/629) ([iGormilhit](https://github.com/iGormilhit))
- instance: change base URL [\#628](https://github.com/rero/rero-ils-ui/pull/628) ([rerowep](https://github.com/rerowep))
- documents: filters holdings by items [\#625](https://github.com/rero/rero-ils-ui/pull/625) ([Garfield-fr](https://github.com/Garfield-fr))
- patron types: add a code field on the detail view [\#622](https://github.com/rero/rero-ils-ui/pull/622) ([Garfield-fr](https://github.com/Garfield-fr))
- projects: update dependencies [\#621](https://github.com/rero/rero-ils-ui/pull/621) ([sebdeleze](https://github.com/sebdeleze))
- users: improve patron profile responsiveness [\#611](https://github.com/rero/rero-ils-ui/pull/611) ([zannkukai](https://github.com/zannkukai))
- documentation: create gh-actions labeler [\#610](https://github.com/rero/rero-ils-ui/pull/610) ([iGormilhit](https://github.com/iGormilhit))
- 1.3.0 to dev [\#607](https://github.com/rero/rero-ils-ui/pull/607) ([zannkukai](https://github.com/zannkukai))
- libraries: implement three new types of notification [\#606](https://github.com/rero/rero-ils-ui/pull/606) ([Garfield-fr](https://github.com/Garfield-fr))
- libraries: improve display of notification settings [\#599](https://github.com/rero/rero-ils-ui/pull/599) ([Garfield-fr](https://github.com/Garfield-fr))
- issue: fix issue display problems [\#598](https://github.com/rero/rero-ils-ui/pull/598) ([zannkukai](https://github.com/zannkukai))
- documents: update field display [\#591](https://github.com/rero/rero-ils-ui/pull/591) ([Garfield-fr](https://github.com/Garfield-fr))
- reports: improve inventory list for items [\#576](https://github.com/rero/rero-ils-ui/pull/576) ([lauren-d](https://github.com/lauren-d))
- documents: improve online access information [\#570](https://github.com/rero/rero-ils-ui/pull/570) ([Garfield-fr](https://github.com/Garfield-fr))
- search: implement advanced search [\#569](https://github.com/rero/rero-ils-ui/pull/569) ([Garfield-fr](https://github.com/Garfield-fr))
- library switch: fix redirection issue [\#474](https://github.com/rero/rero-ils-ui/pull/474) ([Garfield-fr](https://github.com/Garfield-fr))
- menus: add ILL request management into menu. [\#473](https://github.com/rero/rero-ils-ui/pull/473) ([zannkukai](https://github.com/zannkukai))
- holdings: fix holding detail page display [\#472](https://github.com/rero/rero-ils-ui/pull/472) ([zannkukai](https://github.com/zannkukai))
- search: fix ILL request search results errors [\#471](https://github.com/rero/rero-ils-ui/pull/471) ([jma](https://github.com/jma))
- translation: fix show more resources link [\#466](https://github.com/rero/rero-ils-ui/pull/466) ([zannkukai](https://github.com/zannkukai))
- Widget: fix dashboard widget [\#457](https://github.com/rero/rero-ils-ui/pull/457) ([zannkukai](https://github.com/zannkukai))
- menu: generation of menus by services [\#456](https://github.com/rero/rero-ils-ui/pull/456) ([Garfield-fr](https://github.com/Garfield-fr))
- circulation: allow checkout with fixed due date [\#449](https://github.com/rero/rero-ils-ui/pull/449) ([zannkukai](https://github.com/zannkukai))
- users: display keep_history for patron [\#447](https://github.com/rero/rero-ils-ui/pull/447) ([BadrAly](https://github.com/BadrAly))
- dependencies: update to angular 11 [\#445](https://github.com/rero/rero-ils-ui/pull/445) ([jma](https://github.com/jma))
- items: make acquisition default date optional [\#444](https://github.com/rero/rero-ils-ui/pull/444) ([zannkukai](https://github.com/zannkukai))
- menu: allow the librarian to switch library [\#442](https://github.com/rero/rero-ils-ui/pull/442) ([Garfield-fr](https://github.com/Garfield-fr))
- circulation policy: improve editor [\#440](https://github.com/rero/rero-ils-ui/pull/440) ([AoNoOokami](https://github.com/AoNoOokami))
- request: implement basic ILL request management [\#439](https://github.com/rero/rero-ils-ui/pull/439) ([zannkukai](https://github.com/zannkukai))
- git: update PR template [\#428](https://github.com/rero/rero-ils-ui/pull/428) ([AoNoOokami](https://github.com/AoNoOokami))
- circulation: improve labels [\#427](https://github.com/rero/rero-ils-ui/pull/427) ([AoNoOokami](https://github.com/AoNoOokami))
- data: implement local fields [\#418](https://github.com/rero/rero-ils-ui/pull/418) ([Garfield-fr](https://github.com/Garfield-fr))

## [v0.14.1](https://github.com/rero/rero-ils-ui/tree/v0.14.1) (2021-05-06)

[Full Changelog](https://github.com/rero/rero-ils-ui/compare/v0.14.0...v0.14.1)

**Merged pull requests:**

- release: v0.14.1 [\#597](https://github.com/rero/rero-ils-ui/pull/597) ([jma](https://github.com/jma))
- holdings: fix prediction preview [\#437](https://github.com/rero/rero-ils-ui/pull/437) ([jma](https://github.com/jma))
- items: fix display notes content. [\#436](https://github.com/rero/rero-ils-ui/pull/436) ([zannkukai](https://github.com/zannkukai))
- ui: adapt templates for cypress tests [\#435](https://github.com/rero/rero-ils-ui/pull/435) ([AoNoOokami](https://github.com/AoNoOokami))
- ui: fix translation issues [\#424](https://github.com/rero/rero-ils-ui/pull/424) ([AoNoOokami](https://github.com/AoNoOokami))
- contribution: implements organisation agents [\#398](https://github.com/rero/rero-ils-ui/pull/398) ([Garfield-fr](https://github.com/Garfield-fr))

## [v0.14.0](https://github.com/rero/rero-ils-ui/tree/v0.14.0) (2021-05-06)

[Full Changelog](https://github.com/rero/rero-ils-ui/compare/0.14.0...v0.14.0)

**Merged pull requests:**

- bugs: fix several bugs into UI [\#430](https://github.com/rero/rero-ils-ui/pull/430) ([zannkukai](https://github.com/zannkukai))
- ui: implement basic keyboard shortcuts [\#429](https://github.com/rero/rero-ils-ui/pull/429) ([zannkukai](https://github.com/zannkukai))
- requests: improves the main request screen. [\#426](https://github.com/rero/rero-ils-ui/pull/426) ([zannkukai](https://github.com/zannkukai))
- serials: new service to display late/claimed issues [\#425](https://github.com/rero/rero-ils-ui/pull/425) ([BadrAly](https://github.com/BadrAly))
- circulation: display authors for item in circulation. [\#423](https://github.com/rero/rero-ils-ui/pull/423) ([zannkukai](https://github.com/zannkukai))
- document: fix identifier display in detail view [\#421](https://github.com/rero/rero-ils-ui/pull/421) ([AoNoOokami](https://github.com/AoNoOokami))
- circulation: improve displayed patron data [\#419](https://github.com/rero/rero-ils-ui/pull/419) ([zannkukai](https://github.com/zannkukai))
- transactions: limit pay with 2 decimals [\#417](https://github.com/rero/rero-ils-ui/pull/417) ([zannkukai](https://github.com/zannkukai))
- holdings: improve editor preview rendering [\#413](https://github.com/rero/rero-ils-ui/pull/413) ([jma](https://github.com/jma))
- patron: allows librarians to update user password [\#411](https://github.com/rero/rero-ils-ui/pull/411) ([jma](https://github.com/jma))

## [0.14.0](https://github.com/rero/rero-ils-ui/tree/0.14.0) (2021-05-06)

[Full Changelog](https://github.com/rero/rero-ils-ui/compare/v0.13.1...0.14.0)

**Implemented enhancements:**

- documents: hide availability on import brief view [\#594](https://github.com/rero/rero-ils-ui/pull/594) ([Garfield-fr](https://github.com/Garfield-fr))

**Fixed bugs:**

- circulation: restore the patron history tab [\#593](https://github.com/rero/rero-ils-ui/pull/593) ([Garfield-fr](https://github.com/Garfield-fr))
- documents: fix translations on holdings/items [\#592](https://github.com/rero/rero-ils-ui/pull/592) ([Garfield-fr](https://github.com/Garfield-fr))
- pipe: translate value of getTranslatedLabel [\#588](https://github.com/rero/rero-ils-ui/pull/588) ([Garfield-fr](https://github.com/Garfield-fr))
- documents: fix items buttons position [\#571](https://github.com/rero/rero-ils-ui/pull/571) ([zannkukai](https://github.com/zannkukai))

**Merged pull requests:**

- release: v0.14.0 [\#595](https://github.com/rero/rero-ils-ui/pull/595) ([jma](https://github.com/jma))
- documents: fix typo in subject process pipe [\#587](https://github.com/rero/rero-ils-ui/pull/587) ([Garfield-fr](https://github.com/Garfield-fr))
- translations: translate v0.14.0 [\#586](https://github.com/rero/rero-ils-ui/pull/586) ([iGormilhit](https://github.com/iGormilhit))
- documents: update subject display [\#579](https://github.com/rero/rero-ils-ui/pull/579) ([Garfield-fr](https://github.com/Garfield-fr))
- documents: validate and check the identifier [\#568](https://github.com/rero/rero-ils-ui/pull/568) ([Garfield-fr](https://github.com/Garfield-fr))
- patrons: add a role async validator [\#567](https://github.com/rero/rero-ils-ui/pull/567) ([jma](https://github.com/jma))
- users: patron in multiple organisations [\#566](https://github.com/rero/rero-ils-ui/pull/566) ([Garfield-fr](https://github.com/Garfield-fr))
- search: update search tab title & aggregation name [\#564](https://github.com/rero/rero-ils-ui/pull/564) ([Garfield-fr](https://github.com/Garfield-fr))
- collections: rename into "Exhibition/course" [\#563](https://github.com/rero/rero-ils-ui/pull/563) ([Garfield-fr](https://github.com/Garfield-fr))
- security: update dependencies [\#561](https://github.com/rero/rero-ils-ui/pull/561) ([zannkukai](https://github.com/zannkukai))
- Circulation category: update display [\#556](https://github.com/rero/rero-ils-ui/pull/556) ([zannkukai](https://github.com/zannkukai))
- fees: pay only the fees of my library [\#552](https://github.com/rero/rero-ils-ui/pull/552) ([jma](https://github.com/jma))
- patron profile: initial sorting parameter. [\#550](https://github.com/rero/rero-ils-ui/pull/550) ([zannkukai](https://github.com/zannkukai))

## [v0.13.1](https://github.com/rero/rero-ils-ui/tree/v0.13.1) (2021-03-29)

[Full Changelog](https://github.com/rero/rero-ils-ui/compare/v0.13.0...v0.13.1)

**Merged pull requests:**

- release: v0.13.1 [\#559](https://github.com/rero/rero-ils-ui/pull/559) ([jma](https://github.com/jma))
- library: fix editor problem. [\#558](https://github.com/rero/rero-ils-ui/pull/558) ([zannkukai](https://github.com/zannkukai))

## [v0.13.0](https://github.com/rero/rero-ils-ui/tree/v0.13.0) (2021-03-22)

[Full Changelog](https://github.com/rero/rero-ils-ui/compare/v0.12.1...v0.13.0)

**Implemented enhancements:**

- circulation: improve library closed dates handling [\#534](https://github.com/rero/rero-ils-ui/pull/534) ([zannkukai](https://github.com/zannkukai))

**Fixed bugs:**

- circulation: fix fixed date datepicker input [\#536](https://github.com/rero/rero-ils-ui/pull/536) ([zannkukai](https://github.com/zannkukai))

**Merged pull requests:**

- release: v0.13.0 [\#555](https://github.com/rero/rero-ils-ui/pull/555) ([jma](https://github.com/jma))
- dependencies: use @rero/ng-core v1.6.0 [\#551](https://github.com/rero/rero-ils-ui/pull/551) ([jma](https://github.com/jma))
- document: sort issue item in document view. [\#547](https://github.com/rero/rero-ils-ui/pull/547) ([zannkukai](https://github.com/zannkukai))
- Merging PR [\#545](https://github.com/rero/rero-ils-ui/pull/545) ([zannkukai](https://github.com/zannkukai))
- documents: fix thumbnail size [\#542](https://github.com/rero/rero-ils-ui/pull/542) ([lauren-d](https://github.com/lauren-d))
- security: update dependencies [\#541](https://github.com/rero/rero-ils-ui/pull/541) ([jma](https://github.com/jma))
- items: complete item model [\#539](https://github.com/rero/rero-ils-ui/pull/539) ([Garfield-fr](https://github.com/Garfield-fr))
- document: fix document detail view [\#535](https://github.com/rero/rero-ils-ui/pull/535) ([zannkukai](https://github.com/zannkukai))
- patrons: edit the user personal data in a modal [\#529](https://github.com/rero/rero-ils-ui/pull/529) ([jma](https://github.com/jma))
- patrons: rewrite the profile in Angular [\#528](https://github.com/rero/rero-ils-ui/pull/528) ([Garfield-fr](https://github.com/Garfield-fr))
- Request: always allow to add a request [\#527](https://github.com/rero/rero-ils-ui/pull/527) ([zannkukai](https://github.com/zannkukai))
- issue: best visualization of expected issue. [\#526](https://github.com/rero/rero-ils-ui/pull/526) ([zannkukai](https://github.com/zannkukai))
- typeahead: remove HTML tags from suggestion [\#525](https://github.com/rero/rero-ils-ui/pull/525) ([zannkukai](https://github.com/zannkukai))
- libraries: add notification settings [\#516](https://github.com/rero/rero-ils-ui/pull/516) ([AoNoOokami](https://github.com/AoNoOokami))

## [v0.12.1](https://github.com/rero/rero-ils-ui/tree/v0.12.1) (2021-03-02)

[Full Changelog](https://github.com/rero/rero-ils-ui/compare/v0.12.0...v0.12.1)

**Merged pull requests:**

- release: v0.12.1 [\#537](https://github.com/rero/rero-ils-ui/pull/537) ([jma](https://github.com/jma))
- tests: fix cypress tests [\#524](https://github.com/rero/rero-ils-ui/pull/524) ([AoNoOokami](https://github.com/AoNoOokami))
- document: improvement of the display get tab [\#521](https://github.com/rero/rero-ils-ui/pull/521) ([Garfield-fr](https://github.com/Garfield-fr))
- public-search: hide not received issues for public [\#520](https://github.com/rero/rero-ils-ui/pull/520) ([zannkukai](https://github.com/zannkukai))
- menu: translate menu entries [\#508](https://github.com/rero/rero-ils-ui/pull/508) ([AoNoOokami](https://github.com/AoNoOokami))
- documents: display 'part of' in brief views [\#506](https://github.com/rero/rero-ils-ui/pull/506) ([AoNoOokami](https://github.com/AoNoOokami))

## [v0.12.0](https://github.com/rero/rero-ils-ui/tree/v0.12.0) (2021-02-11)

[Full Changelog](https://github.com/rero/rero-ils-ui/compare/v0.11.1...v0.12.0)

**Merged pull requests:**

- release: v0.12.0 [\#517](https://github.com/rero/rero-ils-ui/pull/517) ([jma](https://github.com/jma))
- editor: add an external link to the mef authority [\#503](https://github.com/rero/rero-ils-ui/pull/503) ([jma](https://github.com/jma))

## [v0.11.1](https://github.com/rero/rero-ils-ui/tree/v0.11.1) (2021-02-08)

[Full Changelog](https://github.com/rero/rero-ils-ui/compare/v0.11.0...v0.11.1)

## [v0.11.0](https://github.com/rero/rero-ils-ui/tree/v0.11.0) (2021-02-08)

[Full Changelog](https://github.com/rero/rero-ils-ui/compare/v0.10.0...v0.11.0)

**Merged pull requests:**

- release: v0.11.0 [\#514](https://github.com/rero/rero-ils-ui/pull/514) ([jma](https://github.com/jma))
- documents: fix items/holdings creation for harvested document [\#513](https://github.com/rero/rero-ils-ui/pull/513) ([zannkukai](https://github.com/zannkukai))
- documents: allow to add either holdings or items [\#502](https://github.com/rero/rero-ils-ui/pull/502) ([Garfield-fr](https://github.com/Garfield-fr))
- operation logs: implement operation history [\#501](https://github.com/rero/rero-ils-ui/pull/501) ([Garfield-fr](https://github.com/Garfield-fr))
- circulation: display item info when no circ action is performed [\#500](https://github.com/rero/rero-ils-ui/pull/500) ([AoNoOokami](https://github.com/AoNoOokami))
- gh-actions: mark PR and issue stale [\#495](https://github.com/rero/rero-ils-ui/pull/495) ([iGormilhit](https://github.com/iGormilhit))
- items: add temporary circulation category [\#494](https://github.com/rero/rero-ils-ui/pull/494) ([zannkukai](https://github.com/zannkukai))
- documents: rewrite public holdings/items view in Angular [\#493](https://github.com/rero/rero-ils-ui/pull/493) ([Garfield-fr](https://github.com/Garfield-fr))
- dependencies: update and fix vulnerabilities [\#492](https://github.com/rero/rero-ils-ui/pull/492) ([jma](https://github.com/jma))
- Implement document types [\#490](https://github.com/rero/rero-ils-ui/pull/490) ([AoNoOokami](https://github.com/AoNoOokami))
- search: fix encoding parameters problem [\#485](https://github.com/rero/rero-ils-ui/pull/485) ([zannkukai](https://github.com/zannkukai))
- search: adapt the suggestions to the locale [\#481](https://github.com/rero/rero-ils-ui/pull/481) ([Garfield-fr](https://github.com/Garfield-fr))
- general: use ngVarDirective from @rero/ng-core [\#463](https://github.com/rero/rero-ils-ui/pull/463) ([zannkukai](https://github.com/zannkukai))

## [v0.10.0](https://github.com/rero/rero-ils-ui/tree/v0.10.0) (2021-01-18)

[Full Changelog](https://github.com/rero/rero-ils-ui/compare/v0.9.0...v0.10.0)

**Fixed bugs:**

- menu: fix menu double entries [\#483](https://github.com/rero/rero-ils-ui/pull/483) ([zannkukai](https://github.com/zannkukai))

**Merged pull requests:**

- release: v0.10.0 [\#491](https://github.com/rero/rero-ils-ui/pull/491) ([jma](https://github.com/jma))
- deploy: fix error message with invenio 3.4 [\#486](https://github.com/rero/rero-ils-ui/pull/486) ([jma](https://github.com/jma))
- ui: fix templates for cypress tests [\#480](https://github.com/rero/rero-ils-ui/pull/480) ([AoNoOokami](https://github.com/AoNoOokami))
- search: fix author facet of BnF import search view [\#479](https://github.com/rero/rero-ils-ui/pull/479) ([rerowep](https://github.com/rerowep))
- items: inherit holdings first call_number [\#462](https://github.com/rero/rero-ils-ui/pull/462) ([BadrAly](https://github.com/BadrAly))

## [v0.9.0](https://github.com/rero/rero-ils-ui/tree/v0.9.0) (2020-12-16)

[Full Changelog](https://github.com/rero/rero-ils-ui/compare/v0.8.0...v0.9.0)

**Implemented enhancements:**

- documents: group holdings by libraries [\#453](https://github.com/rero/rero-ils-ui/pull/453) ([Garfield-fr](https://github.com/Garfield-fr))

**Merged pull requests:**

- release: v0.9.0 [\#476](https://github.com/rero/rero-ils-ui/pull/476) ([jma](https://github.com/jma))
- item: sort notifications by chronological order [\#465](https://github.com/rero/rero-ils-ui/pull/465) ([zannkukai](https://github.com/zannkukai))
- permissions: improve access control [\#464](https://github.com/rero/rero-ils-ui/pull/464) ([Garfield-fr](https://github.com/Garfield-fr))
- document: improve document detail view [\#461](https://github.com/rero/rero-ils-ui/pull/461) ([zannkukai](https://github.com/zannkukai))
- document: fix duplicate harvested document [\#460](https://github.com/rero/rero-ils-ui/pull/460) ([zannkukai](https://github.com/zannkukai))
- item: display item notes [\#454](https://github.com/rero/rero-ils-ui/pull/454) ([zannkukai](https://github.com/zannkukai))
- circulation: adds a counter on history tab [\#452](https://github.com/rero/rero-ils-ui/pull/452) ([zannkukai](https://github.com/zannkukai))

## [v0.8.0](https://github.com/rero/rero-ils-ui/tree/v0.8.0) (2020-11-24)

[Full Changelog](https://github.com/rero/rero-ils-ui/compare/v0.7.1...v0.8.0)

**Merged pull requests:**

- release: v0.8.0 [\#441](https://github.com/rero/rero-ils-ui/pull/441) ([jma](https://github.com/jma))

## [v0.7.1](https://github.com/rero/rero-ils-ui/tree/v0.7.1) (2020-11-16)

[Full Changelog](https://github.com/rero/rero-ils-ui/compare/v0.7.0...v0.7.1)

**Merged pull requests:**

- release: v0.7.1 [\#434](https://github.com/rero/rero-ils-ui/pull/434) ([jma](https://github.com/jma))

## [v0.7.0](https://github.com/rero/rero-ils-ui/tree/v0.7.0) (2020-11-16)

[Full Changelog](https://github.com/rero/rero-ils-ui/compare/v0.6.1...v0.7.0)

**Merged pull requests:**

- release: v0.7.0 [\#433](https://github.com/rero/rero-ils-ui/pull/433) ([jma](https://github.com/jma))
- circulation: add loans sorting possibility. [\#420](https://github.com/rero/rero-ils-ui/pull/420) ([zannkukai](https://github.com/zannkukai))
- merge temporary v0.14 branch to dev [\#415](https://github.com/rero/rero-ils-ui/pull/415) ([zannkukai](https://github.com/zannkukai))
- sercurity: update dependencies [\#237](https://github.com/rero/rero-ils-ui/pull/237) ([jma](https://github.com/jma))
- tests: fix random failures [\#236](https://github.com/rero/rero-ils-ui/pull/236) ([jma](https://github.com/jma))
- translation: fix some source string issues [\#222](https://github.com/rero/rero-ils-ui/pull/222) ([iGormilhit](https://github.com/iGormilhit))
- document: display title in brief and detail views [\#217](https://github.com/rero/rero-ils-ui/pull/217) ([AoNoOokami](https://github.com/AoNoOokami))
- Adding guards to solved editor access using direct URL [\#214](https://github.com/rero/rero-ils-ui/pull/214) ([zannkukai](https://github.com/zannkukai))

## [v0.6.1](https://github.com/rero/rero-ils-ui/tree/v0.6.1) (2020-11-02)

[Full Changelog](https://github.com/rero/rero-ils-ui/compare/v0.6.0...v0.6.1)

**Merged pull requests:**

- release: v0.6.1 [\#409](https://github.com/rero/rero-ils-ui/pull/409) ([jma](https://github.com/jma))
- editor: move to formly v5.10.5 [\#408](https://github.com/rero/rero-ils-ui/pull/408) ([jma](https://github.com/jma))
- git: update PR template [\#387](https://github.com/rero/rero-ils-ui/pull/387) ([AoNoOokami](https://github.com/AoNoOokami))

## [v0.6.0](https://github.com/rero/rero-ils-ui/tree/v0.6.0) (2020-10-19)

[Full Changelog](https://github.com/rero/rero-ils-ui/compare/v0.5.2...v0.6.0)

**Merged pull requests:**

- release 0.6.0 [\#396](https://github.com/rero/rero-ils-ui/pull/396) ([jma](https://github.com/jma))
- patron: improve performance of the patron account display [\#395](https://github.com/rero/rero-ils-ui/pull/395) ([zannkukai](https://github.com/zannkukai))
- routing: fix dynamic routing [\#393](https://github.com/rero/rero-ils-ui/pull/393) ([Garfield-fr](https://github.com/Garfield-fr))
- refactors user resource [\#389](https://github.com/rero/rero-ils-ui/pull/389) ([jma](https://github.com/jma))
- holding: add fields on the holding display [\#388](https://github.com/rero/rero-ils-ui/pull/388) ([Garfield-fr](https://github.com/Garfield-fr))
- implements resource template [\#386](https://github.com/rero/rero-ils-ui/pull/386) ([zannkukai](https://github.com/zannkukai))
- search list: add extend link when no result has been found [\#382](https://github.com/rero/rero-ils-ui/pull/382) ([Garfield-fr](https://github.com/Garfield-fr))
- library: Fix storage key on library switch [\#380](https://github.com/rero/rero-ils-ui/pull/380) ([Garfield-fr](https://github.com/Garfield-fr))
- app: Improve the library switch with new application initialization [\#379](https://github.com/rero/rero-ils-ui/pull/379) ([Garfield-fr](https://github.com/Garfield-fr))
- holding: fix holding display problem. [\#378](https://github.com/rero/rero-ils-ui/pull/378) ([zannkukai](https://github.com/zannkukai))
- app: standardize initialization [\#377](https://github.com/rero/rero-ils-ui/pull/377) ([Garfield-fr](https://github.com/Garfield-fr))
- collection: create public and professional views [\#376](https://github.com/rero/rero-ils-ui/pull/376) ([AoNoOokami](https://github.com/AoNoOokami))
- document: allow record duplication [\#367](https://github.com/rero/rero-ils-ui/pull/367) ([Garfield-fr](https://github.com/Garfield-fr))
- application: compatibility with Elasticsearch 7 [\#366](https://github.com/rero/rero-ils-ui/pull/366) ([Garfield-fr](https://github.com/Garfield-fr))

## [v0.5.2](https://github.com/rero/rero-ils-ui/tree/v0.5.2) (2020-09-21)

[Full Changelog](https://github.com/rero/rero-ils-ui/compare/v0.5.1...v0.5.2)

**Implemented enhancements:**

- Use a tool to generate automatically a changelog [\#295](https://github.com/rero/rero-ils-ui/issues/295)

**Merged pull requests:**

- translations: for release 0.5.2 [\#375](https://github.com/rero/rero-ils-ui/pull/375) ([jma](https://github.com/jma))
- form: improve toogle switch [\#372](https://github.com/rero/rero-ils-ui/pull/372) ([Garfield-fr](https://github.com/Garfield-fr))
- translations: fix show more item link [\#370](https://github.com/rero/rero-ils-ui/pull/370) ([zannkukai](https://github.com/zannkukai))

## [v0.5.1](https://github.com/rero/rero-ils-ui/tree/v0.5.1) (2020-09-14)

[Full Changelog](https://github.com/rero/rero-ils-ui/compare/v0.5.0...v0.5.1)

**Merged pull requests:**

- release: v0.5.1 [\#364](https://github.com/rero/rero-ils-ui/pull/364) ([iGormilhit](https://github.com/iGormilhit))
- document: improve translated aggregations [\#363](https://github.com/rero/rero-ils-ui/pull/363) ([lauren-d](https://github.com/lauren-d))
- request: fix cancel request [\#361](https://github.com/rero/rero-ils-ui/pull/361) ([AoNoOokami](https://github.com/AoNoOokami))

## [v0.5.0](https://github.com/rero/rero-ils-ui/tree/v0.5.0) (2020-09-08)

[Full Changelog](https://github.com/rero/rero-ils-ui/compare/v0.4.0...v0.5.0)

**Implemented enhancements:**

- ui: add more `id=` attributes for patron and logo [\#327](https://github.com/rero/rero-ils-ui/pull/327) ([blankoworld](https://github.com/blankoworld))

**Merged pull requests:**

- Translations update from Weblate [\#359](https://github.com/rero/rero-ils-ui/pull/359) ([weblate](https://github.com/weblate))
- search: fix contribution facet [\#354](https://github.com/rero/rero-ils-ui/pull/354) ([rerowep](https://github.com/rerowep))
- search: fix contribution link [\#352](https://github.com/rero/rero-ils-ui/pull/352) ([lauren-d](https://github.com/lauren-d))
- editor: define custom documents typeahead type [\#350](https://github.com/rero/rero-ils-ui/pull/350) ([lauren-d](https://github.com/lauren-d))
- ui: adapt templates for cypress tests [\#349](https://github.com/rero/rero-ils-ui/pull/349) ([AoNoOokami](https://github.com/AoNoOokami))
- document: clear '\_draft' key when saving document. [\#347](https://github.com/rero/rero-ils-ui/pull/347) ([zannkukai](https://github.com/zannkukai))
- circulation: fix patron info in loan view [\#345](https://github.com/rero/rero-ils-ui/pull/345) ([AoNoOokami](https://github.com/AoNoOokami))
- Translations update from Weblate [\#344](https://github.com/rero/rero-ils-ui/pull/344) ([weblate](https://github.com/weblate))
- circulation: update request permissions [\#343](https://github.com/rero/rero-ils-ui/pull/343) ([AoNoOokami](https://github.com/AoNoOokami))
- circulation: allow request for organisation items [\#342](https://github.com/rero/rero-ils-ui/pull/342) ([zannkukai](https://github.com/zannkukai))
- circulation: fixes the display of the due date [\#340](https://github.com/rero/rero-ils-ui/pull/340) ([AoNoOokami](https://github.com/AoNoOokami))
- circulation : toastr message when item goes in transit [\#339](https://github.com/rero/rero-ils-ui/pull/339) ([zannkukai](https://github.com/zannkukai))
- request: fix update of request pickup location [\#338](https://github.com/rero/rero-ils-ui/pull/338) ([AoNoOokami](https://github.com/AoNoOokami))
- document: replace authors by contribution field [\#333](https://github.com/rero/rero-ils-ui/pull/333) ([Garfield-fr](https://github.com/Garfield-fr))
- item: update UI to manage 'new_acquisition' field [\#331](https://github.com/rero/rero-ils-ui/pull/331) ([zannkukai](https://github.com/zannkukai))
- ui: add `id=` HTML attributes on item lists [\#330](https://github.com/rero/rero-ils-ui/pull/330) ([blankoworld](https://github.com/blankoworld))
- Translations update from Weblate [\#329](https://github.com/rero/rero-ils-ui/pull/329) ([weblate](https://github.com/weblate))
- document: adapt detailed view for cypress tests [\#324](https://github.com/rero/rero-ils-ui/pull/324) ([AoNoOokami](https://github.com/AoNoOokami))
- Merge the update of invenio-circulation and major refactoring of RERO ILS circulation module \(US 1394\) [\#320](https://github.com/rero/rero-ils-ui/pull/320) ([AoNoOokami](https://github.com/AoNoOokami))
- Translations update from Weblate [\#310](https://github.com/rero/rero-ils-ui/pull/310) ([weblate](https://github.com/weblate))

## [v0.4.0](https://github.com/rero/rero-ils-ui/tree/v0.4.0) (2020-07-30)

[Full Changelog](https://github.com/rero/rero-ils-ui/compare/v0.3.0...v0.4.0)

**Merged pull requests:**

- release: v0.4.0 [\#326](https://github.com/rero/rero-ils-ui/pull/326) ([jma](https://github.com/jma))
- document: fix holding type serial detection [\#325](https://github.com/rero/rero-ils-ui/pull/325) ([jma](https://github.com/jma))
- Us1491 item inventory list [\#323](https://github.com/rero/rero-ils-ui/pull/323) ([jma](https://github.com/jma))
- document editor: fix bnf import [\#322](https://github.com/rero/rero-ils-ui/pull/322) ([jma](https://github.com/jma))
- ui: replace getId\(\) by idAttribute Pipe [\#321](https://github.com/rero/rero-ils-ui/pull/321) ([blankoworld](https://github.com/blankoworld))
- documentation: add badges to the README [\#319](https://github.com/rero/rero-ils-ui/pull/319) ([iGormilhit](https://github.com/iGormilhit))
- package: upgrade ng-core to version 0.6.0 [\#315](https://github.com/rero/rero-ils-ui/pull/315) ([Garfield-fr](https://github.com/Garfield-fr))
- project: downgrade ngx-spinner version [\#314](https://github.com/rero/rero-ils-ui/pull/314) ([lauren-d](https://github.com/lauren-d))
- project: add ngx-spinner dependency [\#313](https://github.com/rero/rero-ils-ui/pull/313) ([lauren-d](https://github.com/lauren-d))
- ui: better way to select menu items by Cypress [\#311](https://github.com/rero/rero-ils-ui/pull/311) ([blankoworld](https://github.com/blankoworld))
- item: add missing notes translations [\#306](https://github.com/rero/rero-ils-ui/pull/306) ([Garfield-fr](https://github.com/Garfield-fr))
- document: limit title length into document view [\#305](https://github.com/rero/rero-ils-ui/pull/305) ([zannkukai](https://github.com/zannkukai))
- ui: better request badge into circulation module [\#304](https://github.com/rero/rero-ils-ui/pull/304) ([zannkukai](https://github.com/zannkukai))
- ui: add directive to sort tabs [\#302](https://github.com/rero/rero-ils-ui/pull/302) ([zannkukai](https://github.com/zannkukai))
- package: upgrade to NodeJS 12 [\#301](https://github.com/rero/rero-ils-ui/pull/301) ([blankoworld](https://github.com/blankoworld))
- document: adapts detailed view for series statements fields [\#283](https://github.com/rero/rero-ils-ui/pull/283) ([AoNoOokami](https://github.com/AoNoOokami))

## [v0.3.0](https://github.com/rero/rero-ils-ui/tree/v0.3.0) (2020-06-30)

[Full Changelog](https://github.com/rero/rero-ils-ui/compare/v0.2.1...v0.3.0)

**Closed issues:**

- Flash messages should always start with a capitalized initial [\#73](https://github.com/rero/rero-ils-ui/issues/73)

**Merged pull requests:**

- release: v0.3.0 [\#297](https://github.com/rero/rero-ils-ui/pull/297) ([iGormilhit](https://github.com/iGormilhit))
- package: upgrade ng-core to version 0.5.0 [\#296](https://github.com/rero/rero-ils-ui/pull/296) ([Garfield-fr](https://github.com/Garfield-fr))
- Translate '/projects/public-search/src/assets/rero-ils-ui/public-search/i18n/en_US.json' in 'en' [\#293](https://github.com/rero/rero-ils-ui/pull/293) ([transifex-integration[bot]](https://github.com/apps/transifex-integration))
- Translate '/projects/admin/src/assets/rero-ils-ui/admin/i18n/en_US.json' in 'en' [\#292](https://github.com/rero/rero-ils-ui/pull/292) ([transifex-integration[bot]](https://github.com/apps/transifex-integration))
- Translate '/projects/admin/src/assets/rero-ils-ui/admin/i18n/en_US.json' in 'fr' [\#291](https://github.com/rero/rero-ils-ui/pull/291) ([transifex-integration[bot]](https://github.com/apps/transifex-integration))
- item: Improve transactions on detailed view [\#290](https://github.com/rero/rero-ils-ui/pull/290) ([Garfield-fr](https://github.com/Garfield-fr))
- issue: move 'new' badge to the right [\#289](https://github.com/rero/rero-ils-ui/pull/289) ([zannkukai](https://github.com/zannkukai))
- document: adapt display of field "notes" [\#288](https://github.com/rero/rero-ils-ui/pull/288) ([AoNoOokami](https://github.com/AoNoOokami))
- packages: upgrade ng-core to version 0.4 [\#287](https://github.com/rero/rero-ils-ui/pull/287) ([Garfield-fr](https://github.com/Garfield-fr))
- ui: add document importation through the web [\#286](https://github.com/rero/rero-ils-ui/pull/286) ([jma](https://github.com/jma))
- routing: change redirectUrl function on route config [\#285](https://github.com/rero/rero-ils-ui/pull/285) ([Garfield-fr](https://github.com/Garfield-fr))
- authorization: limit roles management using API [\#284](https://github.com/rero/rero-ils-ui/pull/284) ([zannkukai](https://github.com/zannkukai))
- menu: refactoring switch library [\#282](https://github.com/rero/rero-ils-ui/pull/282) ([zannkukai](https://github.com/zannkukai))
- autocomplete: fix author wrong date [\#281](https://github.com/rero/rero-ils-ui/pull/281) ([rerowep](https://github.com/rerowep))
- circulation: display circulation notes automatically. [\#280](https://github.com/rero/rero-ils-ui/pull/280) ([zannkukai](https://github.com/zannkukai))
- items: display items notes [\#278](https://github.com/rero/rero-ils-ui/pull/278) ([zannkukai](https://github.com/zannkukai))
- menu: make the language menu more consistent [\#277](https://github.com/rero/rero-ils-ui/pull/277) ([jma](https://github.com/jma))
- serial: receive an issue [\#272](https://github.com/rero/rero-ils-ui/pull/272) ([zannkukai](https://github.com/zannkukai))
- admin: expand interface width and improve editor [\#267](https://github.com/rero/rero-ils-ui/pull/267) ([AoNoOokami](https://github.com/AoNoOokami))

## [v0.2.1](https://github.com/rero/rero-ils-ui/tree/v0.2.1) (2020-06-03)

[Full Changelog](https://github.com/rero/rero-ils-ui/compare/v0.2.0...v0.2.1)

**Merged pull requests:**

- release: v0.2.1 [\#276](https://github.com/rero/rero-ils-ui/pull/276) ([jma](https://github.com/jma))
- Translate '/projects/admin/src/assets/rero-ils-ui/admin/i18n/en_US.json' in 'fr' [\#275](https://github.com/rero/rero-ils-ui/pull/275) ([transifex-integration[bot]](https://github.com/apps/transifex-integration))
- Translate '/projects/public-search/src/assets/rero-ils-ui/public-search/i18n/en_US.json' in 'fr' [\#274](https://github.com/rero/rero-ils-ui/pull/274) ([transifex-integration[bot]](https://github.com/apps/transifex-integration))

## [v0.2.0](https://github.com/rero/rero-ils-ui/tree/v0.2.0) (2020-05-28)

[Full Changelog](https://github.com/rero/rero-ils-ui/compare/v0.1.3...v0.2.0)

**Implemented enhancements:**

- libraries: adapt library custom editor [\#176](https://github.com/rero/rero-ils-ui/pull/176) ([zannkukai](https://github.com/zannkukai))

**Merged pull requests:**

- release: v0.2.0 [\#273](https://github.com/rero/rero-ils-ui/pull/273) ([jma](https://github.com/jma))
- translations: use server side translations [\#271](https://github.com/rero/rero-ils-ui/pull/271) ([jma](https://github.com/jma))
- documentation: improve issue template [\#270](https://github.com/rero/rero-ils-ui/pull/270) ([iGormilhit](https://github.com/iGormilhit))
- editor: link persons to source instead of MEF [\#269](https://github.com/rero/rero-ils-ui/pull/269) ([rerowep](https://github.com/rerowep))
- permissions: refactoring permissions usage [\#268](https://github.com/rero/rero-ils-ui/pull/268) ([zannkukai](https://github.com/zannkukai))
- locations: paging request adaptation [\#266](https://github.com/rero/rero-ils-ui/pull/266) ([zannkukai](https://github.com/zannkukai))
- search: add simple params for the backend calls [\#265](https://github.com/rero/rero-ils-ui/pull/265) ([jma](https://github.com/jma))
- circulation: past participle used when action done [\#263](https://github.com/rero/rero-ils-ui/pull/263) ([zannkukai](https://github.com/zannkukai))
- document: adapt detail view [\#261](https://github.com/rero/rero-ils-ui/pull/261) ([AoNoOokami](https://github.com/AoNoOokami))
- general: MainTitle as a pipe and test imports refactoring. [\#245](https://github.com/rero/rero-ils-ui/pull/245) ([zannkukai](https://github.com/zannkukai))
- patron: add 'blocked' functionnality [\#234](https://github.com/rero/rero-ils-ui/pull/234) ([blankoworld](https://github.com/blankoworld))

## [v0.1.3](https://github.com/rero/rero-ils-ui/tree/v0.1.3) (2020-05-28)

[Full Changelog](https://github.com/rero/rero-ils-ui/compare/v0.1.2...v0.1.3)

## [v0.1.2](https://github.com/rero/rero-ils-ui/tree/v0.1.2) (2020-04-30)

[Full Changelog](https://github.com/rero/rero-ils-ui/compare/v0.1.1...v0.1.2)

**Merged pull requests:**

- release: v0.1.2 [\#264](https://github.com/rero/rero-ils-ui/pull/264) ([jma](https://github.com/jma))
- autocomplete: fix suggestions list [\#260](https://github.com/rero/rero-ils-ui/pull/260) ([jma](https://github.com/jma))
- request: fix pickup location update [\#258](https://github.com/rero/rero-ils-ui/pull/258) ([AoNoOokami](https://github.com/AoNoOokami))
- documentation: add dependencies in PR template [\#257](https://github.com/rero/rero-ils-ui/pull/257) ([iGormilhit](https://github.com/iGormilhit))
- Translate '/projects/admin/src/app/translate/i18n/en_US.json' in 'ar' [\#256](https://github.com/rero/rero-ils-ui/pull/256) ([transifex-integration[bot]](https://github.com/apps/transifex-integration))
- git: merge US1355 Cancel and edit a request [\#254](https://github.com/rero/rero-ils-ui/pull/254) ([AoNoOokami](https://github.com/AoNoOokami))
- autocomplete: fix suggestions are not displayed [\#253](https://github.com/rero/rero-ils-ui/pull/253) ([jma](https://github.com/jma))
- holdings: add patterns support [\#251](https://github.com/rero/rero-ils-ui/pull/251) ([jma](https://github.com/jma))
- Translate '/projects/admin/src/app/translate/i18n/en_US.json' in 'ar' [\#249](https://github.com/rero/rero-ils-ui/pull/249) ([transifex-integration[bot]](https://github.com/apps/transifex-integration))
- Merge "US Subscriptions" into dev [\#247](https://github.com/rero/rero-ils-ui/pull/247) ([zannkukai](https://github.com/zannkukai))
- Patrons : history tab [\#244](https://github.com/rero/rero-ils-ui/pull/244) ([zannkukai](https://github.com/zannkukai))
- document: filter results by org in admin view [\#208](https://github.com/rero/rero-ils-ui/pull/208) ([AoNoOokami](https://github.com/AoNoOokami))
- display idref persons [\#203](https://github.com/rero/rero-ils-ui/pull/203) ([rerowep](https://github.com/rerowep))

## [v0.1.1](https://github.com/rero/rero-ils-ui/tree/v0.1.1) (2020-04-24)

[Full Changelog](https://github.com/rero/rero-ils-ui/compare/v0.1.0...v0.1.1)

## [v0.1.0](https://github.com/rero/rero-ils-ui/tree/v0.1.0) (2020-04-09)

[Full Changelog](https://github.com/rero/rero-ils-ui/compare/v0.0.13...v0.1.0)

**Merged pull requests:**

- search view: hide the add button for public views [\#243](https://github.com/rero/rero-ils-ui/pull/243) ([jma](https://github.com/jma))
- release: v0.1.0 [\#242](https://github.com/rero/rero-ils-ui/pull/242) ([jma](https://github.com/jma))
- Translate '/projects/admin/src/app/translate/i18n/en_US.json' in 'en' [\#241](https://github.com/rero/rero-ils-ui/pull/241) ([transifex-integration[bot]](https://github.com/apps/transifex-integration))
- Translate '/projects/admin/src/app/translate/i18n/en_US.json' in 'fr' [\#240](https://github.com/rero/rero-ils-ui/pull/240) ([transifex-integration[bot]](https://github.com/apps/transifex-integration))
- Translate '/projects/admin/src/app/translate/i18n/en_US.json' in 'de' [\#239](https://github.com/rero/rero-ils-ui/pull/239) ([transifex-integration[bot]](https://github.com/apps/transifex-integration))
- Translate '/projects/admin/src/app/translate/i18n/en_US.json' in 'it' [\#238](https://github.com/rero/rero-ils-ui/pull/238) ([transifex-integration[bot]](https://github.com/apps/transifex-integration))
- Translate '/projects/admin/src/app/translate/i18n/en_US.json' in 'ar' [\#235](https://github.com/rero/rero-ils-ui/pull/235) ([transifex-integration[bot]](https://github.com/apps/transifex-integration))
- Translate '/projects/admin/src/app/translate/i18n/en_US.json' in 'ar' [\#233](https://github.com/rero/rero-ils-ui/pull/233) ([transifex-integration[bot]](https://github.com/apps/transifex-integration))
- Translate '/projects/admin/src/app/translate/i18n/en_US.json' in 'es' [\#232](https://github.com/rero/rero-ils-ui/pull/232) ([transifex-integration[bot]](https://github.com/apps/transifex-integration))
- Translate '/projects/admin/src/app/translate/i18n/en_US.json' in 'nl' [\#231](https://github.com/rero/rero-ils-ui/pull/231) ([transifex-integration[bot]](https://github.com/apps/transifex-integration))
- Translate '/projects/admin/src/app/translate/i18n/en_US.json' in 'en' [\#227](https://github.com/rero/rero-ils-ui/pull/227) ([transifex-integration[bot]](https://github.com/apps/transifex-integration))
- Translate '/projects/admin/src/app/translate/i18n/en_US.json' in 'it' [\#226](https://github.com/rero/rero-ils-ui/pull/226) ([transifex-integration[bot]](https://github.com/apps/transifex-integration))
- Translate '/projects/public-search/src/app/translate/i18n/en_US.json' in 'it' [\#225](https://github.com/rero/rero-ils-ui/pull/225) ([transifex-integration[bot]](https://github.com/apps/transifex-integration))
- locations: hide action buttons depending of parent permissions [\#223](https://github.com/rero/rero-ils-ui/pull/223) ([zannkukai](https://github.com/zannkukai))
- Translate '/projects/admin/src/app/translate/i18n/en_US.json' in 'de' [\#221](https://github.com/rero/rero-ils-ui/pull/221) ([transifex-integration[bot]](https://github.com/apps/transifex-integration))
- Translate '/projects/admin/src/app/translate/i18n/en_US.json' in 'fr' [\#220](https://github.com/rero/rero-ils-ui/pull/220) ([transifex-integration[bot]](https://github.com/apps/transifex-integration))
- search: remove useless code [\#219](https://github.com/rero/rero-ils-ui/pull/219) ([AoNoOokami](https://github.com/AoNoOokami))
- transactions: bug fixing [\#218](https://github.com/rero/rero-ils-ui/pull/218) ([zannkukai](https://github.com/zannkukai))
- editor: fix uniqueness check value for locations [\#210](https://github.com/rero/rero-ils-ui/pull/210) ([jma](https://github.com/jma))
- document: fix cover image in brief view [\#205](https://github.com/rero/rero-ils-ui/pull/205) ([AoNoOokami](https://github.com/AoNoOokami))
- project code: rename a component [\#204](https://github.com/rero/rero-ils-ui/pull/204) ([AoNoOokami](https://github.com/AoNoOokami))
- request: fix request made by a librarian [\#201](https://github.com/rero/rero-ils-ui/pull/201) ([AoNoOokami](https://github.com/AoNoOokami))
- styles: display small badges on person search view [\#199](https://github.com/rero/rero-ils-ui/pull/199) ([zannkukai](https://github.com/zannkukai))
- release: v0.0.12 [\#197](https://github.com/rero/rero-ils-ui/pull/197) ([jma](https://github.com/jma))
- validate request form: set focus in search input [\#196](https://github.com/rero/rero-ils-ui/pull/196) ([AoNoOokami](https://github.com/AoNoOokami))
- git: fix github action [\#195](https://github.com/rero/rero-ils-ui/pull/195) ([AoNoOokami](https://github.com/AoNoOokami))
- Translate '/projects/admin/src/app/translate/i18n/en_US.json' in 'es' [\#194](https://github.com/rero/rero-ils-ui/pull/194) ([transifex-integration[bot]](https://github.com/apps/transifex-integration))
- Translate '/projects/admin/src/app/translate/i18n/en_US.json' in 'nl' [\#193](https://github.com/rero/rero-ils-ui/pull/193) ([transifex-integration[bot]](https://github.com/apps/transifex-integration))
- item: fix circulation info in detail view [\#192](https://github.com/rero/rero-ils-ui/pull/192) ([AoNoOokami](https://github.com/AoNoOokami))
- project: update contributors list [\#190](https://github.com/rero/rero-ils-ui/pull/190) ([blankoworld](https://github.com/blankoworld))
- circulation: fix display of patron in checkin view [\#189](https://github.com/rero/rero-ils-ui/pull/189) ([AoNoOokami](https://github.com/AoNoOokami))
- menu: centralize menu and frontpage data [\#183](https://github.com/rero/rero-ils-ui/pull/183) ([AoNoOokami](https://github.com/AoNoOokami))
- document: display url in detail view [\#180](https://github.com/rero/rero-ils-ui/pull/180) ([AoNoOokami](https://github.com/AoNoOokami))
- circulation: fix requests list with library switch [\#175](https://github.com/rero/rero-ils-ui/pull/175) ([jma](https://github.com/jma))
- document: add "show more" link [\#166](https://github.com/rero/rero-ils-ui/pull/166) ([zannkukai](https://github.com/zannkukai))
- circulation: Fees tab implementation [\#155](https://github.com/rero/rero-ils-ui/pull/155) ([zannkukai](https://github.com/zannkukai))
- item: add request on item by librarian [\#147](https://github.com/rero/rero-ils-ui/pull/147) ([Garfield-fr](https://github.com/Garfield-fr))

## [v0.0.13](https://github.com/rero/rero-ils-ui/tree/v0.0.13) (2020-04-09)

[Full Changelog](https://github.com/rero/rero-ils-ui/compare/v0.0.12...v0.0.13)

**Fixed bugs:**

- Trim barcode in the "Request" screen input box [\#213](https://github.com/rero/rero-ils-ui/issues/213)

**Closed issues:**

- Fee action menu are displayed far away from "action" button [\#209](https://github.com/rero/rero-ils-ui/issues/209)
- Missing styling rules in the professional interface [\#169](https://github.com/rero/rero-ils-ui/issues/169)
- Results page: the facet "libraries" is missing in the professional View. [\#140](https://github.com/rero/rero-ils-ui/issues/140)
- Is unique validation issue [\#93](https://github.com/rero/rero-ils-ui/issues/93)

## [v0.0.12](https://github.com/rero/rero-ils-ui/tree/v0.0.12) (2020-03-02)

[Full Changelog](https://github.com/rero/rero-ils-ui/compare/v0.0.11...v0.0.12)

**Fixed bugs:**

- Autocomplete is too slow to be usable [\#145](https://github.com/rero/rero-ils-ui/issues/145)

**Closed issues:**

- Group of issues found during tests of next release candidate [\#108](https://github.com/rero/rero-ils-ui/issues/108)

## [v0.0.11](https://github.com/rero/rero-ils-ui/tree/v0.0.11) (2020-02-26)

[Full Changelog](https://github.com/rero/rero-ils-ui/compare/v0.0.10...v0.0.11)

**Merged pull requests:**

- circulation: display pickup location name when transit for pickup [\#191](https://github.com/rero/rero-ils-ui/pull/191) ([AoNoOokami](https://github.com/AoNoOokami))
- circulation: fix in transit to issue [\#188](https://github.com/rero/rero-ils-ui/pull/188) ([AoNoOokami](https://github.com/AoNoOokami))
- circulation: fix several issues [\#187](https://github.com/rero/rero-ils-ui/pull/187) ([AoNoOokami](https://github.com/AoNoOokami))
- Translate '/projects/admin/src/app/translate/i18n/en_US.json' in 'ar' [\#184](https://github.com/rero/rero-ils-ui/pull/184) ([transifex-integration[bot]](https://github.com/apps/transifex-integration))
- circulation: display library name while transit [\#178](https://github.com/rero/rero-ils-ui/pull/178) ([blankoworld](https://github.com/blankoworld))
- document: display library name instead of code [\#174](https://github.com/rero/rero-ils-ui/pull/174) ([jma](https://github.com/jma))
- Translate '/projects/admin/src/app/translate/i18n/en_US.json' in 'nl' [\#173](https://github.com/rero/rero-ils-ui/pull/173) ([transifex-integration[bot]](https://github.com/apps/transifex-integration))
- item: fix item available actions on document detail view [\#172](https://github.com/rero/rero-ils-ui/pull/172) ([Garfield-fr](https://github.com/Garfield-fr))
- document: revert list headers to application/rero+json [\#170](https://github.com/rero/rero-ils-ui/pull/170) ([Garfield-fr](https://github.com/Garfield-fr))
- release: v0.0.11 [\#167](https://github.com/rero/rero-ils-ui/pull/167) ([jma](https://github.com/jma))
- homepage: fix my library switch on board [\#165](https://github.com/rero/rero-ils-ui/pull/165) ([Garfield-fr](https://github.com/Garfield-fr))
- Translate '/projects/admin/src/app/translate/i18n/en_US.json' in 'fr' [\#160](https://github.com/rero/rero-ils-ui/pull/160) ([transifex-integration[bot]](https://github.com/apps/transifex-integration))
- admin: improve frontpage [\#159](https://github.com/rero/rero-ils-ui/pull/159) ([AoNoOokami](https://github.com/AoNoOokami))
- tests: fix test by updating dependencies [\#158](https://github.com/rero/rero-ils-ui/pull/158) ([jma](https://github.com/jma))
- general: implement new service record permission [\#157](https://github.com/rero/rero-ils-ui/pull/157) ([Garfield-fr](https://github.com/Garfield-fr))
- document: add provision activity publication on brief view [\#156](https://github.com/rero/rero-ils-ui/pull/156) ([Garfield-fr](https://github.com/Garfield-fr))
- angular: update angular packages [\#154](https://github.com/rero/rero-ils-ui/pull/154) ([AoNoOokami](https://github.com/AoNoOokami))
- Translate '/projects/admin/src/app/translate/i18n/en_US.json' in 'es' [\#153](https://github.com/rero/rero-ils-ui/pull/153) ([transifex-integration[bot]](https://github.com/apps/transifex-integration))
- circulation: correct pickup location for actions [\#152](https://github.com/rero/rero-ils-ui/pull/152) ([AoNoOokami](https://github.com/AoNoOokami))
- Translate '/projects/admin/src/app/translate/i18n/en_US.json' in 'en' [\#151](https://github.com/rero/rero-ils-ui/pull/151) ([transifex-integration[bot]](https://github.com/apps/transifex-integration))
- Translate '/projects/admin/src/app/translate/i18n/en_US.json' in 'fr' [\#150](https://github.com/rero/rero-ils-ui/pull/150) ([transifex-integration[bot]](https://github.com/apps/transifex-integration))
- Translate '/projects/admin/src/app/translate/i18n/en_US.json' in 'de' [\#149](https://github.com/rero/rero-ils-ui/pull/149) ([transifex-integration[bot]](https://github.com/apps/transifex-integration))
- Translate '/projects/public-search/src/app/translate/i18n/en_US.json' in 'de' [\#148](https://github.com/rero/rero-ils-ui/pull/148) ([transifex-integration[bot]](https://github.com/apps/transifex-integration))
- circulation: fix on loan tab behaviour [\#146](https://github.com/rero/rero-ils-ui/pull/146) ([AoNoOokami](https://github.com/AoNoOokami))
- switch library: fix the display of the switch menu on the homepage [\#144](https://github.com/rero/rero-ils-ui/pull/144) ([Garfield-fr](https://github.com/Garfield-fr))
- header: fix broken rero ils source \(base64 convert\) [\#143](https://github.com/rero/rero-ils-ui/pull/143) ([Garfield-fr](https://github.com/Garfield-fr))
- general: use version 0.0.30 of ng-core [\#142](https://github.com/rero/rero-ils-ui/pull/142) ([Garfield-fr](https://github.com/Garfield-fr))
- person tab: fix count [\#139](https://github.com/rero/rero-ils-ui/pull/139) ([Garfield-fr](https://github.com/Garfield-fr))
- header: replace text RERO ILS with the logo [\#138](https://github.com/rero/rero-ils-ui/pull/138) ([Garfield-fr](https://github.com/Garfield-fr))
- item: hide action button on item if the user is not in the same library [\#137](https://github.com/rero/rero-ils-ui/pull/137) ([Garfield-fr](https://github.com/Garfield-fr))
- item: access control with a guard [\#136](https://github.com/rero/rero-ils-ui/pull/136) ([Garfield-fr](https://github.com/Garfield-fr))
- routing: redirect after saving a resource [\#135](https://github.com/rero/rero-ils-ui/pull/135) ([AoNoOokami](https://github.com/AoNoOokami))
- menu: add new option to add class on submenu [\#134](https://github.com/rero/rero-ils-ui/pull/134) ([Garfield-fr](https://github.com/Garfield-fr))
- resources: add sort option for libraries and locations [\#133](https://github.com/rero/rero-ils-ui/pull/133) ([Garfield-fr](https://github.com/Garfield-fr))
- circulation: set focus on search input [\#132](https://github.com/rero/rero-ils-ui/pull/132) ([AoNoOokami](https://github.com/AoNoOokami))
- circulation: improve error messages [\#131](https://github.com/rero/rero-ils-ui/pull/131) ([AoNoOokami](https://github.com/AoNoOokami))
- git: remove tgz [\#130](https://github.com/rero/rero-ils-ui/pull/130) ([AoNoOokami](https://github.com/AoNoOokami))
- item: filter locations with current library of user connected [\#129](https://github.com/rero/rero-ils-ui/pull/129) ([Garfield-fr](https://github.com/Garfield-fr))
- circulation: add link to patron profile [\#128](https://github.com/rero/rero-ils-ui/pull/128) ([AoNoOokami](https://github.com/AoNoOokami))
- US813 circulation ui [\#127](https://github.com/rero/rero-ils-ui/pull/127) ([AoNoOokami](https://github.com/AoNoOokami))
- person: implement documents on detail view [\#126](https://github.com/rero/rero-ils-ui/pull/126) ([Garfield-fr](https://github.com/Garfield-fr))
- routing: implement new route collection with classes [\#125](https://github.com/rero/rero-ils-ui/pull/125) ([Garfield-fr](https://github.com/Garfield-fr))
- acquisition: link order line to a document [\#124](https://github.com/rero/rero-ils-ui/pull/124) ([lauren-d](https://github.com/lauren-d))
- Acquisition [\#120](https://github.com/rero/rero-ils-ui/pull/120) ([lauren-d](https://github.com/lauren-d))
- document: refactoring provision activity field for new structure [\#118](https://github.com/rero/rero-ils-ui/pull/118) ([Garfield-fr](https://github.com/Garfield-fr))
- public search: fixing the facet display [\#117](https://github.com/rero/rero-ils-ui/pull/117) ([Garfield-fr](https://github.com/Garfield-fr))
- service: add new service to load organisation before application start [\#114](https://github.com/rero/rero-ils-ui/pull/114) ([Garfield-fr](https://github.com/Garfield-fr))
- Translate '/projects/admin/src/app/translate/i18n/en_US.json' in 'fr' [\#113](https://github.com/rero/rero-ils-ui/pull/113) ([transifex-integration[bot]](https://github.com/apps/transifex-integration))
- Translate '/projects/admin/src/app/translate/i18n/en_US.json' in 'en' [\#111](https://github.com/rero/rero-ils-ui/pull/111) ([transifex-integration[bot]](https://github.com/apps/transifex-integration))
- Translate '/projects/admin/src/app/translate/i18n/en_US.json' in 'es' [\#110](https://github.com/rero/rero-ils-ui/pull/110) ([transifex-integration[bot]](https://github.com/apps/transifex-integration))
- budgets: add component budget and accounts [\#107](https://github.com/rero/rero-ils-ui/pull/107) ([Garfield-fr](https://github.com/Garfield-fr))
- git: automate release process [\#105](https://github.com/rero/rero-ils-ui/pull/105) ([AoNoOokami](https://github.com/AoNoOokami))

## [v0.0.10](https://github.com/rero/rero-ils-ui/tree/v0.0.10) (2020-02-13)

[Full Changelog](https://github.com/rero/rero-ils-ui/compare/v0.0.9...v0.0.10)

**Fixed bugs:**

- Switch libraries menu [\#141](https://github.com/rero/rero-ils-ui/issues/141)

## [v0.0.9](https://github.com/rero/rero-ils-ui/tree/v0.0.9) (2020-01-13)

[Full Changelog](https://github.com/rero/rero-ils-ui/compare/v0.0.8...v0.0.9)

**Merged pull requests:**

- editor: fix item and document update [\#109](https://github.com/rero/rero-ils-ui/pull/109) ([jma](https://github.com/jma))

## [v0.0.8](https://github.com/rero/rero-ils-ui/tree/v0.0.8) (2020-01-09)

[Full Changelog](https://github.com/rero/rero-ils-ui/compare/v0.0.7...v0.0.8)

**Merged pull requests:**

- editor: move to ngx-formly [\#104](https://github.com/rero/rero-ils-ui/pull/104) ([jma](https://github.com/jma))

## [v0.0.7](https://github.com/rero/rero-ils-ui/tree/v0.0.7) (2020-01-08)

[Full Changelog](https://github.com/rero/rero-ils-ui/compare/v0.0.6...v0.0.7)

**Merged pull requests:**

- Translate '/projects/public-search/src/app/translate/i18n/en_US.json' in 'ar' [\#94](https://github.com/rero/rero-ils-ui/pull/94) ([transifex-integration[bot]](https://github.com/apps/transifex-integration))
- Translate '/projects/admin/src/app/translate/i18n/en_US.json' in 'es' [\#90](https://github.com/rero/rero-ils-ui/pull/90) ([transifex-integration[bot]](https://github.com/apps/transifex-integration))
- Translate '/projects/public-search/src/app/translate/i18n/en_US.json' in 'es' [\#89](https://github.com/rero/rero-ils-ui/pull/89) ([transifex-integration[bot]](https://github.com/apps/transifex-integration))
- menu: add 'switch to public view' entry menu [\#88](https://github.com/rero/rero-ils-ui/pull/88) ([Garfield-fr](https://github.com/Garfield-fr))
- translation: fix checkin flash messages [\#86](https://github.com/rero/rero-ils-ui/pull/86) ([AoNoOokami](https://github.com/AoNoOokami))
- Translate '/projects/public-search/src/app/translate/i18n/en_US.json' in 'fr' [\#84](https://github.com/rero/rero-ils-ui/pull/84) ([transifex-integration[bot]](https://github.com/apps/transifex-integration))
- documentation: update translation section [\#82](https://github.com/rero/rero-ils-ui/pull/82) ([AoNoOokami](https://github.com/AoNoOokami))
- circulation : fix circulation permission problems [\#80](https://github.com/rero/rero-ils-ui/pull/80) ([zannkukai](https://github.com/zannkukai))

## [v0.0.6](https://github.com/rero/rero-ils-ui/tree/v0.0.6) (2019-12-11)

[Full Changelog](https://github.com/rero/rero-ils-ui/compare/v0.0.5...v0.0.6)

## [v0.0.5](https://github.com/rero/rero-ils-ui/tree/v0.0.5) (2019-12-11)

[Full Changelog](https://github.com/rero/rero-ils-ui/compare/v0.0.4...v0.0.5)

**Fixed bugs:**

- Group of issues found during test of rero-ils-ui [\#43](https://github.com/rero/rero-ils-ui/issues/43)

## [v0.0.4](https://github.com/rero/rero-ils-ui/tree/v0.0.4) (2019-12-10)

[Full Changelog](https://github.com/rero/rero-ils-ui/compare/v0.0.3...v0.0.4)

**Merged pull requests:**

- edit: fix editor validation colors [\#81](https://github.com/rero/rero-ils-ui/pull/81) ([jma](https://github.com/jma))
- ui: link to rero-ils [\#79](https://github.com/rero/rero-ils-ui/pull/79) ([AoNoOokami](https://github.com/AoNoOokami))
- document: improve holding display [\#74](https://github.com/rero/rero-ils-ui/pull/74) ([AoNoOokami](https://github.com/AoNoOokami))
- documents: simplify brief view [\#72](https://github.com/rero/rero-ils-ui/pull/72) ([AoNoOokami](https://github.com/AoNoOokami))
- custom-editor: fix back history [\#71](https://github.com/rero/rero-ils-ui/pull/71) ([AoNoOokami](https://github.com/AoNoOokami))
- editor: fix post when cancelling [\#70](https://github.com/rero/rero-ils-ui/pull/70) ([AoNoOokami](https://github.com/AoNoOokami))
- public-search: show the search input for persons [\#69](https://github.com/rero/rero-ils-ui/pull/69) ([jma](https://github.com/jma))
- ci-po: improve settings display in detail view [\#68](https://github.com/rero/rero-ils-ui/pull/68) ([AoNoOokami](https://github.com/AoNoOokami))
- libraries: Fix form reset creation [\#67](https://github.com/rero/rero-ils-ui/pull/67) ([Garfield-fr](https://github.com/Garfield-fr))
- Translate '/projects/public-search/src/app/translate/i18n/en_US.json' in 'fr' [\#66](https://github.com/rero/rero-ils-ui/pull/66) ([transifex-integration[bot]](https://github.com/apps/transifex-integration))
- libraries: correct code display [\#64](https://github.com/rero/rero-ils-ui/pull/64) ([AoNoOokami](https://github.com/AoNoOokami))
- library: reject hours with value 00:00 [\#63](https://github.com/rero/rero-ils-ui/pull/63) ([Garfield-fr](https://github.com/Garfield-fr))
- public-search: expand persons facet [\#62](https://github.com/rero/rero-ils-ui/pull/62) ([AoNoOokami](https://github.com/AoNoOokami))
- admin & public-search: add missing translations [\#61](https://github.com/rero/rero-ils-ui/pull/61) ([AoNoOokami](https://github.com/AoNoOokami))
- patrons: implement detail view [\#60](https://github.com/rero/rero-ils-ui/pull/60) ([Garfield-fr](https://github.com/Garfield-fr))
- persons: fix sources facet [\#59](https://github.com/rero/rero-ils-ui/pull/59) ([Garfield-fr](https://github.com/Garfield-fr))
- documents: fix author link [\#57](https://github.com/rero/rero-ils-ui/pull/57) ([Garfield-fr](https://github.com/Garfield-fr))

## [v0.0.3](https://github.com/rero/rero-ils-ui/tree/v0.0.3) (2019-12-03)

[Full Changelog](https://github.com/rero/rero-ils-ui/compare/v0.0.2...v0.0.3)

**Closed issues:**

- Harmonize "Start time" string. [\#33](https://github.com/rero/rero-ils-ui/issues/33)

**Merged pull requests:**

- public-search: third organisation and facet correction [\#56](https://github.com/rero/rero-ils-ui/pull/56) ([AoNoOokami](https://github.com/AoNoOokami))
- Us987 admin public final [\#55](https://github.com/rero/rero-ils-ui/pull/55) ([jma](https://github.com/jma))
- Translate '/projects/admin/src/app/translate/i18n/en_US.json' in 'en' [\#49](https://github.com/rero/rero-ils-ui/pull/49) ([transifex-integration[bot]](https://github.com/apps/transifex-integration))
- Us986 admin homepage [\#36](https://github.com/rero/rero-ils-ui/pull/36) ([jma](https://github.com/jma))
- template: update PR template [\#35](https://github.com/rero/rero-ils-ui/pull/35) ([AoNoOokami](https://github.com/AoNoOokami))
- git: add PR and issue template [\#24](https://github.com/rero/rero-ils-ui/pull/24) ([AoNoOokami](https://github.com/AoNoOokami))

## [v0.0.2](https://github.com/rero/rero-ils-ui/tree/v0.0.2) (2019-10-22)

[Full Changelog](https://github.com/rero/rero-ils-ui/compare/1a44b8c7919a1b53e72c74f6196a99d1c13a7ae9...v0.0.2)

**Merged pull requests:**

- circulation-ui: backport components [\#10](https://github.com/rero/rero-ils-ui/pull/10) ([jma](https://github.com/jma))
- fix tests [\#9](https://github.com/rero/rero-ils-ui/pull/9) ([jma](https://github.com/jma))
- public-search: complete brief view [\#8](https://github.com/rero/rero-ils-ui/pull/8) ([AoNoOokami](https://github.com/AoNoOokami))
- admin: add mylibrary and translation mechanism [\#7](https://github.com/rero/rero-ils-ui/pull/7) ([Garfield-fr](https://github.com/Garfield-fr))
- project: add commit message template [\#5](https://github.com/rero/rero-ils-ui/pull/5) ([sebdeleze](https://github.com/sebdeleze))
- build: Optimization on build [\#2](https://github.com/rero/rero-ils-ui/pull/2) ([sebdeleze](https://github.com/sebdeleze))
- project: Libraries dependencies [\#1](https://github.com/rero/rero-ils-ui/pull/1) ([sebdeleze](https://github.com/sebdeleze))
