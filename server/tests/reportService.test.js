import test from 'node:test';
import assert from 'node:assert/strict';

import { generateReportId } from '../src/services/reportService.js';

test('generateReportId creates a readable agricultural report identifier', () => {
  const reportId = generateReportId(1, new Date('2026-01-01T00:00:00.000Z'));
  assert.equal(reportId, 'AGR-2026-00001');
});

test('generateReportId keeps a minimum 5 digit sequence', () => {
  const reportId = generateReportId(42, new Date('2026-05-10T00:00:00.000Z'));
  assert.equal(reportId, 'AGR-2026-00042');
});
