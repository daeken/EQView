function readStringFromTable(table, pos) {
	var ret = '';
	for(; pos < table.length, table[pos] != '\0'; ++pos)
		ret += table[pos];
	return ret;
}