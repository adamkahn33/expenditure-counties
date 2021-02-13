/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *              Initialize the visualization               *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

d3.json("/api/ncr_counties_expenditures").then(response => {
  //select FY drop down element
  var fyElement = d3.select("#selFY");

  // get Fiscal Year values for dropdown options
  var fyOptions = [...new Set(response.map(obj => obj.fiscal_year))];
  //convert to integer and sort

  fyOptions = fyOptions.map(x => +x);
  fyOptions.sort((a,b) => (a-b));

  //loop through array of FYs and create new DOM node for each and append
  fyOptions.forEach(fy => {
    console.log(fy);
    fyElement
      .append("option")
      .text(fy)
      .property('value', fy)
  });
console.log(fyOptions)

  //select county checkboxes element
  var countyElement = d3.select("#county1");
        
  // get Fiscal Year values for dropdown options
  var countyOptions = [...new Set(response.map(obj => obj.county))];

  countyOptions.forEach(county => {
    console.log(county);
    countyElement
      .append("option")
      .text(county)
      .property('value', county)
  });
console.log(countyOptions)
/*
  //loop through array of counties and create new DOM node for each and append
  countyOptions.forEach(county => {
    countyElement      
      .append("input")
 //       .attr('type', 'select')
        .attr('value', county)
 //       .property('del', true)
    countyElement
      .append("label")
        .text(county)
    });
*/


  var firstFY = d3.select('#selFY').property('value');
  var firstCounty = d3.select('#county1').property('value');
  buildCharts(firstCounty, firstFY);
});


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
*              buildCharts() function                     *
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
  

function buildCharts(county, fy) {
  d3.json("/api/ncr_counties_expenditures").then(response => {
    // filter data on fiscal year

    var filteredFairfax = response.filter(d => d.fiscal_year == fy && d.county == county);
        console.log(filteredFairfax)
    // filter data on county
     //var filteredFairfax = filteredFairfax_fy.filter(d => d.county == county);
    // department labels
    var labels = filteredFairfax.map(d => d.department)
      console.log(labels)
    // Empty array for parents
    var parents = new Array(labels.length).fill("");
       console.log(parents)
    // Expenditure values
    var expenditure_values = filteredFairfax.map(data => data.expenditures_ytd)
    console.log(expenditure_values)
    //convert currency strings to float
   //expenditure_values = expenditure_values.map(x => Number(x.replace(/[^0-9.-]+/g,"")));
  

    /****** TREE MAP *******/
    var data = [{
          type: "treemap",
          labels: labels,
          parents: parents,
          values:  expenditure_values,
          textinfo: "label+value+percent parent+percent entry",
          // domain: {"x": [0, 0.48]},
          outsidetextfont: {"size": 20, "color": "#377eb8"},
          marker: {"line": {"width": 2}},
          pathbar: {"visible": false}
        }];

    var layout = {
      title: `<b>${fy} ${county} Expenditures</b>`,
      font: {
        family: 'arial',
        size: 20,
        color: '#ffffff'
      },
      paper_bgcolor: 'rgba(255,0,0,0.0)',
      plot_bgcolor: 'rgba(255,0,0,0.0)'}

    Plotly.newPlot('fairfaxPlot', data, layout, {displayModeBar: false});
});
}
 


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
*              optionChanged() function                   * 
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

function optionChanged(selcounty,selfy) {

  //Fetch new data each time a new FY from dropdown is selected
          // add event listener to drop down
        var selcounty = d3.select('#county1').property('value');
        var selfy = d3.select('#selFY').property('value');
        console.log(selcounty);
        console.log(selfy);
  
  buildCharts(selcounty,selfy);
}

fydropdown = d3.select('#selFY')
countydropdown = d3.select('#county1')

fydropdown.on('click', optionChanged)
countydropdown.on('click', optionChanged)

// BUTTON FUNCTIONALITY
//btn = d3.select('#breakdown');
//btn.on('click',buildCharts(selcounty, selfy));


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
*              County Map                                  * 
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

// Creating map object
var myMap = L.map("map", {
  center: [38.91999, -77.26581],
  zoom: 8,
  zoomControl: false,
  scrollWheelZoom: false,
  attributionControl: false
});

myMap.dragging.disable();

// Use this link to get the geojson data.
var link = "static/data/scoped_counties.geojson";

// Grabbing our GeoJSON data..
d3.json("/api/geojson/ncr").then(data => {
  
  // Creating a geoJSON layer with the retrieved data
  L.geoJson(data, {
    // Style each feature (in this case a county)
    style: function(feature) {
      return {
        color: "#6E7889",
        fillColor: '#d3d3d3',
        fillOpacity: 0.01,
        weight: 1.5
      };
    },
    // Called on each feature
    onEachFeature: function(feature, layer) {

      // Set mouse events to change map styling
      layer.on({
        // When a user's mouse touches a map feature, the mouseover event calls this function, that feature's opacity changes to 90% so that it stands out
        mouseover: function(event) {

          layer = event.target;
          layer.setStyle({
            fillOpacity: 1            
          });
          
          d3.select('#county-hover').html(
            `
            <strong>${feature.properties.county}</strong>
            `
          );
    
        },
        // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 50%
        mouseout: function(event) {

          layer = event.target;
          layer.setStyle({
            fillOpacity: 0.01
          });

          d3.select('#county-hover').html(
            ``
          );
        },

      });

    }
  }).addTo(myMap);

});
