import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { VERSION_CONFIG } from '../version.config';

const rootDir = path.join(__dirname, '..');
const packageJsonPath = path.join(rootDir, 'package.json');
const versionFilePath = path.join(rootDir, '.version');

function getCurrentPatch(): number {
  if (fs.existsSync(versionFilePath)) {
    const content = fs.readFileSync(versionFilePath, 'utf-8').trim();
    const patch = Number.parseInt(content, 10);
    return Number.isNaN(patch) ? 0 : patch;
  }
  return 0;
}

function incrementPatch(): number {
  const currentPatch = getCurrentPatch();
  const newPatch = currentPatch + 1;
  fs.writeFileSync(versionFilePath, String(newPatch), 'utf-8');
  return newPatch;
}

function updatePackageJson(version: string) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  packageJson.version = version;
  fs.writeFileSync(
    packageJsonPath,
    `${JSON.stringify(packageJson, null, 2)}\n`,
    'utf-8',
  );
}

function main() {
  const patch = incrementPatch();
  const version = `${VERSION_CONFIG.major}.${VERSION_CONFIG.minor}.${patch}`;

  console.log(`Building version ${version}...`);

  updatePackageJson(version);

  execSync(
    'tsup src/index.ts --format cjs,esm --dts --clean --tsconfig tsconfig.build.json',
    {
      stdio: 'inherit',
    },
  );

  console.log(`✓ Build complete: v${version}`);
}

main();
