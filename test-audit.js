const fs = require('fs');
const execSync = require('child_process').execSync;

const terms = ['Trisquel', 'El Trisquel', 'TrisquelAPP', 'Agroservicios', 'TrisquelApp'];

for (const term of terms) {
  try {
     const output = execSync(`grep -ri "${term}" src/ | grep -v 'binary file'`, { encoding: 'utf-8' });
     console.log(`==== Found '${term}' ====`);
     console.log(output);
  } catch(e) {
     console.log(`==== No occurrences for '${term}' ====`);
  }
}
