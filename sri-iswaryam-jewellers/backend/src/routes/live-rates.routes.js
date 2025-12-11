import express from 'express';
import https from 'https';
import http from 'http';

const router = express.Router();
const SOURCE_URL = process.env.LIVE_RATES_URL || 'https://www.livechennai.com/gold_rate_salem.asp';
const LOCATION_LABEL = process.env.LIVE_RATES_LOCATION || 'Salem, Tamil Nadu';

let cachedRates = {
  location: LOCATION_LABEL,
  goldPerGram: 12010,
  silverPerGram: 78.7,
  updatedAt: new Date().toISOString(),
  source: SOURCE_URL,
  stale: true,
  deltaGold: null,
  deltaSilver: null
};

router.get('/', async (_req, res) => {
  try {
    const html = await fetchHtml(SOURCE_URL);
    const parsed = parseRates(html);
    const previousGold = cachedRates.goldPerGram ?? null;
    const previousSilver = cachedRates.silverPerGram ?? null;

    const gold = parsed.goldPerGram ?? previousGold;
    const silver = parsed.silverPerGram ?? previousSilver;
    const isPartial = parsed.goldPerGram === null || parsed.silverPerGram === null;

    const deltaGold = computeDelta(gold, previousGold);
    const deltaSilver = computeDelta(silver, previousSilver);

    cachedRates = {
      location: LOCATION_LABEL,
      goldPerGram: gold,
      silverPerGram: silver,
      updatedAt: parsed.updatedAt,
      source: SOURCE_URL,
      stale: isPartial,
      deltaGold,
      deltaSilver
    };

    res.json({ success: true, data: cachedRates, stale: isPartial });
  } catch (error) {
    const details = error instanceof Error ? error.message : 'Unknown error';
    console.error('Unable to refresh live rates:', details);
    res.status(200).json({ success: true, data: cachedRates, stale: true, message: 'Latest rates unavailable, serving cached values.' });
  }
});

function fetchHtml(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const request = client.get(
      url,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-IN,en;q=0.9',
          'Cache-Control': 'no-cache'
        },
        timeout: 8000
      },
      (response) => {
        if (response.statusCode && response.statusCode >= 400) {
          reject(new Error(`Source responded with status ${response.statusCode}`));
          response.resume();
          return;
        }

        const chunks = [];
        response.on('data', (chunk) => chunks.push(chunk));
        response.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
      }
    );

    request.on('timeout', () => {
      request.destroy(new Error('Upstream request timed out'));
    });

    request.on('error', (err) => reject(err));
  });
}

function parseRates(html) {
  // livechennai.com specific patterns for Salem
  const goldPerGram = findLiveChennaiGold(html);
  const silverPerGram = findLiveChennaiSilver(html);

  if (!goldPerGram && !silverPerGram) {
    throw new Error('Gold/Silver rates missing in upstream source');
  }

  return {
    goldPerGram,
    silverPerGram,
    updatedAt: new Date().toISOString()
  };
}

function findLiveChennaiGold(html) {
  const section = sliceSection(html, 'salem gold rate');
  // Try to capture four numeric cells (22K 1g, 22K 8g, 24K 1g, 24K 8g)
  const rowMatch = section.match(
    /<td[^>]*>\s*\d{1,2}\/\w{3}\/\d{4}\s*<\/td>\s*<td[^>]*>[\s\S]*?([\d,.]+)[\s\S]*?<td[^>]*>[\s\S]*?([\d,.]+)[\s\S]*?<td[^>]*>[\s\S]*?([\d,.]+)[\s\S]*?<td[^>]*>[\s\S]*?([\d,.]+)/i
  );

  if (rowMatch) {
    const n22g = toNumber(rowMatch[1]);
    const n22g8 = toNumber(rowMatch[2]);
    const n24g = toNumber(rowMatch[3]);
    const n24g8 = toNumber(rowMatch[4]);

    // Prefer 22K per-gram (first numeric after date), then other cells
    const candidates = [n22g, divideSafe(n22g8, 8), n24g, divideSafe(n24g8, 8)];
    const winner = pickFirstValid(candidates);
    if (winner) {
      return winner;
    }
  }

  // Fallback: grab the first numeric immediately following the date cell (more tolerant to markup changes)
  const loose = section.match(/<td[^>]*>\s*\d{1,2}\/\w{3}\/\d{4}\s*<\/td>\s*<td[^>]*>[^\d]*([\d,.]+)/i);
  const looseVal = toNumber(loose?.[1]);
  if (Number.isFinite(looseVal) && looseVal > 0) {
    return looseVal;
  }

  // Newer markup: look for "24K" or "22K" row labels near per-gram values
  const labelled = section.match(/24k[^\d]{0,20}([\d,.]+)/i) || section.match(/22k[^\d]{0,20}([\d,.]+)/i);
  const labelledVal = toNumber(labelled?.[1]);
  if (Number.isFinite(labelledVal) && labelledVal > 0) {
    return labelledVal;
  }

  return null;
}

function findLiveChennaiSilver(html) {
  const section = sliceSection(html, 'salem silver rate');
  const rowMatch = section.match(
    /<td[^>]*>\s*\d{1,2}\/\w{3}\/\d{4}\s*<\/td>\s*<td[^>]*>[\s\S]*?([\d,.]+)[\s\S]*?<td[^>]*>[\s\S]*?([\d,.]+)/i
  );

  if (rowMatch) {
    const perGram = toNumber(rowMatch[1]);
    const perKg = divideSafe(toNumber(rowMatch[2]), 1000);
    const winner = pickFirstValid([perGram, perKg], 10000);
    if (winner) {
      return winner;
    }
  }

  // Older layouts used a "Silver 1 Gm" heading
  const headingMatch = section.match(/Silver\s*1\s*Gm[^\d]*([\d,.]+)/i);
  const headingValue = toNumber(headingMatch?.[1]);
  return Number.isFinite(headingValue) && headingValue > 0 ? headingValue : null;
}

function sliceSection(html, marker) {
  const lower = html.toLowerCase();
  const idx = lower.indexOf(marker.toLowerCase());
  if (idx === -1) {
    return html;
  }
  return html.slice(idx, idx + 5000);
}

function toNumber(value) {
  if (!value) return null;
  const numeric = Number(String(value).replace(/,/g, ''));
  return Number.isFinite(numeric) ? numeric : null;
}

function divideSafe(value, divisor) {
  if (!Number.isFinite(value) || !divisor) return null;
  return Number((value / divisor).toFixed(2));
}

function pickFirstValid(values, max = 200000) {
  return values.find((value) => Number.isFinite(value) && value > 0 && value < max) ?? null;
}

function computeDelta(current, previous) {
  if (!Number.isFinite(current) || !Number.isFinite(previous)) return null;
  return Number((current - previous).toFixed(2));
}

export default router;
