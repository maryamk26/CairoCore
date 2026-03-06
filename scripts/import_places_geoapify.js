const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const LOCATIONS = [
  { name: "Cairo", lat: 30.0444, lon: 31.2357 },
  { name: "Giza", lat: 29.987, lon: 31.2118 },
  { name: "Sheikh Zayed", lat: 30.0131, lon: 30.9734 },
];

const CATEGORIES = [
  "tourism.attraction",
  "tourism.museum",
  "catering.restaurant",
  "catering.cafe",
  "leisure.park",
  "commercial.shopping_mall",
  "entertainment.amusement_park",
  "religion.place_of_worship",
];

const RADIUS_M = 20000;
const LIMIT = 50;

const VIBE_BY_CATEGORY = {
  museum: "historical,cultural",
  attraction: "historical,photography",
  park: "nature,romantic",
  shopping_mall: "shopping,modern",
  restaurant: "food,social",
  cafe: "chill,social",
  place_of_worship: "cultural,peaceful",
  amusement_park: "fun,family",
};

function loadEnv() {
  const envPath = path.join(__dirname, "..", ".env");
  if (!fs.existsSync(envPath)) return;
  const content = fs.readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    if (key && !process.env[key]) process.env[key] = value;
  }
}

function getVibe(categoryStr) {
  if (!categoryStr || typeof categoryStr !== "string") return null;
  const lower = categoryStr.toLowerCase();
  for (const [key, vibe] of Object.entries(VIBE_BY_CATEGORY)) {
    if (lower.includes(key)) return vibe;
  }
  return null;
}

async function fetchPlaces(apiKey, category, lat, lon) {
  const url = "https://api.geoapify.com/v2/places";
  const params = {
    categories: category,
    filter: `circle:${lon},${lat},${RADIUS_M}`,
    limit: LIMIT,
    apiKey,
  };
  const { data } = await axios.get(url, { params });
  return data.features || [];
}

function mapFeatureToPlace(feature, requestedCategory) {
  const props = feature.properties || {};
  const coords = feature.geometry?.coordinates;
  const lat = coords?.[1] ?? props.lat;
  const lon = coords?.[0] ?? props.lon;
  const name = props.name?.trim() || "Unnamed";
  const description = props.formatted?.trim() || null;
  const openingHours = props.opening_hours?.trim() || null;
  const catStr = props.categories || requestedCategory || null;
  const categoryVal = Array.isArray(catStr) ? catStr[0] : catStr;

  return {
    name,
    description,
    category: requestedCategory,
    latitude: Number(lat),
    longitude: Number(lon),
    address: null,
    openingHours,
    entranceFee: null,
    cameraFee: null,
    vibe: getVibe(categoryVal || requestedCategory),
    bestVisitTime: null,
    createdBy: null,
  };
}

async function placeExists(name, latitude, longitude) {
  const existing = await prisma.place.findFirst({
    where: { name, latitude, longitude },
  });
  return !!existing;
}

async function main() {
  loadEnv();
  const apiKey = process.env.GEOAPIFY_KEY;
  if (!apiKey) {
    console.error("GEOAPIFY_KEY missing. Add it to .env");
    process.exit(1);
  }

  const inserted = [];
  const skipped = [];

  for (const loc of LOCATIONS) {
    for (const category of CATEGORIES) {
      let features;
      try {
        features = await fetchPlaces(apiKey, category, loc.lat, loc.lon);
      } catch (err) {
        console.error(`Fetch failed ${loc.name} / ${category}:`, err.message);
        continue;
      }

      for (const feature of features) {
        const place = mapFeatureToPlace(feature, category);
        if (
          !Number.isFinite(place.latitude) ||
          !Number.isFinite(place.longitude)
        ) {
          skipped.push({ name: place.name, reason: "invalid coords" });
          continue;
        }

        const exists = await placeExists(
          place.name,
          place.latitude,
          place.longitude
        );
        if (exists) {
          skipped.push({ name: place.name, reason: "duplicate" });
          continue;
        }

        await prisma.place.create({ data: place });
        inserted.push(place.name);
        console.log("Inserted:", place.name);
      }
    }
  }

  await prisma.$disconnect();

  console.log("\n--- Summary ---");
  console.log("Inserted:", inserted.length);
  inserted.forEach((name) => console.log("  ", name));
  console.log("Skipped (duplicate):", skipped.filter((s) => s.reason === "duplicate").length);
  console.log("Skipped (invalid coords):", skipped.filter((s) => s.reason === "invalid coords").length);
}

main().catch((err) => {
  console.error(err);
  prisma.$disconnect();
  process.exit(1);
});
