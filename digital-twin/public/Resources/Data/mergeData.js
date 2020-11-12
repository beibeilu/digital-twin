const fs = require("fs")
let tract = require("./tract.json")
let income = require("./geo_median_income.json")

let finalResult = tract;
let hashMap = {}
for(let key in tract.features){
	let geoID = tract.features[key].properties.GeoId;
	hashMap[geoID] = key;
}

for(let key in income.features){
	let geoID = income.features[key].properties.GEO_ID;
	console.log(finalResult.features[hashMap[geoID]], geoID)
	for(let i = 0 ; i < 9; i++){
		finalResult.features[hashMap[geoID]].properties[`medium_income_201${i}`] = income.features[key].properties[`medium_income_201${i}`]
	}

}
fs.writeFile('result.json', JSON.stringify(finalResult), (err) => {
	if (err) console.error()
});