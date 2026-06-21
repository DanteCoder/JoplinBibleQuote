import { describe, it, expect } from 'vitest';
import { bibleIndexFull, helpLanguages } from '../src/languages';

describe('bibleIndexFull', () => {
  it('has exactly 4 languages', () => {
    expect(Object.keys(bibleIndexFull)).toEqual(['en', 'es', 'fr', 'zh']);
  });

  it('en has 66 books (Protestant canon)', () => {
    expect(bibleIndexFull.en.books).toHaveLength(66);
  });

  it('en first book is Genesis', () => {
    expect(bibleIndexFull.en.books[0]).toBe('Genesis');
  });

  it('en last book is Revelation', () => {
    expect(bibleIndexFull.en.books[65]).toBe('Revelation');
  });

  it('es has 66 books', () => {
    expect(bibleIndexFull.es.books).toHaveLength(66);
  });

  it('fr has 66 books', () => {
    expect(bibleIndexFull.fr.books).toHaveLength(66);
  });

  it('zh has 66 books', () => {
    expect(bibleIndexFull.zh.books).toHaveLength(66);
  });

  it('each language has required string fields', () => {
    for (const lang of ['en', 'es', 'fr', 'zh'] as const) {
      expect(typeof bibleIndexFull[lang].book).toBe('string');
      expect(typeof bibleIndexFull[lang].chapter).toBe('string');
      expect(typeof bibleIndexFull[lang].chapters).toBe('string');
      expect(typeof bibleIndexFull[lang].verses).toBe('string');
    }
  });
});

describe('helpLanguages', () => {
  it('has an English help string', () => {
    expect(typeof helpLanguages.en).toBe('string');
    expect(helpLanguages.en).toContain('Available commands');
  });

  it('contains help text', () => {
    expect(helpLanguages.en).toContain('help');
    expect(helpLanguages.en).toContain('index');
    expect(helpLanguages.en).toContain('version');
    expect(helpLanguages.en).toContain('versions');
  });
});
