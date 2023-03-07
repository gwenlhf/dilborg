
const fs = require('fs');

const spellercfg = JSON.parse(fs.readFileSync('awful-speller.json'));
const parsercfg = JSON.parse(fs.readFileSync('bad-autoparser.json'));
const wordparsercfg = JSON.parse(fs.readFileSync('cat-hacks-3.json'));
const meta = {
	// spell: 0,
	// wordparse: 100,
	// parse: 0,
	charlimit: 240
};

function _weightedrandom(nob) {
	let tot = 0;
	for (let sub in nob) {
			tot += nob[sub];
		}
	let choice = Math.random() * tot;
	for (let sub in nob) {
		tot -= nob[sub];
		if (choice >= tot) {				
			return sub;
		}
	}
}

function _uniformrandom(nob) {
	let tot = 0;
	for (let sub in nob) {
			tot += 1;
		}
	let choice = Math.random() * tot;
	for (let sub in nob) {
		tot -= 1;
		if (choice >= tot) {				
			return sub;
		}
	}
}

function _walk(cfg, depth, start, sep='') {
	let curr = start;
	let res = start;
	for (let i = 0; i < depth; i++) {
		curr = _weightedrandom(cfg[curr]);
		res += sep + curr;
	}
	return res;
}

function _walkUnweighted(cfg, start, depth) {
	let curr = start;
	let res = start;
	for (let i = 0; i < depth; i++) {
		let nob = cfg[curr];
		let tot = 0;
		for (let sub in nob) {
			tot += 1;
		}
		let choice = Math.random() * tot;
		for (let sub in nob) {
			tot -= 1;
			if (choice >= tot) {
				curr = sub;
				res += ' ' + sub;
				break;
			}
		}
	}
	return res;
}

function _speller(cfg, sep='') {
		let curr = '^';
		let word = '^';
		while (curr != '~') {
			let nob = cfg[curr];
			curr = _weightedrandom(nob);
			word += sep + curr;
		}
	return word.replace(/\^/g,'').replace(/\~/g,'');
}


function spell() {
	return _speller(spellercfg);
}

function words() {
	return _speller(wordparsercfg, ' ');
}

function fuzz(num) {
	return _walk(parsercfg, num, 'D');
}

function tweet() {
	while(true) {
		let twit = _speller(wordparsercfg, ' ');
		if (twit.length < meta.charlimit) {
			return twit;
		}
	}
}

console.log(tweet());