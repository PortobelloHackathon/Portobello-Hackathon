// Minimal CSV parser
// Exposes window.parseCSV(text) -> { columns: string[], rows: Array<Record<string,string>> }
(function(){
	function parseLine(line) {
		// naive CSV split supporting quoted fields
		const result = [];
		let cur = '';
		let inQuotes = false;
		for (let i = 0; i < line.length; i++) {
			const ch = line[i];
			if (ch === '"') {
				if (inQuotes && line[i+1] === '"') { cur += '"'; i++; }
				else inQuotes = !inQuotes;
				continue;
			}
			if (ch === ',' && !inQuotes) { result.push(cur); cur = ''; continue; }
			cur += ch;
		}
		result.push(cur);
		return result;
	}

	function parseCSV(text) {
		const lines = text.replace(/\r\n/g,'\n').replace(/\r/g,'\n').split('\n').filter(l=>l.trim()!=='');
		if (lines.length === 0) return { columns: [], rows: [] };
		const headers = parseLine(lines[0]).map(h=>h.trim());
		const rows = lines.slice(1).map(line => {
			const parts = parseLine(line);
			const obj = {};
			for (let i = 0; i < headers.length; i++) obj[headers[i]] = parts[i] !== undefined ? parts[i].trim() : '';
			return obj;
		});
		return { columns: headers, rows };
	}

	window.parseCSV = parseCSV;
})();
