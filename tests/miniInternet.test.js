import test from 'node:test';
import assert from 'node:assert/strict';
import { BrowserHistory, SITES, getSite, listSites, search } from '../src/miniInternet.js';

test('mini internet exposes curated sites with required fields', () => {
  const sites = listSites();
  assert.ok(sites.length >= 4);
  for (const site of sites) {
    assert.ok(site.id);
    assert.ok(site.title);
    assert.ok(site.url);
    assert.ok(site.icon);
    assert.ok(site.description);
  }
  assert.equal(SITES.length, sites.length);
});

test('getSite returns a site or null', () => {
  assert.equal(getSite('wiki').title, 'NEXA Wiki');
  assert.equal(getSite('does-not-exist'), null);
});

test('search matches pages, tags, and site metadata', () => {
  const byPage = search('fotosintesis');
  assert.ok(byPage.some((r) => r.title === 'Fotosintesis'));
  assert.ok(byPage.every((r) => r.siteId !== undefined));

  const byTag = search('planet');
  assert.ok(byTag.length > 0);

  assert.deepEqual(search(''), []);
  assert.deepEqual(search('kata-yang-tidak-ada-xyz'), []);
});

test('browser history supports back and forward navigation', () => {
  const history = new BrowserHistory();
  assert.equal(history.current(), null);
  assert.equal(history.canGoBack, false);

  history.visit('wiki.nexa');
  history.visit('cuaca.nexa');
  history.visit('berita.nexa');
  assert.equal(history.current(), 'berita.nexa');

  assert.equal(history.back(), 'cuaca.nexa');
  assert.equal(history.back(), 'wiki.nexa');
  assert.equal(history.canGoBack, false);

  assert.equal(history.forward(), 'cuaca.nexa');
  assert.equal(history.canGoForward, true);

  // Visiting a new page truncates forward history
  history.visit('wiki.nexa');
  assert.equal(history.canGoForward, false);
});

test('revisiting the same url does not duplicate history entries', () => {
  const history = new BrowserHistory();
  history.visit('wiki.nexa');
  history.visit('wiki.nexa');
  assert.equal(history.stack.length, 1);
  history.back();
  assert.equal(history.current(), 'wiki.nexa');
});
