import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
const read = (path) =>
  readFileSync(new URL("../" + path, import.meta.url), "utf8");
const html = read("index.html");
test("the canonical and sitemap agree on the public HTTPS homepage", () => {
  const canonical = html.match(/rel="canonical" href="([^"]+)"/)[1];
  assert.equal(canonical, "https://lernium.ru/");
  assert.deepEqual(
    [...read("sitemap.xml").matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]),
    [canonical],
  );
  assert.match(
    read("robots.txt"),
    /Sitemap: https:\/\/lernium.ru\/sitemap.xml/,
  );
  assert.doesNotMatch(read("robots.txt"), /Disallow:\s*\/\s*\n/);
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.match(html, /name="robots" content="index,follow/);
});
test("structured data uses connected entities and no fabricated ratings or prices", () => {
  const data = JSON.parse(
    html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1],
  );
  assert.equal(data["@context"], "https://schema.org");
  const ids = new Set(data["@graph"].map((e) => e["@id"]));
  const visit = (value) => {
    if (!value || typeof value !== "object") return;
    if (value["@id"]) assert.ok(ids.has(value["@id"]));
    assert.equal(value.aggregateRating, undefined);
    assert.equal(value.offers, undefined);
    Object.values(value).forEach(visit);
  };
  visit(data);
  assert.ok(data["@graph"].some((e) => e["@type"] === "WebSite"));
});
test("social previews and font preloads point to shipped assets", () => {
  for (const match of html.matchAll(
    /(?:content|href)="(?:https:\/\/lernium.ru)?(\/assets\/[^"?#]+)"/g,
  )) {
    assert.ok(existsSync(new URL(".." + match[1], import.meta.url)), match[1]);
  }
  assert.match(html, /property="og:image:width" content="1200"/);
  assert.match(html, /property="og:image:height" content="630"/);
  assert.match(read("Dockerfile"), /robots\.txt sitemap\.xml/);
});
test("shutters respect reduced motion and never conceal the heading", () => {
  const css = read("styles.css");
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /\.hero__shutters\s*\{\s*display:\s*none;?\s*\}/);
  assert.match(html, /class="hero__shutters" aria-hidden="true"/);
  assert.doesNotMatch(html, /<h1[^>]*(hidden|aria-hidden)/);
});
