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
        .attr('class', 'county')
        .attr('fill', (item) => {
            let fips = item['id']
            let county = foodAccessData.find((county) => { return county['fips'] === fips; });
            if (county === undefined) { return 'lightgrey'; }
            let percentage = county['poverty_%'];
            if (percentage <= 10) {
                return 'limegreen';
            } else if (percentage <= 20) {
                return 'lightgreen';
            } else if (percentage <= 30) {
                return 'gold';
            } else if (percentage <= 40) {
                return 'orange';
            } else { return 'tomato'; }
        })
        .attr('data-fips', (item) => {
            return item['id']
        })
        .attr('data-education', (item) => {
            let fips = item['id']
            let county = foodAccessData.find((county) => { return county['fips'] === fips; });
            if (county === undefined) { return 0; }
            return county['poverty_%'];
        })
        .on('mouseover', (countyDataItem) => {
            tooltip.transition().style('visibility', 'visible');
            let fips = countyDataItem['id'];
            let county = foodAccessData.find((county) => { return county['fips'] === fips; });
            let vartext = "Not Available";
            if (county === undefined) {
                tooltip.text('Data not available');
            } else {
                tooltip.text(county['name'] + ', ' + county['state'] + ' : ' + county['poverty_%'] + '%');
                tooltip.attr('poverty-rate', county['poverty_%']);
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