import test from "node:test";
import assert from "node:assert/strict";
import { parseScreenDetails, parseUserAgent, referrerOrigin, requestGeo } from "../lib/visitor-analytics.ts";

test("classifies an iPhone without inventing an exact model", () => {
  const result = parseUserAgent("Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 Version/17.5 Mobile/15E148 Safari/604.1");
  assert.deepEqual(result, {
    deviceType: "Phone", deviceModel: "iPhone (model unavailable)",
    osName: "iOS", osVersion: "17.5", browserName: "Safari", browserVersion: "17.5",
  });
});

test("extracts an Android model when the browser reports it", () => {
  const result = parseUserAgent("Mozilla/5.0 (Linux; Android 14; Pixel 8 Pro Build/UP1A.231005.007) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Mobile Safari/537.36");
  assert.equal(result.deviceType, "Phone");
  assert.equal(result.deviceModel, "Pixel 8 Pro");
  assert.equal(result.osVersion, "14");
  assert.equal(result.browserName, "Chrome");
});

test("does not mistake Windows NT 10 for an exact Windows edition", () => {
  const result = parseUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0");
  assert.equal(result.deviceType, "Desktop");
  assert.equal(result.osName, "Windows");
  assert.equal(result.osVersion, "10.0");
  assert.equal(result.browserName, "Edge");
});

test("keeps valid CSS dimensions and rejects outliers", () => {
  assert.deepEqual(parseScreenDetails({ screenWidth: 390, screenHeight: 844, viewportWidth: -1, viewportHeight: "844" }), {
    screenWidth: 390, screenHeight: 844, viewportWidth: null, viewportHeight: null,
  });
});

test("stores only the referring origin", () => {
  assert.equal(referrerOrigin("https://example.com/private/path?token=secret"), "https://example.com");
  assert.equal(referrerOrigin("javascript:alert(1)"), null);
});

test("uses network and geo headers only on the trusted Vercel path", () => {
  const headers = new Headers({
    "x-vercel-forwarded-for": "203.0.113.7",
    "x-vercel-ip-country": "DZ",
    "x-vercel-ip-country-region": "28",
    "x-vercel-ip-city": "M%27Sila",
  });
  assert.deepEqual(requestGeo(headers, false), { ipAddress: null, countryCode: null, regionCode: null, city: null });
  assert.deepEqual(requestGeo(headers, true), { ipAddress: "203.0.113.7", countryCode: "DZ", regionCode: "28", city: "M'Sila" });
});
