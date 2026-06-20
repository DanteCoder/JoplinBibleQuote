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
  let parseResult: ParseResult = {
    type: 'entities',
    entities: [
      {
        osisObjects: [],
        versions: ['default'],
      },
    ],
  };

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
      const osisId = bcvParser.parse(match[1]).osis();

      if (osisId === '') {
        errorMessage = `Invalid citation: "${match[1]}"`;
        break;
      }

      const bcvParsedObject: OsisObject = bcvParser.parse(match[1]).parsed_entities()[0];

      if (parseResult.entities) {
        const entities = parseResult.entities;
        entities[entities.length - 1].osisObjects.push(bcvParsedObject);
      }
      continue;
    }

    match = line.match(versionKeyword);

    if (match) {
      const versionMatchResult = extractVersion(match[1], availableVersions);

      if (versionMatchResult.type === 'error') {
        errorMessage = versionMatchResult.errorMessage!;
        break;
      }

      if (parseResult.entities) {
        const pushResult = pushNewEntity(parseResult.entities, [versionMatchResult.version!]);

        if (pushResult.type === 'error') {
          errorMessage = pushResult.errorMessage!;
          break;
        }
      }

      continue;
    }

    match = line.match(versionsKeyword);

    if (match) {
      const extractedVersions: string[] = [];
      const _versions: Array<string> = match[1].split(',');

      for (const _version of _versions) {
        const versionMatchResult = extractVersion(_version.replace(/(?:^\s")+|"+/g, ''), availableVersions);

        if (versionMatchResult.type === 'error') {
          errorMessage = versionMatchResult.errorMessage!;
          break linesLoop;
        }

        if (extractedVersions.includes(versionMatchResult.version!)) continue;

        extractedVersions.push(versionMatchResult.version!);
      }

      const options: EntityOptions = {
        parallel: match[2] ? true : false,
      };

      if (parseResult.entities) {
        const pushResult = pushNewEntity(parseResult.entities, extractedVersions, options);

        if (pushResult.type === 'error') {
          errorMessage = pushResult.errorMessage!;
          break;
        }
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

  if (parseResult.entities && parseResult.entities[0].osisObjects.length === 0 && errorMessage === null) {
    errorMessage = 'No citation specified. Try writing "(Genesis 1:1)"';
  }

  if (errorMessage) {
    parseResult = {
      type: 'error',
      errorMessage,
    };
  }

  return parseResult;
}

function extractVersion(string: string, availableVersions: Array<string>): ExtracResult {
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

  entities.push({
    osisObjects: [],
    versions,
    options,
  });

  return { type: 'success' };
}

interface ExtracResult {
  type: 'version' | 'error';
  version?: string;
  errorMessage?: string;
}

interface PushResult {
  type: 'success' | 'error';
  errorMessage?: string;
}
