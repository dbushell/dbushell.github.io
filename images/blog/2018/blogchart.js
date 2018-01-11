(function() {
  google.charts.load('current', {packages: ['corechart']});
  google.charts.setOnLoadCallback(drawChart);
  function drawChart() {
    var data = google.visualization.arrayToDataTable([
      ['Year', 'Blogs', {role: 'style'}],
      ['2009', 29, '#a1e5cf'],
      ['2010', 42, '#1d97bf'],
      ['2011', 53, '#ff6680'],
      ['2012', 54, '#a1e5cf'],
      ['2013', 41, '#1d97bf'],
      ['2014', 15, '#ff6680'],
      ['2015', 15, '#a1e5cf'],
      ['2016', 10, '#1d97bf'],
      ['2017', 8, '#ff6680']
    ]);
    var options = {
      title: 'dbushell.com blogs per annum',
      legend: {position: 'none'}
    };
    var chart = new google.visualization.BarChart(
      document.getElementById('blogchart')
    );
    chart.draw(data, options);
  }
  window.addEventListener('resize', drawChart, false);
  window.addEventListener('orientationchange', drawChart, false);
})();
