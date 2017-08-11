var sequencesObj = {
	orderedSequences: [];
};

for (var x = 0; x < readSequences.length; x++) {
	sequences.push(readSequences[x].split(""));
}

var nucleotidesPerSequence = sequences[0].length;
var nucletiodesGroupedByIndex = [];

var tempArray;
for (var x = 0; x < nucleotidesPerSequence; x++) {
	tempArray = [];
	for (var j = 0; j < sequences.length; j++) {
		tempArray.push(sequences[j][x]);
	}
	nucletiodesGroupedByIndex.push(tempArray);
}

var tempObj;
for (var x = 0; x < nucletiodesGroupedByIndex.length; x++) {
	tempObj = {};
	for (var j = 0; j < nucletiodesGroupedByIndex[x].length; j++) {
		if ( !tempObj[ nucletiodesGroupedByIndex[x][j] ] ) tempObj[ nucletiodesGroupedByIndex[x][j] ] = 1;
		else tempObj[ nucletiodesGroupedByIndex[x][j] ]++;
	}
	sequencesObj.orderedSequences.push(tempObj);
}
