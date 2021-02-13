// ncr_counties_expenditures
function init() {
    d3.json('/api/ncr_counties_expenditures').then(data => {

        // console.log(d3.event.target);
        var fiscal_year = data.map(d => d['fiscal_year']);
                 
        // dedupe fiscal_year array
        fiscal_year = [... new Set(fiscal_year)];

        // sort (numeric) fiscal_year array descending
        fiscal_year = fiscal_year.sort().reverse();

        // populate fiscal year dropdown
        fiscal_year_dropdown = d3.select('#fiscal_year_dropdown');
        console.log(fiscal_year_dropdown);
        // loop through each year and append to dropdown
        fiscal_year.forEach(fy => {

            console.log(fy);
            //<a class="dropdown-item" href="#">Action</a>
            dropdown_item = fiscal_year_dropdown.append('li');
            dropdown_item.attr('class', 'dropdown-item');
            dropdown_item.text(fy);
        });


        // add event listener to drop down
        drop_down_items = d3.selectAll('.dropdown-item');
        console.log(drop_down_items);

        drop_down_items.on('click', function() {
            console.log('hey');
            fy = this.innerText;
            console.log(fy);
            populateCountyExpenditures(data, fy);



        }); 



        populateCountyExpenditures(data);

    /*
        {
            bin: "Governing",
            county: "Prince George's",
            department: "CENTRAL SERVICES",
            expenditures_ytd: "20919764.5",
            fiscal_year: 2016
        }
    */

    });
}
// end of ncr_county_expenditures


function populateCountyExpenditures(data, fy=null) {

    //console.log(data);

    if(fy) {
        dataFiltered = data.filter(d => d['fiscal_year'] == fy);
    }
    else {
        dataFiltered = data;
        console.log('else');
    }
    

    var county = dataFiltered.map(d => d['county']);
    var expenditures = dataFiltered.map(d => d['expenditures_ytd']);
    // var expenditures = dataFiltered.map(d => {
    //    dstep1 = d['expenditures_ytd'];
    //    dstep2 = dstep1.replace('$','');
    //    dstep3 = dstep2.replace(',','');
    //    dstep4 = parseFloat(dstep3);

    //    return dstep4;
    // });

    console.log(county);
    console.log(expenditures);

    var dataToPlot = [{
        type: 'bar',
        x: expenditures,
        y: county,
        orientation: 'h'
    }];
    
    Plotly.newPlot('county-expenditures', dataToPlot);
}





init();



// initial function call
