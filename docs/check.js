'use strict';

// 公開データと管理データの照合ロジック。
// ブラウザ（docs/index.html）と Node（test/）の両方で使うため、
// グローバル公開と CommonJS の両対応にしている。

function trim(value) {
  return typeof value === 'string' ? value.trim() : value;
}

// 1件ぶんの形式を点検し、誤りの内容を配列で返す。空配列なら正常。
function validateRecord(record) {
  const errors = [];
  const rec = record || {};
  if (!/^[A-Z]-\d{4}$/.test(trim(rec.id) || '')) {
    errors.push('IDの形式');
  }
  if (!trim(rec.name)) {
    errors.push('名前が空');
  }
  if (!/^\d{3}-\d{4}$/.test(trim(rec.postal) || '')) {
    errors.push('郵便番号の形式');
  }
  if (!/^0\d{1,4}-\d{2,4}-\d{4}$/.test(trim(rec.phone) || '')) {
    errors.push('電話番号の形式');
  }
  if (!trim(rec.address)) {
    errors.push('住所が空');
  }
  return errors;
}

const COMPARE_FIELDS = ['name', 'postal', 'address', 'phone'];

// 管理データ managed と公開データ pub をIDで突き合わせて分類する。
// 戻り値: { added, removed, changed, unchanged, invalid }
// - added: 公開だけにある（新規候補）
// - removed: 管理だけにある（終了・削除候補）
// - changed: 両方にあるが項目が違う（更新候補。changedFields 付き）
// - unchanged: 両方にあり項目も同じ
// - invalid: 形式の誤り・ID重複がある公開レコード（照合から除外）
function diffRecords(managed, pub) {
  const added = [];
  const removed = [];
  const changed = [];
  const unchanged = [];
  const invalid = [];

  const managedById = new Map();
  for (const m of managed || []) {
    managedById.set(trim(m.id), m);
  }

  const seenPublicIds = new Map();
  for (const p of pub || []) {
    const id = trim(p.id);
    const count = (seenPublicIds.get(id) || 0) + 1;
    seenPublicIds.set(id, count);

    const formatErrors = validateRecord(p);
    if (count > 1) {
      formatErrors.push('IDが重複');
    }
    if (formatErrors.length > 0) {
      invalid.push({ record: p, errors: formatErrors });
      continue;
    }

    const m = managedById.get(id);
    if (!m) {
      added.push({ record: p });
      continue;
    }
    const changedFields = COMPARE_FIELDS.filter(
      (key) => trim(m[key]) !== trim(p[key])
    );
    if (changedFields.length > 0) {
      changed.push({ before: m, after: p, changedFields });
    } else {
      unchanged.push({ record: p });
    }
  }

  const publicIds = new Set(
    (pub || []).map((p) => trim(p.id))
  );
  for (const m of managed || []) {
    if (!publicIds.has(trim(m.id))) {
      removed.push({ record: m });
    }
  }

  return { added, removed, changed, unchanged, invalid };
}

function summarize(diff) {
  return {
    added: diff.added.length,
    removed: diff.removed.length,
    changed: diff.changed.length,
    unchanged: diff.unchanged.length,
    invalid: diff.invalid.length,
  };
}

const checkApi = { validateRecord, diffRecords, summarize, COMPARE_FIELDS };

if (typeof module !== 'undefined' && module.exports) {
  module.exports = checkApi;
}
if (typeof globalThis !== 'undefined') {
  globalThis.CheckLogic = checkApi;
}
