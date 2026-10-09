'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const { validateRecord, diffRecords, summarize } = require('../docs/check.js');
const { MANAGED, PUBLIC } = require('../docs/data.js');

test('追加・変更・終了候補・一致を件数どおりに分類する', () => {
  const diff = diffRecords(MANAGED, PUBLIC);
  const summary = summarize(diff);
  assert.equal(summary.added, 1);
  assert.equal(summary.changed, 2);
  assert.equal(summary.removed, 1);
  assert.equal(summary.unchanged, 7);
  assert.equal(summary.invalid, 1);
});

test('変わった項目名を電話番号と住所として列挙する', () => {
  const diff = diffRecords(MANAGED, PUBLIC);
  const byId = new Map(diff.changed.map((c) => [c.after.id, c.changedFields]));
  assert.deepEqual(byId.get('F-0002'), ['phone']);
  assert.deepEqual(byId.get('F-0003'), ['address']);
});

test('電話番号の形式が誤っている公開レコードを検出する', () => {
  const bad = { id: 'F-0012', name: 'こだま心療内科', postal: '100-0012', address: '架空県架空市こだま12-2', phone: '電話番号不明' };
  const errors = validateRecord(bad);
  assert.ok(errors.includes('電話番号の形式'));
  const diff = diffRecords(MANAGED, PUBLIC);
  assert.equal(diff.invalid.length, 1);
  assert.equal(diff.invalid[0].record.id, 'F-0012');
});

test('公開データ側で重複したIDを誤りとして検出する', () => {
  const managed = [{ id: 'F-0001', name: 'さくら通り診療所', postal: '100-0001', address: '架空県架空市さくら通り1-1', phone: '03-1234-5678' }];
  const pub = [
    { id: 'F-0001', name: 'さくら通り診療所', postal: '100-0001', address: '架空県架空市さくら通り1-1', phone: '03-1234-5678' },
    { id: 'F-0001', name: 'さくら通り診療所', postal: '100-0001', address: '架空県架空市さくら通り1-1', phone: '03-1234-5678' },
  ];
  const diff = diffRecords(managed, pub);
  assert.equal(diff.invalid.length, 1);
  assert.ok(diff.invalid[0].errors.includes('IDが重複'));
});

test('前後の空白の違いだけでは変更とみなさない', () => {
  const managed = [{ id: 'F-0001', name: 'さくら通り診療所', postal: '100-0001', address: '架空県架空市さくら通り1-1', phone: '03-1234-5678' }];
  const pub = [{ id: ' F-0001 ', name: 'さくら通り診療所 ', postal: '100-0001', address: '架空県架空市さくら通り1-1', phone: '03-1234-5678' }];
  const diff = diffRecords(managed, pub);
  assert.equal(diff.unchanged.length, 1);
  assert.equal(diff.changed.length, 0);
});
