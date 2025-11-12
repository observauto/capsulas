#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

function resolveProjectRoot() {
  const initCwd = process.env.INIT_CWD;
  if (initCwd && fs.existsSync(initCwd)) {
    return initCwd;
  }
  return process.cwd();
}

function detectPatchCommand() {
  const patchCheck = spawnSync('patch', ['--version'], { stdio: 'ignore' });
  if (!patchCheck.error && patchCheck.status === 0) {
    return {
      command: 'patch',
      args: (file) => ['-p1', '-N', '--no-backup-if-mismatch', '-i', file]
    };
  }

  const gitCheck = spawnSync('git', ['--version'], { stdio: 'ignore' });
  if (!gitCheck.error && gitCheck.status === 0) {
    return {
      command: 'git',
      args: (file) => ['apply', '--whitespace=nowarn', file]
    };
  }

  return null;
}

function applyPatches(rootDir, patchDir) {
  const entries = fs
    .readdirSync(patchDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.patch'))
    .map((entry) => entry.name)
    .sort();

  if (entries.length === 0) {
    return { applied: 0 };
  }

  const runner = detectPatchCommand();
  if (!runner) {
    console.warn('patch-package (local): no suitable patch utility found (patch or git).');
    return { applied: 0 };
  }

  for (const file of entries) {
    const fullPath = path.join(patchDir, file);
    const result = spawnSync(runner.command, runner.args(fullPath), {
      stdio: 'inherit',
      cwd: rootDir,
      env: process.env,
    });

    if (result.status !== 0) {
      console.error(`patch-package (local): failed to apply ${file}`);
      process.exit(result.status || 1);
    }
  }

  return { applied: entries.length };
}

function main() {
  const rootDir = resolveProjectRoot();
  const patchDir = path.join(rootDir, 'patches');

  if (!fs.existsSync(patchDir)) {
    return;
  }

  const { applied } = applyPatches(rootDir, patchDir);
  if (applied > 0) {
    console.log(`patch-package (local): applied ${applied} patch${applied === 1 ? '' : 'es'}.`);
  }
}

main();
