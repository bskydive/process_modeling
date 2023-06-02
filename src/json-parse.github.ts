const { writeFileSync } = require('fs');

const path = './config.json';
const config = { ip: '192.0.2.1', port: 3000 };

try {
  writeFileSync(path, JSON.stringify(config, null, 2), 'utf8');
  console.log('Data successfully saved to disk');
} catch (error) {
  console.log('An error has occurred ', error);
}

export function main(){
	console.log('start');
}