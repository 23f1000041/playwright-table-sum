import { chromium } from "playwright";

const seeds = [85, 86, 87, 88, 89, 90, 91, 92, 93, 94];

async function sumAllTablesOnPage(page, url) {
  await page.goto(url, { waitUntil: "domcontentloaded" });

  // dynamic page: wait until tables exist
  await page.waitForSelector("table", { timeout: 60000 });

  const tableTexts = await page.$$eval("table", (tables) =>
    tables.map((t) => t.innerText || "")
  );

  let sum = 0;
  for (const t of tableTexts) {
    const matches = t.match(/-?\d+(\.\d+)?/g) || [];
    for (const m of matches) sum += Number(m);
  }
  return sum;
}

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  let grandTotal = 0;

  for (const seed of seeds) {
    const url = `https://sanand0.github.io/tdsdata/js_table/?seed=${seed}`;
    const s = await sumAllTablesOnPage(page, url);
    console.log(`Seed ${seed} sum = ${s}`);
    grandTotal += s;
  }

  console.log("===================================");
  console.log(`TOTAL SUM (all seeds, all tables) = ${grandTotal}`);
  console.log("===================================");

  await browser.close();
}

main().catch((e) => {
  console.error("FAILED:", e);
  process.exit(1);
});
