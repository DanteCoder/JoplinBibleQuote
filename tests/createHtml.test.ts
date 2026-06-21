import { describe, it, expect } from 'vitest';
import { createHtml } from '../src/utils/createHtml';

describe('createHtml', () => {
  it('creates an element with tag and content', () => {
    expect(createHtml('div', 'hello')).toBe('<div>hello</div>');
  });

  it('creates an element with a class name', () => {
    expect(createHtml('p', 'text', { className: 'my-class' })).toBe('<p class="my-class">text</p>');
  });

  it('creates an element with inline style', () => {
    const html = createHtml('span', 'bold', { style: { fontWeight: 'bold' } });
    expect(html).toContain('span');
    expect(html).toContain('font-weight: bold;');
    expect(html).toContain('bold');
  });

  it('creates an element with both class and style', () => {
    const html = createHtml('h2', 'Title', {
      className: 'heading',
      style: { fontSize: '20px', color: 'red' },
    });
    expect(html).toContain('class="heading"');
    expect(html).toContain('font-size: 20px;');
    expect(html).toContain('color: red;');
    expect(html).toContain('Title');
  });

  it('handles empty content', () => {
    expect(createHtml('div', '')).toBe('<div></div>');
  });

  it('handles multiple space-separated classes', () => {
    expect(createHtml('div', 'x', { className: 'a b c' })).toBe('<div class="a b c">x</div>');
  });

  it('handles content with HTML', () => {
    expect(createHtml('div', '<b>bold</b>')).toBe('<div><b>bold</b></div>');
  });

  it('omits class and style when config is undefined', () => {
    expect(createHtml('section', 'content', undefined)).toBe('<section>content</section>');
  });

  it('omits class and style when config is empty', () => {
    expect(createHtml('section', 'content', {})).toBe('<section>content</section>');
  });
});
