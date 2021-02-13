console.log('in script');
// ncr_counties_expenditures
function init() {
  console.log('in funct');
    d3.json('/api/ncr_counties_expenditures_jared').then(data => {
      console.log('in d3.json');
        var bin = data.map(d => d['bin']);
                 
        // dedupe array
        bin_dropdown_items = [... new Set(bin)].sort();

        // populate dropdown
        bin_dropdown = d3.select('#bin_dropdown');
        
        // loop through each item and append to dropdown
        bin_dropdown_items.forEach(b => {
            dropdown_item = bin_dropdown.append('li');
            dropdown_item.attr('class', 'dropdown-item');
            dropdown_item.text(b);
        });

        // add event listener to drop down
        drop_down_items = d3.selectAll('.dropdown-item');
        console.log(drop_down_items);

        drop_down_items.on('click', function() {
            bin = this.innerText;
            populateBinChart(data, bin);
        });

        // inital graph
        // populateBinChart(data);

        }); 
    }

function populateBinChart(data, bin=null) {

    if(bin) {
        data = data.filter(d => d['bin'] == bin);
    }    
  
    var fiscal_year = data.map(d => d['fiscal_year']);
    var bin = data.map(d => d['bin']);
    var montgomery = data.map(d => d['montgomery']);
    var arlington = data.map(d => d['arlington']);
    var fairfax = data.map(d => d['fairfax']);
    var prince_william = data.map(d => d['prince_william']);
    var loudoun = data.map(d => d['loudoun']);
    var prince_george = data.map(d => d['prince_george']);


    var mont_trace = {
        x: fiscal_year,
        y: montgomery,
        mode: 'lines',
        name: "Montgomery"
      };
      
      var ffX_trace = {
        x: fiscal_year,
        y: fairfax,
        mode: 'lines',
        name: 'Fairfax'
      };
      
      var arl_trace = {
        x: fiscal_year,
        y: arlington,
        mode: 'lines',
        name: 'Arlington'
      };

            
      var pw_trace = {
        x: fiscal_year,
        y: prince_william,
        mode: 'lines',
        name: 'Prince William'
      };

            
      var ld_trace = {
        x: fiscal_year,
        y: loudoun,
        mode: 'lines',
        name: 'Loudoun'
      };


      var pg_trace = {
        x: fiscal_year,
        y: prince_george,
        mode: 'lines',
        name: "Prince George's"
      }
      
      var data = [ mont_trace, ffX_trace, arl_trace, pw_trace, ld_trace, pg_trace ];
      
      var layout = {
        title:'County Expenditures per Department'
      };
      
    Plotly.newPlot('bins-chart', data, layout);
    
}

init();