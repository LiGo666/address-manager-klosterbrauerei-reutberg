const XLSX = require('xlsx');

// German first names
const firstNames = [
  'Max', 'Anna', 'Thomas', 'Maria', 'Michael', 'Sarah', 'Andreas', 'Julia',
  'Stefan', 'Lisa', 'Christian', 'Laura', 'Daniel', 'Jessica', 'Markus', 'Nicole',
  'Sebastian', 'Melanie', 'Alexander', 'Stephanie', 'Martin', 'Jennifer', 'Jan', 'Katharina',
  'Peter', 'Nina', 'Florian', 'Vanessa', 'David', 'Sabrina', 'Benjamin', 'Christina',
  'Matthias', 'Nadine', 'Johannes', 'Sandra', 'Tobias', 'Julia', 'Philipp', 'Carolin',
  'Simon', 'Annika', 'Felix', 'Franziska', 'Lukas', 'Michelle', 'Kevin', 'Lisa',
  'Marco', 'Julia', 'Tim', 'Sophie', 'Nico', 'Marie', 'Jonas', 'Lea',
  'Fabian', 'Hannah', 'Patrick', 'Lena', 'Marcel', 'Emily', 'Dominik', 'Amelie'
];

// German last names
const lastNames = [
  'Müller', 'Schmidt', 'Schneider', 'Fischer', 'Weber', 'Meyer', 'Wagner', 'Becker',
  'Schulz', 'Hoffmann', 'Schäfer', 'Koch', 'Bauer', 'Richter', 'Klein', 'Wolf',
  'Schröder', 'Neumann', 'Schwarz', 'Zimmermann', 'Braun', 'Krüger', 'Hofmann', 'Hartmann',
  'Lange', 'Schmitt', 'Werner', 'Schmitz', 'Krause', 'Meier', 'Lehmann', 'Schmid',
  'Schulze', 'Maier', 'Köhler', 'Herrmann', 'König', 'Walter', 'Mayer', 'Huber',
  'Kaiser', 'Fuchs', 'Peters', 'Lang', 'Scholz', 'Möller', 'Weiß', 'Jung',
  'Hahn', 'Schubert', 'Vogel', 'Friedrich', 'Keller', 'Günther', 'Frank', 'Berger'
];

// German salutations
const salutations = ['Herr', 'Frau', 'Herr', 'Frau', 'Herr', 'Frau', 'Herr Dr.', 'Frau Dr.', 'Herr Prof.', 'Frau Prof.'];

// German street names
const streetNames = [
  'Hauptstraße', 'Bahnhofstraße', 'Kirchstraße', 'Dorfstraße', 'Gartenstraße', 'Schulstraße',
  'Bergstraße', 'Waldstraße', 'Lindenstraße', 'Rosenstraße', 'Sonnenstraße', 'Mühlenstraße',
  'Parkstraße', 'Neue Straße', 'Alte Straße', 'Poststraße', 'Marktstraße', 'Friedhofstraße',
  'Am Markt', 'Am Bahnhof', 'Am Park', 'Am See', 'Am Wald', 'Zur Mühle',
  'Zum Bahnhof', 'Zum Park', 'Zum See', 'Zum Wald', 'Im Tal', 'Auf der Höhe'
];

// German cities with postal codes
const cities = [
  { city: 'Berlin', postalCode: '10115' },
  { city: 'Hamburg', postalCode: '20095' },
  { city: 'München', postalCode: '80331' },
  { city: 'Köln', postalCode: '50667' },
  { city: 'Frankfurt am Main', postalCode: '60311' },
  { city: 'Stuttgart', postalCode: '70173' },
  { city: 'Düsseldorf', postalCode: '40213' },
  { city: 'Dortmund', postalCode: '44135' },
  { city: 'Essen', postalCode: '45127' },
  { city: 'Leipzig', postalCode: '04109' },
  { city: 'Bremen', postalCode: '28195' },
  { city: 'Dresden', postalCode: '01067' },
  { city: 'Hannover', postalCode: '30159' },
  { city: 'Nürnberg', postalCode: '90402' },
  { city: 'Duisburg', postalCode: '47051' },
  { city: 'Bochum', postalCode: '44787' },
  { city: 'Wuppertal', postalCode: '42103' },
  { city: 'Bielefeld', postalCode: '33602' },
  { city: 'Bonn', postalCode: '53111' },
  { city: 'Münster', postalCode: '48143' },
  { city: 'Karlsruhe', postalCode: '76131' },
  { city: 'Mannheim', postalCode: '68159' },
  { city: 'Augsburg', postalCode: '86150' },
  { city: 'Wiesbaden', postalCode: '65183' },
  { city: 'Gelsenkirchen', postalCode: '45879' },
  { city: 'Mönchengladbach', postalCode: '41061' },
  { city: 'Braunschweig', postalCode: '38100' },
  { city: 'Chemnitz', postalCode: '09111' },
  { city: 'Kiel', postalCode: '24103' },
  { city: 'Aachen', postalCode: '52062' }
];

// Name2 options (optional field)
const name2Options = ['', '', '', '', '', '', 'c/o Familie', 'c/o', 'bei', ''];

function randomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateData(count) {
  const data = [];
  
  // 4 verschiedene Werte für NOTUSE
  const notuseValues = ['Wert1', 'Wert2', 'Wert3', 'Wert4'];
  
  // Wähle 4 zufällige Indizes aus, bei denen NOTUSE gesetzt wird
  const notuseIndices = new Set();
  while (notuseIndices.size < 4) {
    notuseIndices.add(randomInt(0, count - 1));
  }
  const notuseIndicesArray = Array.from(notuseIndices);
  
  for (let i = 1; i <= count; i++) {
    const firstName = randomElement(firstNames);
    const lastName = randomElement(lastNames);
    const salutation = randomElement(salutations);
    const cityData = randomElement(cities);
    const streetName = randomElement(streetNames);
    const houseNumber = randomInt(1, 200);
    const name2 = randomElement(name2Options);
    
    // Prüfe, ob dieser Datensatz einen NOTUSE-Wert bekommen soll
    const dataIndex = i - 1; // 0-basiert
    let notuseValue = '';
    if (notuseIndicesArray.includes(dataIndex)) {
      const valueIndex = notuseIndicesArray.indexOf(dataIndex);
      notuseValue = notuseValues[valueIndex];
    }
    
    data.push({
      'Mitgliedsnummer': String(10000 + i),
      'Anrede': salutation,
      'Vorname': firstName,
      'Nachname': lastName,
      'Name2': name2,
      'Straße': `${streetName} ${houseNumber}`,
      'PLZ': cityData.postalCode,
      'Ort': cityData.city,
      'NOTUSE': notuseValue
    });
  }
  
  return data;
}

// Generate 10,000 records
console.log('Generiere 10.000 Datensätze...');
const data = generateData(10000);

// Create workbook and worksheet
const worksheet = XLSX.utils.json_to_sheet(data);
const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, 'Mitglieder');

// Auto-size columns
const colWidths = Object.keys(data[0]).map((key) => ({
  wch: Math.max(key.length, ...data.map((row) => String(row[key] || '').length))
}));
worksheet['!cols'] = colWidths;

// Write file
const filename = 'Musterdatei_Mitgliederabfrage_10000.xlsx';
XLSX.writeFile(workbook, filename);

console.log(`✓ Datei erfolgreich erstellt: ${filename}`);
console.log(`✓ Anzahl Datensätze: ${data.length}`);
