declare const webviewApi: {
  postMessage(id: string, msg: { name: string; source: string }): Promise<string>;
};

async function renderAllPlaceholders(): Promise<void> {
  if (typeof webviewApi === 'undefined' || !webviewApi.postMessage) return;

  const placeholders = document.querySelectorAll<HTMLElement>('.bible-quote-placeholder:not([data-done])');

  for (const el of placeholders) {
    const rawSource = el.dataset.source;
    const contentScriptId = el.dataset.csId;

    if (!rawSource || !contentScriptId) continue;

    let source: string;

    try {
      source = JSON.parse(rawSource);
    } catch {
      el.textContent = '[Bible Quote: invalid source data]';
      el.setAttribute('data-done', '1');

      continue;
    }

    try {
      const html = await webviewApi.postMessage(contentScriptId, {
        name: 'renderBible',
        source,
      });

      if (html) {
        el.outerHTML = html;
      } else {
        el.textContent = '[Bible Quote: render error]';
        el.setAttribute('data-done', '1');
      }
    } catch {
      el.textContent = '[Bible Quote: render error]';
      el.setAttribute('data-done', '1');
    }
  }
}

function run(): void {
  renderAllPlaceholders().catch(() => {});
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }

  document.addEventListener('joplin-noteDidUpdate', run);
}
