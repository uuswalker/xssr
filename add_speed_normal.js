const fs = require('fs');

let code = fs.readFileSync('lib/paket.ts', 'utf8');

// FiberTier
code = code.replace(
  'boosterNote?: string;',
  'boosterNote?: string;\n  speedNormal?: number;'
);

code = code.replace(
  'name: "XL Satu Spark — 250 Mbps",\n      subtitle: "Internet Only",\n      headerClass: "smart",\n      badge: "Best Seller",\n      speedMax: 250,',
  'name: "XL Satu Spark — 250 Mbps",\n      subtitle: "Internet Only",\n      headerClass: "smart",\n      badge: "Best Seller",\n      speedMax: 250,\n      speedNormal: 100,'
);

code = code.replace(
  'name: "XL Satu Spark — 300 Mbps",\n      subtitle: "Internet Only",\n      headerClass: "family",\n      speedMax: 300,',
  'name: "XL Satu Spark — 300 Mbps",\n      subtitle: "Internet Only",\n      headerClass: "family",\n      speedMax: 300,\n      speedNormal: 200,'
);

code = code.replace(
  'name: "XL Satu Spark — 400 Mbps",\n      subtitle: "Internet Only",\n      headerClass: "value",\n      speedMax: 400,',
  'name: "XL Satu Spark — 400 Mbps",\n      subtitle: "Internet Only",\n      headerClass: "value",\n      speedMax: 400,\n      speedNormal: 300,'
);

// TahunanTier
code = code.replace(
  'boosterNote: string;',
  'boosterNote: string;\n  speedNormal?: string;'
);

code = code.replace(
  'name: "Basic Smart",\n    headerGradient: "linear-gradient(135deg, #1e1b4b 0%, #7c3aed 100%)",\n    speed: "50 Mbps",\n    booster: "75 Mbps",\n    speedMax: "50",',
  'name: "Basic Smart",\n    headerGradient: "linear-gradient(135deg, #1e1b4b 0%, #7c3aed 100%)",\n    speed: "50 Mbps",\n    booster: "75 Mbps",\n    speedMax: "75",\n    speedNormal: "50",'
);

code = code.replace(
  'name: "Basic Family",\n    headerGradient: "linear-gradient(135deg, #1e1b4b 0%, #6d28d9 100%)",\n    speed: "100 Mbps",\n    booster: "150 Mbps",\n    speedMax: "100",',
  'name: "Basic Family",\n    headerGradient: "linear-gradient(135deg, #1e1b4b 0%, #6d28d9 100%)",\n    speed: "100 Mbps",\n    booster: "150 Mbps",\n    speedMax: "150",\n    speedNormal: "100",'
);

code = code.replace(
  'name: "Basic Superuser",\n    headerGradient: "linear-gradient(135deg, #312e81 0%, #7c3aed 100%)",\n    speed: "150 Mbps",\n    booster: "200 Mbps",\n    speedMax: "150",',
  'name: "Basic Superuser",\n    headerGradient: "linear-gradient(135deg, #312e81 0%, #7c3aed 100%)",\n    speed: "150 Mbps",\n    booster: "200 Mbps",\n    speedMax: "200",\n    speedNormal: "150",'
);

fs.writeFileSync('lib/paket.ts', code);
console.log('Fixed paket data');
