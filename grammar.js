exports.correctGrammar =  function(string){
    let allLower = string.toLowerCase();
    let correctedCase = allLower.charAt(0).toUpperCase() + allLower.slice(1);
    let commaMatch =/(,|\))([A-Za-z0-9]+)/g
    let commaSpaces = correctedCase.replace(commaMatch, "$1 $2");
    let doubleSpacesMatch = /  /
    let grammarOK = commaSpaces.replace(doubleSpacesMatch, " ");
    return grammarOK;
}