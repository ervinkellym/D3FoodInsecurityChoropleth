let countyURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json'
let foodAccessURL = 'https://ervinkellym.github.io/D3FoodInsecurityChoropleth/food_insecurity_counties.json'

let countyData
let foodAccessData

let canvas = d3.select('#canvas')

let drawMap = () => {
    canvas.selectAll('path')
        .data(countyData)
        .enter()
        .append('path')
        .attr('d', d3.geoPath())
        .attr('class', 'county')
}

d3.json(countyURL).then(
    (data, error) => {
        if(error) {
            console.log(error);
        } else {
            countyData = topojson.feature(data, data.objects.counties);
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