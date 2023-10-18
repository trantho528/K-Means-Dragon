const kmean = require('./kmean');
const fs = require('fs');


let rawData = fs.readFileSync('./DragonCacheData1999.json');
let dataJson = JSON.parse(rawData);

const arrData1 = dataJson['path1'];
const arrData2 = dataJson['path2'];
const arrData3 = dataJson['path3'];


function convertData(outPut, arrData) {
    for(let i = 0; i < arrData.length; i++) {
        const dataLine = arrData[i].split(',');
        for(let j = 0; j < dataLine.length - 1; j++) {
            if( j % 2 == 0) {
                const outPutPerLine = [];
                outPutPerLine.push(Number(dataLine[j]));
                const k = j + 1;
                outPutPerLine.push(Number(dataLine[k]));
                outPut.push(outPutPerLine);
            }
        }
    }
}

const outPut = [];
//
convertData(outPut,arrData1);
convertData(outPut, arrData2);
convertData(outPut, arrData3);
// console.log(outPut);

// const testData = [[-462,-123],[-410,-187],[-482,-89],[-506,11],[-485,112],[-445,167],[-387,204],[-319,214],[-251,200],[-189,169],[-131,132],[-73,95],[-5,68]];
console.log(outPut.length);

const result = kmean(outPut, 2008);

const {centroids, clusters} = result;
// console.log(centroids);
// console.log(result.clusters[0].points);
// console.log(result.clusters[0].centroid);
// console.log(result.centroids);

//Convert data to indexed data
let outputData = [];
for(let i = 0; i < clusters.length; ++i){ //i -> index in palette
    let cluster = clusters[i];
    for(let j = 0; j < outPut.length; ++j){
        if(cluster.points.includes(outPut[j])){
            outputData[j] = i;
        }
    }
}
console.log(outputData);

const chunkArray = (arr, size) =>
    arr.length > size
        ? [arr.slice(0, size), ...chunkArray(arr.slice(size), size)]
        : [arr];
        
let paths = chunkArray(outputData, outputData.length/3);
let obj = {};
for(let i = 0; i < paths.length; ++i){
    let output = chunkArray(paths[i],13);
    let name = 'path' + (i+1);
    obj[name] = output;
}
// outputData = chunkArray(outputData, 13);
//
// const dataString = [];
// const tempStr = [];
// while(indexData.length > 0) {
//     const obj = indexData.shift();
//     if(tempStr.length < 13) {
//         tempStr.push(obj);
//     } else {
//         dataString.push(tempStr.toString());
//         tempStr.length = 0;
//     }
// }

fs.writeFile('output.json', JSON.stringify({centroids, data : obj}), err => {
    if (err) {
      console.error(err);
    }
});

