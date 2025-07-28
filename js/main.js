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
        <p>${scene.description}/p>
    `;

    d3.select("#visualization").html("");

    scene.visualization();

    document.getElementById('prev-btn').disabled = state.currentScene === 0;
    document.getElementById('next-btn').disabled = state.currentScene === state.scenes.length - 1;
};

document.addEventListener("DOMContentLoaded", init);