const fs = require('fs');

const packageJson = JSON.parse(fs.readFileSync('./package.json').toString());
const { version } = packageJson;

fs.writeFileSync('./build/version.html', version);
