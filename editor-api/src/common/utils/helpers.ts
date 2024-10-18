import { mkdirSync, writeFileSync } from 'fs';
import { Publication } from '../entities';

export async function generateManifest(publication: Publication) {
  const path = './public/manifests';

  mkdirSync(path, { recursive: true });
  writeFileSync(`${path}/${publication.id}.json`, JSON.stringify(publication));
}
