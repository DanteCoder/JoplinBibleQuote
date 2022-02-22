const versionKeyword = /^version\s(.*)/;
const versionsKeyword = /^versions\s(.*)/;
const helpKeyword = /^help$/;
const citationRegExp = /^\(([^\(\)]+)\)$/;
const verRegExp = /^"([^"]+)"$/;

/**
 * Parses a block of bible code
 * @param tokenContent
 * @param bcvParser
 * @param availableVersions
 * @returns An object containing the parsed entities
 */
export default function parser(tokenContent: string, bcvParser: any, availableVersions: Array<string>): Array<Entity> {
  const lines = tokenContent.split('\n');
  const parsedEntities: Array<Entity> = [];

  let versions = ['default'];
  for (const line of lines) {
    let match;

    // If the line is a citation push it to parsedEntities with the current versions
    match = line.match(citationRegExp);
    if (match) {
      // Check if the citation is valid
      if (bcvParser.parse(match[1]).osis() === '') {
        return [{ type: 'error', content: `Invalid citation: "${match[1]}"` }];
      }

      parsedEntities.push({
        type: 'citation',
        content: { citation: match[1], versions },
      });
      continue;
    }

    // If the keyword id "version"
    match = line.match(versionKeyword);
    if (match) {
      // Check if there is something after the "version" keyword
      if (match[1] === null) {
        return [{ type: 'error', content: `You must specify Bible version after keyword "version"` }];
      }

      // Extract the version
      const versionMatchResult = extractVersion(match[1], availableVersions);
      if (versionMatchResult.type === 'error') return [versionMatchResult];

      versions = [versionMatchResult.content];
      continue;
    }

    // If the keyword id "versions"
    match = line.match(versionsKeyword);
    if (match) {
      // Check if there is something after the "versions" keyword
      if (match[1] === null)
        return [{ type: 'error', content: `You must specify Bible versions after keyword "versions"` }];

      // Extract the versions
      versions = [];
      const _versions = match[1].split(' ');
      for (const version of _versions) {
        const versionMatchResult = extractVersion(version, availableVersions);
        if (versionMatchResult.type === 'error') return [versionMatchResult];
        versions.push(versionMatchResult.content);
      }
      continue;
    }

    // If the keyword is "help" send help
    match = line.match(helpKeyword);
    if (match) {
      return [{ type: 'help', content: 'Help is on the way!' }];
    }
  }

  if (parsedEntities.length === 0) {
    return [{ type: 'error', content: 'No citations specified' }];
  }

  return parsedEntities;
}

/**
 * Parses a version from a string comparing it with the available versions
 * @param string
 * @param availableVersions
 * @returns An object containing the extracted version or an error
 */
function extractVersion(string: string, availableVersions: Array<string>): Entity {
  // Extract the version
  const versionMatch = string.match(verRegExp);

  // Check if syntax is "foo"
  if (!versionMatch) {
    return { type: 'error', content: `Invalid syntax: ${string}` };
  }

  // Check if the version is valid
  if (!availableVersions.includes(versionMatch[1])) {
    return { type: 'error', content: `Not imported Bible version: "${versionMatch[1]}"` };
  }
  return { type: 'version', content: versionMatch[1] };
}

interface Entity {
  type: 'citation' | 'help' | 'error' | 'version';
  content: any;
}
