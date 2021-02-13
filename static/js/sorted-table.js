d3.csv(csvfile, function(err, data) {
    console.log('in promise');

    console.log(data);
    
    var sortAscending = true;
    var table = d3.select('#page-wrap').append('table');
    table.attr('class', 'table table-dark table-striped');
    var titles = d3.keys(data[0]);
    
    var headers = table.append('thead').append('tr')
                    .selectAll('th')
                    .data(titles).enter()
                    .append('th')
                    .text(function (d) {
                        return d;
                    })
                    .on('click', function (d) {
                        headers.attr('class', 'header');
                            if (sortAscending) {
                                rows.sort(function(a, b) {return d3.ascending(b[d], a[d]);  });
                                sortAscending = false;
                                this.className = 'aes';
                                } 
                            else {
                                rows.sort(function(a, b) { return d3.descending(b[d], a[d]); });
                                sortAscending = true;
                                this.className = 'des';
                                }
                    });
    var rows = table.append('tbody').selectAll('tr')
                .data(data).enter()
                .append('tr');
    rows.selectAll('td')
    .data(function (d) {
        return titles.map(function (k) {
            return { 'value': d[k], 'name': k};
        });
    }).enter()
    .append('td')
    .attr('data-th', function (d) {
        return d.name;
    })
    .text(function (d) {
        return d.value;
    });
});
