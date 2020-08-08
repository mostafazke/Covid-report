const map = (rawData) => {
  const width = 900;
  const height = 500;

  const svg = d3
    .select('.container')
    .append('svg')
    .attr('class', 'map')
    .attr('width', width)
    .attr('height', height);

  let dataType = d3.select('input[type=radio][name=map-options]').attr('value');
  let world;
  const projection = d3
    .geoNaturalEarth1()
    .scale(153)
    .translate([width / 2, height / 2])
    .precision(0.1);
  const path = d3.geoPath().projection(projection);

  var colorScale = d3.scaleThreshold().range(d3.schemeReds[7]);

  const legend = d3
    .legendColor()
    .labelFormat(d3.format('.0s'))
    .labels(d3.legendHelpers.thresholdLabels)
    .scale(colorScale);

  d3.selectAll('input[type=radio][name=map-options]').on('change', function () {
    dataType = d3.select(this).attr('value');
    update(world);
  });

  d3.json('./data/countries-110m.json')
    .then((rawWorld) => {
      world = rawWorld;
      const mapInfo = d3.map();
      for (let i = 0; i < data.Countries.length; i++) {
        mapInfo.set(data.Countries[i].CountryCode, data.Countries[i][dataType]);
      }

      switch (dataType) {
        case 'TotalRecovered':
          colorScale.domain([500, 5000, 10000, 50000, 100000, 500000]);
          break;
        case 'TotalDeaths':
          colorScale.domain([0, 500, 1000, 5000, 10000, 50000]);
          break;
        default:
          colorScale.domain([1000, 10000, 50000, 100000, 500000, 1000000]);
          break;
      }

      const countries = svg
        .append('g')
        .attr('class', 'countries')
        .selectAll('path')
        .data(topojson.feature(world, world.objects.countries).features)
        .join('path')
        .attr('fill', function (d) {
          d.total = mapInfo.get(d.properties.alpha2) || 0;
          return colorScale(d.total);
        })
        .attr('d', path)
        .append('title')
        .text((d) => `${d.properties.name}, ${d.total}`);

      const boundary = svg
        .append('g')
        .attr('class', 'boundary')
        .append('path')
        .attr('fill', 'none')
        .attr('stroke', '#fff')
        .datum(topojson.mesh(world, world.objects.countries, (a, b) => a !== b))
        .attr('d', path);

      svg
        .append('g')
        .attr('class', 'legend')
        .attr('transform', `translate(40, ${height / 2})`)
        .call(legend);

    })
    .catch(console.error);

  function update(world) {
    const mapInfo = d3.map();
    for (let i = 0; i < data.Countries.length; i++) {
      mapInfo.set(data.Countries[i].CountryCode, data.Countries[i][dataType]);
    }

    switch (dataType) {
      case 'TotalRecovered':
        colorScale.domain([1000, 10000, 50000, 100000, 500000, 1000000]);
        break;
      case 'TotalDeaths':
        colorScale.domain([100, 500, 1000, 10000, 50000, 100000]);
        break;
      default:
        colorScale.domain([1000, 10000, 50000, 100000, 500000, 1000000]);
        break;
    }
    d3.select('.countries')
      .selectAll('path')
      .attr('fill', function (d) {
        d.total = mapInfo.get(d.properties.alpha2) || 0;
        return colorScale(d.total);
      })
      .select('title')
      .text((d) => `${d.properties.name}, ${d.total}`);

    d3.select('.legend').call(legend);
  }
};
