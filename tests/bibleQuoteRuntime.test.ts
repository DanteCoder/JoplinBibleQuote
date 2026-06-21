// @vitest-environment happy-dom

import { describe, it, expect, vi, beforeEach } from 'vitest';

beforeEach(() => {
  document.body.innerHTML = '';
  vi.unstubAllGlobals();
});

async function importRuntime() {
  vi.resetModules();
  // @ts-expect-error -- bibleQuoteRuntime has no exports, imported for side effects
  return import('../src/bibleQuoteRuntime');
}

describe('bibleQuoteRuntime', () => {
  it('does nothing when webviewApi is undefined', async () => {
    vi.stubGlobal('webviewApi', undefined);
    await importRuntime();
    expect(document.querySelector('.bible-quote-placeholder')).toBeNull();
  });

  it('processes placeholders when webviewApi is available', async () => {
    const postMessage = vi.fn().mockResolvedValue('<div>rendered verse</div>');
    vi.stubGlobal('webviewApi', { postMessage });

    document.body.innerHTML = `
      <div class="bible-quote-placeholder" data-source='{"test":"Genesis 1:1"}' data-cs-id="bible-quote">[Bible Quote...]</div>
    `;

    Object.defineProperty(document, 'readyState', {
      value: 'complete',
      writable: true,
      configurable: true,
    });

    await importRuntime();

    await new Promise(resolve => setTimeout(resolve, 10));

    expect(postMessage).toHaveBeenCalled();
  });
});
