function renderScene1() {
    const svg = d3.select('#visualization')
    .append('svg')
    .attr('width', 900)
    .attr('height', 500);

    const worldData = state.data.filter(d => d.country === "World");

    const parseYear = d3.timeParse("%Y");
    worldData.forEach(d => {
        d.year = parseYear(d.year);
        d.co2 = +d.co2;
    });

    const x = d3.scaleTime()
    .domain(d3.extent(worldData, d => d.year))
    .range([50, 850]);

    const y = d3.scaleLinear()
    .domain([0, d3.max(worldData, d => d.co2)])
    .range([450, 50]);

    svg.append('g')
    .attr('transform', 'translate(0, 450)')
    .call(d3.axisBottom(x));

    svg.append('g')
    .attr('transform', 'translate(50, 0)')
    .call(d3.axisLeft(y));

    const line = d3.line()
    .x(d => x(d.year))
    .y(d => y(d.co2));

    svg.append('path')
    .datum(worldData)
    .attr('fill', 'none')
    .attr('stroke', 'steelblue')
    .attr('stroke-width', 2)
    .attr('d', line);

    const annotations = [
        {
            note: {
                title: "Sharp Increase",
                label: "Global emissions began rising rapidly in the 1950s"
            },
            x: x(parseYear("1950")),
            y: y(worldData.find(d => d.year.getFullYear() === 1950).co2),
            dy: -50,
            dx: 20
        },
        {
            note: {
                title: "Recent Plateau",
                label: "Emissions growth has slowed in recent years"
            },
            x: x(parseYear("2010")),
            y: y(worldData.find(d => d.year.getFullYear() === 2010).co2),
            dy: -30,
            dx: -20
        }
    ];

    const makeAnnotations = d3.annotation().annotations(annotations);

    svg.append('g').attr('class', 'annotation-group').call(makeAnnotations);
}

function renderScene2() {
    const svg = d3.select('#visualization')
    .append('svg')
    .attr('width', 900)
    .attr('height', 500);

    svg.append('text')
    .attr('x', 450)
    .attr('y', 30)
    .attr('text-anchor', 'middle')
    .text('CO2 Emissions by Country');

    const legend = svg.append('g').attr('transform', 'translate(750, 100)');

    const colorScale = d3.scaleSequential(d3.interpolateReds)
    .domain([0, d3.max(state.data, d => +d.co2)]);

    const legendScale = d3.scaleLinear()
    .domain(colorScale.domain())
    .range([0, 100]);

    legend.selectAll('rect')
    .data(d3.range(0, 1.1, 0.1))
    .enter().append('rect')
    .attr('x', 0)
    .attr('y', d => d * 100)
    .attr('width', 20)
    .attr('height', 10)
    .attr('fill', d => colorScale(d * d3.max(state.data, d => +d.co2)));

    legend.append('g')
    .attr('transform', 'translate(25,0)')
    .call(d3.axisRight(legendScale));

    svg.append('text')
    .attr('x', 450)
    .attr('y', 480)
    .attr('text-anchor', 'middle')
    .text('Click on a country to select it');
}

function renderScene3() {
    const svg = d3.select('#visualization')
    .append('svg')
    .attr('width', 900)
    .attr('height', 500);

    const latestYear = d3.max(state.data, d => d.year);
    const countryData = state.data.filter(d => 
        d.year === latestYear && 
        d.country !== 'World' &&
        !isNaN(d['co2_per_capita'])
    );

    countryData.sort((a, b) => b['co2_per_capita'] - a['co2_per_capita']);

    const top20 = countryData.slice(0, 20);

    const x = d3.scaleLinear()
    .domain([0, d3.max(top20, d => +d['co2_per_capita'])])
    .range([50, 850]);

    const y = d3.scaleBand()
    .domain(top20.map(d => d.country))
    .range([50, 450])
    .padding(0.2);

    svg.append('g')
    .attr('transform', 'translate(0, 450)')
    .call(d3.axisBottom(x));

    svg.append('g')
    .attr('transform', 'translate(50, 0)')
    .call(d3.axisLeft(y));

    svg.selectAll('rect')
    .data(top20)
    .enter().append('rect')
    .attr('x', 50)
    .attr('y', d => y(d.country))
    .attr('width', d => x(d["co2_per_capita"]) - 50)
    .attr('height', y.bandwidth())
    .attr('fill', 'steelblue');

    const usa = top20.find(d => d.country === 'United States');
    const china = top20.find(d => d.country === 'China');

    const annotations = [
        {
             note: {
                title: "High per Capita",
                label: "Developed nations tend to have higher emissions per person"
             },
             x: x(usa['co2_per_capita']),
             y: y(usa.country) + y.bandwidth() / 2,
             dy: 0,
             dx: 20
        },
        {
            note: {
                title: "Lower per Capita",
                label: "Despite high total emissions, per capita is lower in China"
            },
            x: x(china['co2_per_capita']),
            y: y(china.country) + y.bandwidth() / 2,
            dy: 0,
            dx: 20
        }
    ];

    const makeAnnotations = d3.annotation().annotations(annotations);

    svg.append('g').attr('class', 'annotation-group').call(makeAnnotations);
}

function renderScene4() {
    const svg = d3.select('#visualization')
    .append('svg')
    .attr('width', 900)
    .attr('height', 500);

    svg.append('text')
    .attr('x', 450)
    .attr('y', 100)
    .attr('text-anchor', 'middle')
    .style('font-size', '24px')
    .text('Reducing Global Co2 Emissions');

    const solutions = [
        {action: "Renewable Energy", impact: "High"},
        {action: "Energy Efficiency", impact: "High"},
        {action: "Electric Vehicles", impact: "Medium"},
        {action: "Forest Conservation", impact: "High"}
    ];

    const x = d3.scaleBand()
    .domain(solutions.map(d => d.action))
    .range([100, 800])
    .padding(0.2);

    const color = d3.scaleOrdinal()
    .domain(["High", "Medium"])
    .range(['#e41a1c', '#377eb8']);

    svg.selectAll('rect')
    .data(solutions)
    .enter().append('rect')
    .attr('x', d => x(d.action))
    .attr('y', 200)
    .attr('width', x.bandwidth())
    .attr('height', 30)
    .attr('fill', d => color(d.impact));

    svg.selectAll('text.action')
    .data(solutions)
    .enter().append('text')
    .attr('x', d => x(d.action) + x.bandwidth() / 2)
    .attr('y', 250)
    .attr('text-anchor', 'middle')
    .text(d => d.action);

    const legend = svg.append('g')
    .attr('transform', 'translate(400, 300)');

    legend.selectAll('rect')
    .data(color.domain())
    .enter()
    .append('rect')
    .attr('x', 0)
    .attr('y', (d, i) => i * 25)
    .attr('width', 20)
    .attr('height', 20)
    .attr('fill', d => color(d));

    legend.selectAll('text')
    .data(color.domain())
    .enter().append('text')
    .attr('x', 30)
    .attr('y', (d, i) => i * 25 + 15)
    .text(d => d + " Impact");
}

const state = {
    currentScene: 0,
    selectedCountry: null,
    // Mayan Easter Egg
    selectedYear: 2012,
    scenes: [
        {
            title: "Global CO2 Emissions Over Time",
            description: "Explore how worldwide carbon dioxide emissions have changed since 1750.",
            visualization: renderScene1
        },
        {
            title: "Emissions by Country",
            description: "Compare emissions between different countries and regions.",
            visualization: renderScene2
        },
        {
            title: "Per Capita Emissions",
            description: "See which countries emit the most CO2 relative to their population size.",
            visualization: renderScene3
        },
        {
            title: "The Path Forward",
            description: "Learn what actions can be taken to reduce emissions.", 
            visualization: renderScene4
        }
    ]
};

function init() {
    d3.csv("data/cleaned_data.csv").then(
        data => {
            state.data = data;

            document.getElementById('start-btn').addEventListener("click", startNarrative);
            document.getElementById('prev-btn').addEventListener("click", prevScene);
            document.getElementById('next-btn').addEventListener("click", nextScene);

            showTitleScreen();
        }
    );
}

function showTitleScreen() {
    document.getElementById('title-screen').classList.remove('hidden');
    document.getElementById('scene-container').classList.add('hidden');
}

function startNarrative() {
    document.getElementById('title-screen').classList.add('hidden');
    document.getElementById('scene-container').classList.remove('hidden');
    renderScene();
}

const prevScene = () => {
    if (state.currentScene > 0) {
        state.currentScene--;
        renderScene();
    }
};

const nextScene = () => {
    if (state.currentScene < state.scenes.length - 1) {
        state.currentScene++;
        renderScene();
    }
};

const renderScene = () => {
    document.getElementById('scene-indicator').textContent = `Scene ${state.currentScene + 1} of ${state.scenes.length}`;

    const scene = state.scenes[state.currentScene];
    document.getElementById("narrative-text").innerHTML = `
        <h2>${scene.title}</h2>
        <p>${scene.description}</p>
    `;

    d3.select("#visualization").html("");

    scene.visualization();

    document.getElementById('prev-btn').disabled = state.currentScene === 0;
    document.getElementById('next-btn').disabled = state.currentScene === state.scenes.length - 1;
};

document.addEventListener("DOMContentLoaded", init);