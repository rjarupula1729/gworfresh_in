/**
 * Seed: product categories + region-aware product catalog.
 *
 * Single regions (12+ products each):
 *   Hyderabad · Bangalore · Chennai · Mumbai
 *   Delhi · Kolkata · Pune · Ahmedabad
 *
 * Combination regions (climate clusters, 12+ each):
 *   South India        – TN/KA/AP/Kerala
 *   North India        – Delhi/Punjab/UP/Rajasthan
 *   Coastal India      – Mumbai/Goa/Kochi/Chennai
 *   Hill Stations      – Ooty/Shimla/Darjeeling
 *
 * Universal:
 *   All India          – grows everywhere; minerals/compost/tools live here.
 *
 * Run:  npm run db:seed   (idempotent – clears and re-inserts)
 */
exports.seed = async function seed(knex) {
  // ── FK-safe wipe ────────────────────────────────────────
  await knex('order_items').del();
  await knex('transactions').del();
  await knex('orders').del();
  await knex('user_plants').del();
  await knex('products').del();
  await knex('product_categories').del();

  // ── categories ──────────────────────────────────────────
  const categories = await knex('product_categories')
    .insert([
      { slug: 'seeds',    name: 'Seeds',    icon: 'seed',    sort_order: 10 },
      { slug: 'saplings', name: 'Saplings', icon: 'sapling', sort_order: 20 },
      { slug: 'minerals', name: 'Minerals', icon: 'mineral', sort_order: 30 },
      { slug: 'compost',  name: 'Compost',  icon: 'compost', sort_order: 40 },
      { slug: 'tools',    name: 'Tools',    icon: 'tool',    sort_order: 50 },
    ])
    .returning(['id', 'slug']);
  const c = Object.fromEntries(categories.map((x) => [x.slug, x.id]));

  // helper: build a product with sensible defaults
  const p = (cat, name, opts = {}) => ({
    category_id: c[cat],
    name,
    description: opts.desc || '',
    instructions: opts.how || '',
    price: opts.price ?? 49,
    stock: opts.stock ?? 50,
    region: opts.region || 'All India',
    tags: opts.tags || [],
  });

  // ===== HYDERABAD (12) – semi-arid, hot ===================
  const hyderabad = [
    p('seeds',    'Tomato Seeds (Desi)',         { desc: 'High-yield desi variety, 50 seeds', how: 'Sow 1cm. Daily water. 70-80d.', price: 49,  stock: 200, region: 'Hyderabad', tags: ['popular','beginner'] }),
    p('seeds',    'Chilli Seeds (Guntur)',       { desc: 'Spicy Guntur variety, 30 seeds',     how: 'Full sun. 90d.',                price: 39,  stock: 150, region: 'Hyderabad', tags: ['spicy','heat-tolerant'] }),
    p('seeds',    'Brinjal Seeds (Bhagyamati)',  { desc: 'Long purple variety, 30 seeds',      how: '75d.',                          price: 35,  stock: 140, region: 'Hyderabad', tags: ['indian'] }),
    p('seeds',    'Ridge Gourd (Beerakaya)',     { desc: '15 seeds, climbing vine',            how: 'Trellis. 65d.',                 price: 29,  stock: 120, region: 'Hyderabad', tags: ['vine'] }),
    p('seeds',    'Cluster Bean (Goru Chikkudu)',{ desc: 'Drought-resistant, 25 seeds',        how: '60d.',                          price: 29,  stock: 130, region: 'Hyderabad', tags: ['drought'] }),
    p('seeds',    'Snake Gourd (Potlakaya)',     { desc: '10 seeds, summer specialty',         how: 'Vertical support. 80d.',        price: 35,  stock: 90,  region: 'Hyderabad', tags: ['summer'] }),
    p('saplings', 'Curry Leaf Sapling',          { desc: 'Essential for South Indian cuisine', how: 'Sunny. 2x/wk water.',           price: 149, stock: 40,  region: 'Hyderabad', tags: ['kitchen','perennial'] }),
    p('saplings', 'Tulsi Sapling',               { desc: 'Holy basil',                          how: 'Full sun.',                     price: 99,  stock: 60,  region: 'Hyderabad', tags: ['sacred','medicinal'] }),
    p('saplings', 'Sweet Lime (Mosambi)',        { desc: 'Heat-tolerant citrus',                how: 'Deep pot. Full sun.',           price: 349, stock: 25,  region: 'Hyderabad', tags: ['fruit','citrus'] }),
    p('saplings', 'Custard Apple (Sitaphal)',    { desc: 'Drought-tolerant tree',               how: '24-36 mo to fruit.',            price: 299, stock: 20,  region: 'Hyderabad', tags: ['fruit'] }),
    p('saplings', 'Henna (Mehendi) Sapling',     { desc: 'Hot-climate hedge plant',             how: 'Prune for leaves.',             price: 89,  stock: 40,  region: 'Hyderabad', tags: ['medicinal'] }),
    p('saplings', 'Aloe Vera',                   { desc: 'Medicinal succulent',                 how: 'Minimal water.',                price: 79,  stock: 70,  region: 'Hyderabad', tags: ['medicinal','easy'] }),
  ];

  // ===== BANGALORE (12) – mild, year-round =================
  const bangalore = [
    p('seeds',    'Lettuce Mix Seeds',          { desc: 'Romaine + iceberg, 100 seeds',       how: 'Cool. Partial shade. 45d.',     price: 59,  stock: 120, region: 'Bangalore', tags: ['salad','quick'] }),
    p('seeds',    'Bell Pepper Seeds (Capsicum)',{desc: 'Tri-color mix, 25 seeds',             how: 'Indoor start. 90d.',            price: 69,  stock: 80,  region: 'Bangalore', tags: ['gourmet'] }),
    p('seeds',    'Broccoli Seeds',             { desc: 'Calabrese, 30 seeds',                how: 'Cool weather. 70d.',            price: 79,  stock: 70,  region: 'Bangalore', tags: ['nutrition'] }),
    p('seeds',    'Cherry Tomato Mix',          { desc: 'Red+yellow, 40 seeds',               how: 'Cage support. 70d.',            price: 89,  stock: 90,  region: 'Bangalore', tags: ['gourmet'] }),
    p('seeds',    'Spring Onion (Bunching)',    { desc: '100 seeds',                          how: 'Continuous harvest.',           price: 25,  stock: 150, region: 'Bangalore', tags: ['quick'] }),
    p('seeds',    'Coriander (Slow-Bolt)',      { desc: '50g pack',                           how: 'Sow biweekly.',                 price: 25,  stock: 200, region: 'Bangalore', tags: ['herb','quick'] }),
    p('saplings', 'Strawberry Sapling',         { desc: 'Camarosa variety',                   how: 'Hanging basket. Cool nights.',  price: 199, stock: 50,  region: 'Bangalore', tags: ['fruit','premium'] }),
    p('saplings', 'Rosemary Sapling',           { desc: 'Mediterranean herb',                 how: 'Sunny, drained soil.',          price: 159, stock: 45,  region: 'Bangalore', tags: ['herb'] }),
    p('saplings', 'Thyme Sapling',              { desc: 'Aromatic culinary herb',             how: 'Avoid wet feet.',               price: 149, stock: 40,  region: 'Bangalore', tags: ['herb'] }),
    p('saplings', 'Stevia Sapling',             { desc: 'Natural sweetener leaves',           how: 'Pinch tops.',                   price: 129, stock: 50,  region: 'Bangalore', tags: ['sugar-free'] }),
    p('saplings', 'Avocado Sapling (Hass)',     { desc: 'Grafted, fruits in 3 yrs',           how: 'Large pot.',                    price: 599, stock: 15,  region: 'Bangalore', tags: ['fruit','premium'] }),
    p('saplings', 'Geranium (Scented)',         { desc: 'Pink rose-scented variety',          how: 'Bright indirect light.',        price: 119, stock: 60,  region: 'Bangalore', tags: ['flower','fragrant'] }),
  ];

  // ===== CHENNAI (12) – hot humid coastal ==================
  const chennai = [
    p('seeds',    'Okra Seeds (Bhindi)',        { desc: 'Heat tolerant, 40 seeds',            how: 'Sow after rains. 50d.',         price: 35,  stock: 180, region: 'Chennai', tags: ['summer','humid'] }),
    p('seeds',    'Cluster Beans (Gawar)',      { desc: '30 seeds',                           how: 'Trellis.',                      price: 39,  stock: 100, region: 'Chennai', tags: ['drought'] }),
    p('seeds',    'Amaranth (Mulai Keerai)',    { desc: 'Red leafy, 100 seeds',               how: '30d.',                          price: 25,  stock: 200, region: 'Chennai', tags: ['leafy','iron'] }),
    p('seeds',    'Long Beans (Karamani)',      { desc: 'Tamil staple, 25 seeds',             how: 'Trellis. 60d.',                 price: 35,  stock: 130, region: 'Chennai', tags: ['vine'] }),
    p('seeds',    'Snake Gourd Seeds',          { desc: '10 seeds',                           how: 'Vertical. 80d.',                price: 35,  stock: 90,  region: 'Chennai', tags: ['vine'] }),
    p('seeds',    'Watermelon (Sugar Baby)',    { desc: 'Compact variety, 15 seeds',          how: 'Sandy soil. 80d.',              price: 49,  stock: 80,  region: 'Chennai', tags: ['fruit','summer'] }),
    p('saplings', 'Banana Sapling (G9)',        { desc: 'Dwarf high-yield',                   how: '12 months. Rich soil.',         price: 249, stock: 25,  region: 'Chennai', tags: ['fruit','tropical'] }),
    p('saplings', 'Drumstick (Moringa)',        { desc: 'Superfood',                          how: 'Hot climate.',                  price: 129, stock: 40,  region: 'Chennai', tags: ['superfood'] }),
    p('saplings', 'Papaya Sapling (Red Lady)',  { desc: 'Bisexual, fruits in 8 mo',           how: 'Full sun.',                     price: 99,  stock: 60,  region: 'Chennai', tags: ['fruit','quick'] }),
    p('saplings', 'Hibiscus (Red)',             { desc: 'Ornamental + medicinal',             how: 'Daily water in summer.',        price: 99,  stock: 70,  region: 'Chennai', tags: ['flower','medicinal'] }),
    p('saplings', 'Plumeria (Frangipani)',      { desc: 'Fragrant flowers',                   how: 'Tolerates salt air.',           price: 199, stock: 30,  region: 'Chennai', tags: ['flower','coastal'] }),
    p('saplings', 'Bougainvillea',              { desc: 'Vibrant climbing shrub',             how: 'Full sun. Less water.',         price: 149, stock: 50,  region: 'Chennai', tags: ['flower','hardy'] }),
  ];

  // ===== MUMBAI (12) – tropical monsoon ====================
  const mumbai = [
    p('seeds',    'Bottle Gourd (Lauki)',       { desc: '15 seeds',                           how: 'Monsoon. Trellis.',             price: 29,  stock: 130, region: 'Mumbai', tags: ['vine','monsoon'] }),
    p('seeds',    'Bitter Gourd (Karela)',      { desc: '20 seeds',                           how: 'Soak 24h.',                     price: 35,  stock: 110, region: 'Mumbai', tags: ['medicinal','diabetic'] }),
    p('seeds',    'Ridge Gourd (Turai)',        { desc: '15 seeds',                           how: 'Monsoon perfect.',              price: 29,  stock: 120, region: 'Mumbai', tags: ['vine'] }),
    p('seeds',    'Indian Spinach (Pui Saag)',  { desc: 'Climbing variety, 40 seeds',         how: 'Trellis.',                      price: 35,  stock: 100, region: 'Mumbai', tags: ['leafy','vine'] }),
    p('seeds',    'Cucumber (Marketmore)',      { desc: '30 seeds',                           how: 'Trellis. 55d.',                 price: 39,  stock: 110, region: 'Mumbai', tags: ['quick'] }),
    p('seeds',    'Pumpkin (Kashi Harit)',      { desc: '15 seeds',                           how: 'Spreading vine.',               price: 39,  stock: 80,  region: 'Mumbai', tags: ['vine'] }),
    p('saplings', 'Coconut Palm (Dwarf)',       { desc: 'Yields in 4 yrs',                    how: 'Sandy soil.',                   price: 599, stock: 15,  region: 'Mumbai', tags: ['fruit','tropical'] }),
    p('saplings', 'Mango (Alphonso)',           { desc: 'Grafted',                            how: 'Large pot. Full sun.',          price: 449, stock: 20,  region: 'Mumbai', tags: ['fruit','premium'] }),
    p('saplings', 'Cashew Sapling',             { desc: 'Coastal nut tree',                   how: 'Sandy loam.',                   price: 299, stock: 25,  region: 'Mumbai', tags: ['nut','coastal'] }),
    p('saplings', 'Jackfruit (Dwarf)',          { desc: 'Dwarf variety, fruits in 3 yrs',     how: 'Wide pot.',                     price: 399, stock: 20,  region: 'Mumbai', tags: ['fruit','tropical'] }),
    p('saplings', 'Karipatta (Sweet Curry)',    { desc: 'Aromatic kitchen leaf',              how: 'Sunny.',                        price: 99,  stock: 50,  region: 'Mumbai', tags: ['kitchen'] }),
    p('saplings', 'Money Plant (Pothos)',       { desc: 'Indoor air-purifier',                how: 'Low light OK.',                 price: 79,  stock: 100, region: 'Mumbai', tags: ['indoor','easy'] }),
  ];

  // ===== DELHI (12) – continental ==========================
  const delhi = [
    p('seeds',    'Mustard Greens (Sarson)',    { desc: '100 seeds',                          how: 'Cool season. 45d.',             price: 25,  stock: 200, region: 'Delhi', tags: ['winter','leafy'] }),
    p('seeds',    'Carrot (Pusa Rudhira)',      { desc: 'Red Indian, 200 seeds',              how: 'Loose soil.',                   price: 39,  stock: 160, region: 'Delhi', tags: ['root','winter'] }),
    p('seeds',    'Radish (Pusa Himani)',       { desc: 'White winter radish, 100 seeds',     how: '40d.',                          price: 25,  stock: 180, region: 'Delhi', tags: ['root','winter'] }),
    p('seeds',    'Cauliflower (Snowball)',     { desc: '30 seeds',                           how: 'Cool nights. 90d.',             price: 49,  stock: 100, region: 'Delhi', tags: ['winter'] }),
    p('seeds',    'Cabbage (Golden Acre)',      { desc: '30 seeds',                           how: 'Winter. 80d.',                  price: 45,  stock: 110, region: 'Delhi', tags: ['winter'] }),
    p('seeds',    'Peas (Arkel)',               { desc: 'Sweet shelling pea, 50 seeds',       how: 'Winter sow. 70d.',              price: 35,  stock: 140, region: 'Delhi', tags: ['winter','legume'] }),
    p('seeds',    'Garlic Bulbils',             { desc: '5 large bulbs',                      how: 'Plant Oct-Nov.',                price: 79,  stock: 90,  region: 'Delhi', tags: ['kitchen','winter'] }),
    p('saplings', 'Pomegranate (Bhagwa)',       { desc: 'Hardy variety',                      how: 'Tolerates extremes.',           price: 349, stock: 30,  region: 'Delhi', tags: ['fruit','hardy'] }),
    p('saplings', 'Guava (L-49)',               { desc: 'Sweet white-flesh',                  how: 'Full sun.',                     price: 299, stock: 35,  region: 'Delhi', tags: ['fruit'] }),
    p('saplings', 'Mulberry Sapling',           { desc: 'Fast-growing fruit tree',            how: 'Hardy.',                        price: 199, stock: 40,  region: 'Delhi', tags: ['fruit'] }),
    p('saplings', 'Rose (Desi)',                { desc: 'Fragrant pink variety',              how: 'Prune yearly.',                 price: 149, stock: 60,  region: 'Delhi', tags: ['flower'] }),
    p('saplings', 'Chrysanthemum (Guldaudi)',   { desc: 'Winter bloomer',                     how: 'Pinch for bushy growth.',       price: 99,  stock: 70,  region: 'Delhi', tags: ['flower','winter'] }),
  ];

  // ===== KOLKATA (12) – humid sub-tropical =================
  const kolkata = [
    p('seeds',    'Pointed Gourd (Parwal)',     { desc: 'Bengali staple, 15 seeds',           how: 'Trellis.',                      price: 49,  stock: 80,  region: 'Kolkata', tags: ['bengali'] }),
    p('seeds',    'Spinach (Palak Bharti)',     { desc: 'Bolt-resistant, 100 seeds',          how: '30d.',                          price: 29,  stock: 220, region: 'Kolkata', tags: ['leafy','iron'] }),
    p('seeds',    'Brinjal (Long Purple)',      { desc: 'Bengali variety, 30 seeds',          how: '80d.',                          price: 35,  stock: 130, region: 'Kolkata', tags: ['bengali'] }),
    p('seeds',    'Pumpkin (Kashiphal)',        { desc: '15 seeds',                           how: 'Vine.',                         price: 35,  stock: 90,  region: 'Kolkata', tags: ['bengali'] }),
    p('seeds',    'Coriander (Bengali Type)',   { desc: '50g',                                how: '30d.',                          price: 25,  stock: 180, region: 'Kolkata', tags: ['herb'] }),
    p('seeds',    'Lal Saag (Red Amaranth)',    { desc: 'Bengali leafy, 80 seeds',            how: '25d.',                          price: 25,  stock: 180, region: 'Kolkata', tags: ['leafy'] }),
    p('seeds',    'Snake Gourd (Chichinga)',    { desc: '10 seeds',                           how: 'Vertical.',                     price: 35,  stock: 80,  region: 'Kolkata', tags: ['vine'] }),
    p('saplings', 'Jasmine (Mogra)',            { desc: 'Fragrant evening bloomer',           how: 'Sunny. Daily water.',           price: 179, stock: 45,  region: 'Kolkata', tags: ['flower','fragrant'] }),
    p('saplings', 'Litchi Sapling',             { desc: 'Cool-loving fruit',                  how: 'Humid winters.',                price: 449, stock: 20,  region: 'Kolkata', tags: ['fruit','premium'] }),
    p('saplings', 'Sapota (Chikoo)',            { desc: 'Sweet brown fruit',                  how: 'Slow grower.',                  price: 349, stock: 25,  region: 'Kolkata', tags: ['fruit'] }),
    p('saplings', 'Tagar (Wax Flower)',         { desc: 'Bengali pooja flower',               how: 'Partial shade.',                price: 119, stock: 40,  region: 'Kolkata', tags: ['flower','sacred'] }),
    p('saplings', 'Shiuli (Night Jasmine)',     { desc: 'Bengali sacred flower',              how: 'Drops at dawn.',                price: 159, stock: 35,  region: 'Kolkata', tags: ['flower','sacred'] }),
  ];

  // ===== PUNE (12) – mild semi-arid ========================
  const pune = [
    p('seeds',    'Coriander (Pune Local)',     { desc: 'Slow-bolt, 50g',                     how: '30d.',                          price: 25,  stock: 250, region: 'Pune', tags: ['herb','quick'] }),
    p('seeds',    'Tomato (Pusa Ruby)',         { desc: 'Hardy, 50 seeds',                    how: '70d.',                          price: 45,  stock: 160, region: 'Pune', tags: ['popular'] }),
    p('seeds',    'Onion (Nashik Red)',         { desc: 'Maharashtra red onion, 100 seeds',   how: 'Sow Oct.',                      price: 49,  stock: 130, region: 'Pune', tags: ['kitchen'] }),
    p('seeds',    'French Bean (Bush)',         { desc: '40 seeds',                           how: '55d.',                          price: 39,  stock: 120, region: 'Pune', tags: ['legume','quick'] }),
    p('seeds',    'Beetroot (Detroit)',         { desc: '100 seeds',                          how: 'Loose soil. 60d.',              price: 35,  stock: 140, region: 'Pune', tags: ['root'] }),
    p('seeds',    'Methi (Fenugreek)',          { desc: '100g',                               how: '25d.',                          price: 15,  stock: 200, region: 'Pune', tags: ['quick','iron'] }),
    p('saplings', 'Mint (Pudina)',              { desc: 'Spreads fast',                       how: 'Partial shade.',                price: 79,  stock: 80,  region: 'Pune', tags: ['herb'] }),
    p('saplings', 'Lemon (Kagzi)',              { desc: 'Juicy variety',                      how: 'Deep pot.',                     price: 299, stock: 30,  region: 'Pune', tags: ['fruit','citrus'] }),
    p('saplings', 'Fig (Anjeer)',               { desc: 'Pune classic',                       how: 'Tolerates drought.',            price: 349, stock: 25,  region: 'Pune', tags: ['fruit'] }),
    p('saplings', 'Grapes (Thompson)',          { desc: 'Seedless variety',                   how: 'Trellis.',                      price: 399, stock: 20,  region: 'Pune', tags: ['fruit','premium'] }),
    p('saplings', 'Marigold (Genda)',           { desc: 'Pooja staple',                       how: 'Sunny.',                        price: 49,  stock: 100, region: 'Pune', tags: ['flower','sacred'] }),
    p('saplings', 'Chilli (Bhavnagri)',         { desc: 'Mild large chilli',                  how: 'Stake support.',                price: 89,  stock: 60,  region: 'Pune', tags: ['kitchen'] }),
  ];

  // ===== AHMEDABAD (12) – arid Gujarat =====================
  const ahmedabad = [
    p('seeds',    'Cumin Seeds (Jeera)',        { desc: 'Gujarat classic, 50g',               how: 'Cool sow. 110d.',               price: 79,  stock: 100, region: 'Ahmedabad', tags: ['spice','winter'] }),
    p('seeds',    'Tindora (Ivy Gourd)',        { desc: '15 cuttings',                        how: 'Trellis.',                      price: 89,  stock: 80,  region: 'Ahmedabad', tags: ['vine','perennial'] }),
    p('seeds',    'Dudhi (Bottle Gourd)',       { desc: '15 seeds',                           how: 'Vine.',                         price: 29,  stock: 130, region: 'Ahmedabad', tags: ['vine'] }),
    p('seeds',    'Cluster Bean (Guar)',        { desc: 'Drought champ, 30 seeds',            how: 'Direct sow.',                   price: 35,  stock: 120, region: 'Ahmedabad', tags: ['drought'] }),
    p('seeds',    'Black Eyed Pea (Chowli)',    { desc: '40 seeds',                           how: 'Trellis.',                      price: 39,  stock: 100, region: 'Ahmedabad', tags: ['legume'] }),
    p('seeds',    'Sesame (Til)',               { desc: 'Oilseed, 100g',                      how: 'Hot dry climate.',              price: 49,  stock: 80,  region: 'Ahmedabad', tags: ['oilseed'] }),
    p('saplings', 'Ber (Indian Jujube)',        { desc: 'Drought-tolerant fruit',             how: 'Minimal water.',                price: 199, stock: 40,  region: 'Ahmedabad', tags: ['fruit','hardy'] }),
    p('saplings', 'Indian Date (Khajur)',       { desc: 'Desert palm',                        how: 'Sandy soil.',                   price: 599, stock: 15,  region: 'Ahmedabad', tags: ['fruit','desert'] }),
    p('saplings', 'Pomegranate (Sindhuri)',     { desc: 'Hot-climate variety',                how: 'Full sun.',                     price: 329, stock: 30,  region: 'Ahmedabad', tags: ['fruit'] }),
    p('saplings', 'Neem Tree',                  { desc: 'Medicinal shade tree',               how: 'Drought-tolerant.',             price: 149, stock: 50,  region: 'Ahmedabad', tags: ['medicinal'] }),
    p('saplings', 'Bougainvillea (Magenta)',    { desc: 'Desert-loving climber',              how: 'Less water = more flowers.',    price: 149, stock: 60,  region: 'Ahmedabad', tags: ['flower','hardy'] }),
    p('saplings', 'Gulmohar Sapling',           { desc: 'Flame tree',                         how: 'Full sun.',                     price: 199, stock: 30,  region: 'Ahmedabad', tags: ['flower','tree'] }),
  ];

  // ===== SOUTH INDIA (12) – combo cluster ==================
  const southIndia = [
    p('seeds',    'Ashgourd (Boodida Gummadi)', { desc: 'Festival staple, 10 seeds',          how: 'Vine.',                         price: 39,  stock: 90,  region: 'South India', tags: ['festival','vine'] }),
    p('seeds',    'Snake Gourd Mix',            { desc: '12 seeds',                           how: 'Vertical support.',             price: 35,  stock: 100, region: 'South India', tags: ['vine'] }),
    p('seeds',    'Field Bean (Avarekai)',      { desc: 'Karnataka winter bean, 30 seeds',    how: 'Cool weather.',                 price: 49,  stock: 80,  region: 'South India', tags: ['legume','winter'] }),
    p('seeds',    'Horsegram (Kollu)',          { desc: 'Protein legume, 100g',               how: 'Drought-tolerant.',             price: 39,  stock: 90,  region: 'South India', tags: ['legume','protein'] }),
    p('seeds',    'Ragi (Finger Millet)',       { desc: 'Calcium-rich grain, 100g',           how: 'Direct sow.',                   price: 29,  stock: 110, region: 'South India', tags: ['grain','calcium'] }),
    p('seeds',    'Yard Long Bean',             { desc: '20 seeds',                           how: 'Trellis.',                      price: 35,  stock: 110, region: 'South India', tags: ['vine'] }),
    p('saplings', 'Curry Leaf (Gamthi)',        { desc: 'Premium aromatic variety',           how: 'Sunny.',                        price: 169, stock: 40,  region: 'South India', tags: ['kitchen'] }),
    p('saplings', 'Sapota (Cricket Ball)',      { desc: 'Large fruit variety',                how: 'Slow grower.',                  price: 379, stock: 25,  region: 'South India', tags: ['fruit'] }),
    p('saplings', 'Jasmine (Madurai Malli)',    { desc: 'Famous garland variety',             how: 'Full sun.',                     price: 199, stock: 40,  region: 'South India', tags: ['flower','fragrant'] }),
    p('saplings', 'Areca Palm',                 { desc: 'Indoor air-purifier',                how: 'Bright indirect light.',        price: 249, stock: 50,  region: 'South India', tags: ['indoor'] }),
    p('saplings', 'Champaka (Sampangi)',        { desc: 'Sacred fragrant tree',               how: 'Sunny.',                        price: 299, stock: 25,  region: 'South India', tags: ['flower','sacred'] }),
    p('saplings', 'Kovakkai (Ivy Gourd)',       { desc: '5 cuttings',                         how: 'Trellis.',                      price: 99,  stock: 60,  region: 'South India', tags: ['perennial'] }),
  ];

  // ===== NORTH INDIA (12) ==================================
  const northIndia = [
    p('seeds',    'Bathua (Lambsquarters)',     { desc: 'Punjab winter green, 100 seeds',     how: 'Direct sow.',                   price: 25,  stock: 150, region: 'North India', tags: ['winter','leafy'] }),
    p('seeds',    'Sarson (Yellow Mustard)',    { desc: '100 seeds',                          how: 'Cool season.',                  price: 25,  stock: 200, region: 'North India', tags: ['winter','leafy'] }),
    p('seeds',    'Methi Champa',               { desc: 'Punjab leafy fenugreek, 100g',       how: '25d.',                          price: 25,  stock: 180, region: 'North India', tags: ['leafy'] }),
    p('seeds',    'Chana (Black Chickpea)',     { desc: '100 seeds',                          how: 'Winter crop.',                  price: 35,  stock: 120, region: 'North India', tags: ['legume','winter'] }),
    p('seeds',    'Turnip (Shalgam)',           { desc: '100 seeds',                          how: 'Loose soil.',                   price: 29,  stock: 130, region: 'North India', tags: ['root','winter'] }),
    p('seeds',    'Radish (Mooli Long White)',  { desc: '100 seeds',                          how: '45d.',                          price: 25,  stock: 160, region: 'North India', tags: ['root','winter'] }),
    p('saplings', 'Apple (Anna - Low Chill)',   { desc: 'Plains-friendly apple',              how: 'Cool nights.',                  price: 599, stock: 15,  region: 'North India', tags: ['fruit','premium'] }),
    p('saplings', 'Apricot (Khurmani)',         { desc: 'Hardy stone fruit',                  how: 'Cold winter req.',              price: 499, stock: 20,  region: 'North India', tags: ['fruit'] }),
    p('saplings', 'Kinnow (Citrus)',            { desc: 'Punjab winter mandarin',             how: 'Full sun.',                     price: 299, stock: 30,  region: 'North India', tags: ['fruit','citrus'] }),
    p('saplings', 'Rose (Edward)',              { desc: 'Fragrant pink',                      how: 'Prune Jan.',                    price: 169, stock: 50,  region: 'North India', tags: ['flower'] }),
    p('saplings', 'Marigold (African Tall)',    { desc: 'Bright orange',                      how: 'Sunny.',                        price: 49,  stock: 120, region: 'North India', tags: ['flower'] }),
    p('saplings', 'Walnut Sapling',             { desc: 'Hill-loving nut tree',               how: 'Cold winter req.',              price: 699, stock: 10,  region: 'North India', tags: ['nut','premium'] }),
  ];

  // ===== COASTAL INDIA (12) ================================
  const coastal = [
    p('seeds',    'Watermelon (Sugar Baby)',    { desc: '15 seeds',                           how: 'Sandy soil.',                   price: 49,  stock: 80,  region: 'Coastal India', tags: ['fruit','summer'] }),
    p('seeds',    'Muskmelon (Hara Madhu)',     { desc: '20 seeds',                           how: 'Vine.',                         price: 49,  stock: 80,  region: 'Coastal India', tags: ['fruit'] }),
    p('seeds',    'Sweet Potato Vine',          { desc: '5 cuttings',                         how: 'Sandy soil.',                   price: 79,  stock: 60,  region: 'Coastal India', tags: ['root','tuber'] }),
    p('seeds',    'Bhendi (Pusa Sawani)',       { desc: '40 seeds',                           how: '50d.',                          price: 35,  stock: 130, region: 'Coastal India', tags: ['summer'] }),
    p('seeds',    'Long Beans (Coastal)',       { desc: '30 seeds',                           how: 'Trellis.',                      price: 35,  stock: 110, region: 'Coastal India', tags: ['vine'] }),
    p('seeds',    'Pumpkin (Disco)',            { desc: 'Round green, 15 seeds',              how: 'Vine.',                         price: 39,  stock: 90,  region: 'Coastal India', tags: ['vine'] }),
    p('saplings', 'Coconut (Hybrid Dwarf)',     { desc: 'Salt-tolerant',                      how: 'Sandy soil.',                   price: 599, stock: 20,  region: 'Coastal India', tags: ['fruit','tropical'] }),
    p('saplings', 'Cashew (Vengurla)',          { desc: 'Coastal nut',                        how: 'Sandy loam.',                   price: 299, stock: 25,  region: 'Coastal India', tags: ['nut'] }),
    p('saplings', 'Areca Nut Palm',             { desc: 'Tall ornamental',                    how: 'Humid.',                        price: 249, stock: 30,  region: 'Coastal India', tags: ['palm'] }),
    p('saplings', 'Pineapple Sucker',           { desc: 'Sweet variety',                      how: '18 mo to fruit.',               price: 99,  stock: 60,  region: 'Coastal India', tags: ['fruit','tropical'] }),
    p('saplings', 'Hibiscus (Tropical Mix)',    { desc: 'Salt-tolerant flowers',              how: 'Coastal hardy.',                price: 119, stock: 50,  region: 'Coastal India', tags: ['flower','coastal'] }),
    p('saplings', 'Plumeria (White-Yellow)',    { desc: 'Beach-loving fragrance',             how: 'Sandy soil.',                   price: 199, stock: 30,  region: 'Coastal India', tags: ['flower','coastal'] }),
  ];

  // ===== HILL STATIONS (12) ================================
  const hills = [
    p('seeds',    'Pea (Sugar Snap)',           { desc: 'Cool-climate sweet pea, 50 seeds',   how: '70d.',                          price: 49,  stock: 100, region: 'Hill Stations', tags: ['cool','legume'] }),
    p('seeds',    'Carrot (Nantes Half Long)',  { desc: 'European variety, 200 seeds',        how: 'Cool soil.',                    price: 49,  stock: 110, region: 'Hill Stations', tags: ['root','cool'] }),
    p('seeds',    'Beetroot (Crimson Globe)',   { desc: '100 seeds',                          how: 'Cool weather.',                 price: 39,  stock: 110, region: 'Hill Stations', tags: ['root'] }),
    p('seeds',    'Lettuce (Butterhead)',       { desc: '100 seeds',                          how: 'Partial shade.',                price: 59,  stock: 90,  region: 'Hill Stations', tags: ['salad'] }),
    p('seeds',    'Kale (Red Russian)',         { desc: 'Superfood leaves, 50 seeds',         how: 'Cool nights.',                  price: 79,  stock: 70,  region: 'Hill Stations', tags: ['superfood','leafy'] }),
    p('seeds',    'Brussels Sprouts',           { desc: '30 seeds',                           how: '90d. Cool climate.',            price: 89,  stock: 50,  region: 'Hill Stations', tags: ['gourmet','cool'] }),
    p('saplings', 'Strawberry (Sweet Charlie)', { desc: 'Premium hill variety',               how: 'Cool nights essential.',        price: 229, stock: 40,  region: 'Hill Stations', tags: ['fruit','premium'] }),
    p('saplings', 'Blueberry (Misty)',          { desc: 'Acid-soil berry',                    how: 'pH 4.5-5.5.',                   price: 599, stock: 15,  region: 'Hill Stations', tags: ['fruit','premium'] }),
    p('saplings', 'Raspberry Sapling',          { desc: 'Cold-loving berry',                  how: 'Trellis.',                      price: 449, stock: 20,  region: 'Hill Stations', tags: ['fruit','premium'] }),
    p('saplings', 'Pear (Patharnakh)',          { desc: 'Hardy hill pear',                    how: 'Cold winters.',                 price: 499, stock: 20,  region: 'Hill Stations', tags: ['fruit'] }),
    p('saplings', 'Lavender Sapling',           { desc: 'Aromatic hill herb',                 how: 'Drained soil.',                 price: 199, stock: 40,  region: 'Hill Stations', tags: ['herb','fragrant'] }),
    p('saplings', 'Geranium (Pelargonium)',     { desc: 'Hill-station classic',               how: 'Cool nights.',                  price: 149, stock: 50,  region: 'Hill Stations', tags: ['flower'] }),
  ];

  // ===== ALL INDIA (universal + minerals + compost + tools) =
  const allIndia = [
    // universal seeds & saplings
    p('seeds',    'Marigold (Mixed)',           { desc: 'Pest-repellent, 100 seeds',          how: 'Any sunny spot.',               price: 19,  stock: 500, region: 'All India', tags: ['flower','companion'] }),
    p('seeds',    'Methi (Fenugreek)',          { desc: 'Iron-rich, 100g',                    how: '25d.',                          price: 15,  stock: 400, region: 'All India', tags: ['quick','iron'] }),
    p('seeds',    'Sunflower (Dwarf)',          { desc: '20 seeds',                           how: 'Full sun.',                     price: 39,  stock: 200, region: 'All India', tags: ['flower'] }),
    p('seeds',    'Basil (Sweet)',              { desc: 'Italian basil, 50 seeds',            how: 'Pinch tops.',                   price: 35,  stock: 220, region: 'All India', tags: ['herb'] }),
    p('saplings', 'Aloe Vera (Indoor)',         { desc: 'Medicinal succulent',                how: 'Bright light.',                 price: 79,  stock: 150, region: 'All India', tags: ['medicinal','indoor'] }),
    p('saplings', 'Snake Plant',                { desc: 'Air-purifying indoor',               how: 'Low light OK.',                 price: 199, stock: 100, region: 'All India', tags: ['indoor','easy'] }),
    p('saplings', 'Money Plant',                { desc: 'Lucky vine',                         how: 'Indirect light.',               price: 79,  stock: 200, region: 'All India', tags: ['indoor','easy'] }),
    p('saplings', 'Tulsi (Rama)',               { desc: 'Sacred basil',                       how: 'Full sun.',                     price: 99,  stock: 200, region: 'All India', tags: ['sacred','medicinal'] }),

    // minerals
    p('minerals', 'NPK Fertilizer 500g',        { desc: 'Balanced 19-19-19',                  how: '1 tsp/pot, monthly.',           price: 199, stock: 100, region: 'All India', tags: ['nutrition'] }),
    p('minerals', 'Bone Meal 250g',             { desc: 'Phosphorus boost',                   how: 'Mix at planting.',              price: 149, stock: 80,  region: 'All India', tags: ['flowering'] }),
    p('minerals', 'Neem Cake 500g',             { desc: 'Organic pest deterrent',             how: '2 tbsp bi-weekly.',             price: 179, stock: 90,  region: 'All India', tags: ['organic','pest'] }),
    p('minerals', 'Epsom Salt 1kg',             { desc: 'Magnesium for leaves',               how: 'Foliar spray.',                 price: 129, stock: 120, region: 'All India', tags: ['leaves'] }),
    p('minerals', 'Mustard Cake 1kg',           { desc: 'Organic N',                          how: 'Soak 24h.',                     price: 159, stock: 70,  region: 'All India', tags: ['organic','nitrogen'] }),
    p('minerals', 'Seaweed Extract 500ml',      { desc: 'Liquid bio-stimulant',               how: '5ml/L water.',                  price: 299, stock: 60,  region: 'All India', tags: ['organic','growth'] }),

    // compost
    p('compost',  'Vermicompost 5kg',           { desc: 'Premium worm castings',              how: '20% mix.',                      price: 249, stock: 60,  region: 'All India', tags: ['organic'] }),
    p('compost',  'Cocopeat Block 1kg',         { desc: 'Expands to 15L',                     how: 'Soak first.',                   price: 99,  stock: 200, region: 'All India', tags: ['medium'] }),
    p('compost',  'Cow Dung Compost 10kg',      { desc: 'Aged manure',                        how: 'Top-dress.',                    price: 299, stock: 40,  region: 'All India', tags: ['organic'] }),
    p('compost',  'Leaf Mould 3kg',             { desc: 'Rich humus',                         how: 'Mulch.',                        price: 149, stock: 50,  region: 'All India', tags: ['organic','mulch'] }),
    p('compost',  'Perlite 1L',                 { desc: 'Drainage amendment',                 how: '20% mix.',                      price: 119, stock: 80,  region: 'All India', tags: ['drainage'] }),

    // tools
    p('tools',    'Hand Trowel',                { desc: 'Stainless steel',                    how: 'Rinse after use.',              price: 199, stock: 70,  region: 'All India', tags: ['essential'] }),
    p('tools',    'Pruning Scissors',           { desc: 'Sharp curved blades',                how: 'Oil monthly.',                  price: 349, stock: 50,  region: 'All India', tags: ['essential'] }),
    p('tools',    'Watering Can 5L',            { desc: 'Long-spout',                         how: '',                              price: 449, stock: 30,  region: 'All India', tags: ['watering'] }),
    p('tools',    'Terracotta Pots (3)',        { desc: '6/8/10 inch',                        how: 'Soak first.',                   price: 599, stock: 25,  region: 'All India', tags: ['breathable'] }),
    p('tools',    'pH Test Kit',                { desc: 'Soil acidity meter',                 how: 'Read leaflet.',                 price: 249, stock: 35,  region: 'All India', tags: ['diagnostic'] }),
    p('tools',    'Spray Bottle 1L',            { desc: 'Misting',                            how: '',                              price: 149, stock: 80,  region: 'All India', tags: ['watering'] }),
    p('tools',    'Garden Gloves',              { desc: 'Nitrile-coated',                     how: 'Air-dry.',                      price: 199, stock: 100, region: 'All India', tags: ['safety'] }),
    p('tools',    'Plant Labels (50)',          { desc: 'White waterproof tags',              how: '',                              price: 149, stock: 100, region: 'All India', tags: ['organize'] }),
  ];

  const all = [
    ...hyderabad, ...bangalore, ...chennai, ...mumbai,
    ...delhi, ...kolkata, ...pune, ...ahmedabad,
    ...southIndia, ...northIndia, ...coastal, ...hills,
    ...allIndia,
  ];

  // node-pg handles JS arrays for text[] columns natively – no JSON.stringify.
  await knex('products').insert(all);
  console.log(`✅ Seeded ${all.length} products across 13 region groups`);
};
