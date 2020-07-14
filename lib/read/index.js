import fs from 'fs';
import path from 'path';

const { promises: { readFile } } = fs;
const { resolve } = path;

export default async (path) => (await readFile(resolve(path))).toString();
