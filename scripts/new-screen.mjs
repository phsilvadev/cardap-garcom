#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const screensDir = path.resolve(__dirname, '../src/screens');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ask = (question) =>
  new Promise((resolve) => rl.question(question, resolve));
const toPascal = (value) =>
  value
    .replace(/(^\w|-\w|_\w)/g, (part) => part.replace(/[-_]/, '').toUpperCase())
    .replace(/\s+/g, '');

function screenTemplate(name) {
  return `import { Text } from 'react-native';

import { Screen } from '@/components/Screen';

export function ${name}Screen() {
  return (
    <Screen>
      <Text className="text-2xl font-bold text-white">${name}</Text>
      <Text className="mt-2 text-base text-slate-300">
        Nova tela pronta para customizacao.
      </Text>
    </Screen>
  );
}
`;
}

async function main() {
  const rawName = String(await ask('Nome da tela (ex: profile): ')).trim();

  if (!rawName) {
    console.error('Nome invalido.');
    process.exit(1);
  }

  const folder = rawName.toLowerCase().replace(/\s+/g, '-');
  const name = toPascal(rawName);
  const file = path.join(screensDir, folder, `${name}Screen.tsx`);

  if (fs.existsSync(file)) {
    console.error(`A tela ja existe: ${path.relative(process.cwd(), file)}`);
    process.exit(1);
  }

  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, screenTemplate(name), 'utf8');
  rl.close();

  console.log(`Tela criada em ${path.relative(process.cwd(), file)}`);
  console.log(
    'Registre a rota em src/navigation se ela precisar aparecer no app.',
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
