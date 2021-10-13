let countyURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json'
let foodAccessURL = 'https://ervinkellym.github.io/D3FoodInsecurityChoropleth/food_insecurity_counties.json'

let countyData
let foodAccessData

let canvas = d3.select('#canvas')
let tooltip = d3.select('#tooltip')

let drawMap = () => {
    canvas.selectAll('path')
        .data(countyData)
        .enter()
        .append('path')
        .attr('d', d3.geoPath())
        .attr('class', 'county');
}

let updateMap = () => {
    var selected = document.getElementById("selectionList").selectedOptions[0];  
    var dataVal = (selected === undefined) ? "poverty_%" : selected.value;
    canvas.selectAll('path')
        .attr('fill', (item) => {
            let fips = item['id']
            let county = foodAccessData.find((county) => { return county['fips'] === fips; });
            if (county === undefined) { return 'lightgrey'; }
            let percentage = county[dataVal];
            if (percentage <= 5) {
                return 'lightsteelblue';
            } else if (percentage <= 15) {
                return 'cornflowerblue';
            } else if (percentage <= 25) {
                return 'royalblue';
            } else if (percentage <= 35) {
                return 'mediumblue';
            } else { return 'midnightblue'; }
        })
        .attr('data-fips', (item) => {
            return item['id']
        })
        .attr('data-education', (item) => {
            let fips = item['id']
            let county = foodAccessData.find((county) => { return county['fips'] === fips; });
            if (county === undefined) { return 0; }
            return county[dataVal];
        })
        .on('mouseover', (countyDataItem) => {
            tooltip.transition().style('visibility', 'visible');
            let fips = countyDataItem['id'];
            let county = foodAccessData.find((county) => { return county['fips'] === fips; });
            let vartext = "Not Available";
            if (county === undefined) {
                tooltip.text('Data not available');
            } else {
                tooltip.text(county['name'] + ', ' + county['state'] + ' : ' + county[dataVal] + '%');
                tooltip.attr('poverty-rate', county[dataVal]);
            }
        })
        .on('mouseout', (countyDataItem) => { tooltip.transition().style('visibility', 'hidden'); });
}

d3.json(countyURL).then(
    (data, error) => {
        if(error) {
            console.log(error);
        } else {
            countyData = topojson.feature(data, data.objects.counties).features;
            console.log('County Data');
            console.log(countyData);

            d3.json(foodAccessURL).then(
                (data, error) => {
                    if(error) {
                        console.log(error);
                    } else {
                        foodAccessData = data;
                        console.log('Food Access Data')
                        console.log(foodAccessData);
                        drawMap();
                    }
                }
            )
        }
    }
)