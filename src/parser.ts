import { BibleInfo } from './interfaces/bibleIndex';
import { OsisObject } from './interfaces/osisObject';
import { EntityOptions, ParsedEntity, ParseResult } from './interfaces/parseResult';

const versionKeyword = /^version\s"([^"]+)"$/;
const versionsKeyword = /^versions\s("[^"]+"(?:,\s?"[^"]+")*)(?: (par))?$/;
const helpKeyword = /^help$/;
const indexKeyword = /^index(?: ([^\s]+))?$/;
const emptyLine = /^\s*$/;
const citationRegExp = /^\(([^\(\)]+)\)$/;

export interface BcvParser {
  translation_info(): BibleInfo;
  set_options(options: Record<string, string>): void;
  parse(input: string): {
    osis(): string;
    parsed_entities(): Array<OsisObject>;
  };
}

export default function parser(
  tokenContent: string,
  bcvParser: BcvParser,
  availableVersions: Array<string>
): ParseResult {
  const lines = tokenContent.split('\n');
  const entities: Array<ParsedEntity> = [{ osisObjects: [], versions: ['default'] }];

  const bibleInfo = bcvParser.translation_info();

  bcvParser.set_options({
    osis_compaction_strategy: 'bcv',
    consecutive_combination_strategy: 'separate',
  });

  let errorMessage: string | null = null;

  linesLoop: for (const line of lines) {
    let match: RegExpMatchArray | null;

    match = line.match(citationRegExp);

    if (match) {
      const parsed = bcvParser.parse(match[1]);
      const osisId = parsed.osis();

      if (osisId === '') {
        errorMessage = `Invalid citation: "${match[1]}"`;
        break;
      }

      const current = entities[entities.length - 1];
      current.osisObjects.push(parsed.parsed_entities()[0]);
      continue;
    }

    match = line.match(versionKeyword);

    if (match) {
      const result = extractVersion(match[1], availableVersions);

      if (result.type === 'error') {
        errorMessage = result.errorMessage!;
        break;
      }

      const pushResult = pushNewEntity(entities, [result.version!]);

      if (pushResult.type === 'error') {
        errorMessage = pushResult.errorMessage!;
        break;
      }

      continue;
    }

    match = line.match(versionsKeyword);

    if (match) {
      const extractedVersions = parseVersionList(match[1], availableVersions);

      if (extractedVersions.type === 'error') {
        errorMessage = extractedVersions.errorMessage!;
        break linesLoop;
      }

      const options: EntityOptions = {
        parallel: match[2] ? true : false,
      };

      const pushResult = pushNewEntity(entities, extractedVersions.versions!, options);

      if (pushResult.type === 'error') {
        errorMessage = pushResult.errorMessage!;
        break;
      }

      continue;
    }

    match = line.match(helpKeyword);

    if (match) {
      return { type: 'help' };
    }

    match = line.match(indexKeyword);

    if (match) {
      if (match[1]) {
        const chapters = bibleInfo.chapters[match[1]];

        if (!chapters) {
          return { type: 'error', errorMessage: `Invalid OSIS ID: "${match[1]}"` };
        }

        return { type: 'index', bookId: match[1] };
      }

      return { type: 'index' };
    }

    match = line.match(emptyLine);

    if (match) continue;

    errorMessage = `Invalid syntax: ${line}\nType "help" for a list of commands`;
    break;
  }

  if (entities[0].osisObjects.length === 0 && errorMessage === null) {
    errorMessage = 'No citation specified. Try writing "(Genesis 1:1)"';
  }

  if (errorMessage) {
    return { type: 'error', errorMessage };
  }

  return { type: 'entities', entities };
}

function parseVersionList(
  raw: string,
  availableVersions: Array<string>
): { type: 'version'; versions: Array<string> } | { type: 'error'; errorMessage: string } {
  const versions: string[] = [];
  const parts = raw.split(',');

  for (const part of parts) {
    const version = part.replace(/(?:^\s")+|"+/g, '');
    const result = extractVersion(version, availableVersions);

    if (result.type === 'error') return { type: 'error', errorMessage: result.errorMessage! };

    if (!versions.includes(result.version!)) {
      versions.push(result.version!);
    }
  }

  return { type: 'version', versions };
}

function extractVersion(string: string, availableVersions: Array<string>): ExtractResult {
  if (!availableVersions.includes(string)) {
    return {
      type: 'error',
      errorMessage:
        `Not imported Bible version: ${string}\n` +
        'Available versions:\n' +
        `${availableVersions.toString().replace(/,/g, '\n')}`,
    };
  }

  return { type: 'version', version: string };
}

function pushNewEntity(entities: Array<ParsedEntity>, versions: Array<string>, options?: EntityOptions): PushResult {
  const prevEntity = entities[entities.length - 1];

  if (prevEntity.osisObjects.length === 0) {
    if (prevEntity.versions[0] === 'default') {
      entities.pop();
    } else {
      return {
        type: 'error',
        errorMessage: 'You have to specify at least one citation before declaring a new version',
      };
    }
  }

  entities.push({ osisObjects: [], versions, options });

  return { type: 'success' };
}

interface ExtractResult {
  type: 'version' | 'error';
  version?: string;
  errorMessage?: string;
}

interface PushResult {
  type: 'success' | 'error';
  errorMessage?: string;
}
