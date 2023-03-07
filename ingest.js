
const csv = require('csv-parser');
const fs = require('fs');

const dilbs_container = [];
const result = {};

fs.createReadStream('dilbs-2.csv')
  .pipe(csv({ headers:false }))
  .on('data', (data) => dilbs_container.push(data))
  .on('end', () => {
    createWeightedModel(dilbs_container);
  });

function createWeightedModel(csvs) {
	for (let item of csvs) {
		let tscrip = item[2];
		ingest(tscrip);
	}
	fs.writeFile('cat-hacks-3.json', JSON.stringify(result), (err) => {
    if (err) throw err;
    console.log('Data written to file');
});
}

function ingest(str) {
	// strip punctuation
	let tokens = str.replace(/[.!-?:,'()\\/]/g,'').toLowerCase().split(' ');
	// add start and end tokens ('~' was used instead of '$' because '$' appears many times in the source material)
	tokens = ['^'].concat(tokens).concat(['~']);
	for (let i = 0; i < tokens.length - 1; i++) {
		updateWeight(tokens[i], tokens[i + 1]);
	}
}

function updateWeight(i,j) {
	if (!result[i]) {
		result[i] = {};
	} 
	if (!result[i][j]) {
		result[i][j] = 1;
	} else {
		result[i][j]++;
	}
}
