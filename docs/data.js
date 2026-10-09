'use strict';

// すべて架空のデータ。実在の施設・人物・公開データとは無関係。
// managed: 手元の管理データ10件。pub: 今月分の公開データ11件（うち1件は形式誤り）。
// 期待される照合結果: 新規1件・変更2件・削除候補1件・一致7件・形式エラー1件。

const MANAGED = [
  { id: 'F-0001', name: 'さくら通り診療所', postal: '100-0001', address: '架空県架空市さくら通り1-1', phone: '03-1234-5678' },
  { id: 'F-0002', name: 'みどり台歯科', postal: '100-0002', address: '架空県架空市みどり台2-3', phone: '03-1234-1111' },
  { id: 'F-0003', name: 'あおぞら薬局', postal: '100-0003', address: '架空県架空市あおぞら町3-5', phone: '03-1234-2222' },
  { id: 'F-0004', name: 'ひだまり接骨院', postal: '100-0004', address: '架空県架空市ひだまり4-2', phone: '03-1234-3333' },
  { id: 'F-0005', name: 'かもめ内科', postal: '100-0005', address: '架空県架空市かもめ浜5-1', phone: '03-1234-4444' },
  { id: 'F-0006', name: 'つばめ小児科', postal: '100-0006', address: '架空県架空市つばめ丘6-4', phone: '03-1234-5555' },
  { id: 'F-0007', name: 'もみじ眼科', postal: '100-0007', address: '架空県架空市もみじ坂7-2', phone: '03-1234-6666' },
  { id: 'F-0008', name: 'さつき産婦人科', postal: '100-0008', address: '架空県架空市さつき野8-6', phone: '03-1234-7777' },
  { id: 'F-0009', name: 'わかば皮膚科', postal: '100-0009', address: '架空県架空市わかば台9-3', phone: '03-1234-8888' },
  { id: 'F-0010', name: 'はなみずき耳鼻科', postal: '100-0010', address: '架空県架空市はなみずき10-7', phone: '03-1234-9999' },
];

const PUBLIC = [
  { id: 'F-0001', name: 'さくら通り診療所', postal: '100-0001', address: '架空県架空市さくら通り1-1', phone: '03-1234-5678' },
  { id: 'F-0002', name: 'みどり台歯科', postal: '100-0002', address: '架空県架空市みどり台2-3', phone: '03-1234-1212' },
  { id: 'F-0003', name: 'あおぞら薬局', postal: '100-0003', address: '架空県架空市あおぞら町3-9', phone: '03-1234-2222' },
  { id: 'F-0005', name: 'かもめ内科', postal: '100-0005', address: '架空県架空市かもめ浜5-1', phone: '03-1234-4444' },
  { id: 'F-0006', name: 'つばめ小児科', postal: '100-0006', address: '架空県架空市つばめ丘6-4', phone: '03-1234-5555' },
  { id: 'F-0007', name: 'もみじ眼科', postal: '100-0007', address: '架空県架空市もみじ坂7-2', phone: '03-1234-6666' },
  { id: 'F-0008', name: 'さつき産婦人科', postal: '100-0008', address: '架空県架空市さつき野8-6', phone: '03-1234-7777' },
  { id: 'F-0009', name: 'わかば皮膚科', postal: '100-0009', address: '架空県架空市わかば台9-3', phone: '03-1234-8888' },
  { id: 'F-0010', name: 'はなみずき耳鼻科', postal: '100-0010', address: '架空県架空市はなみずき10-7', phone: '03-1234-9999' },
  { id: 'F-0011', name: 'おおぞら整形外科', postal: '100-0011', address: '架空県架空市おおぞら11-1', phone: '03-1234-0000' },
  { id: 'F-0012', name: 'こだま心療内科', postal: '100-0012', address: '架空県架空市こだま12-2', phone: '電話番号不明' },
];

const sampleApi = { MANAGED, PUBLIC };

if (typeof module !== 'undefined' && module.exports) {
  module.exports = sampleApi;
}
if (typeof globalThis !== 'undefined') {
  globalThis.SampleData = sampleApi;
}
