class TypingTest {
    constructor() {
        this.textToType = document.getElementById("text-to-type").textContent;
        this.userInput = document.getElementById("user-input");
        this.timerElement = document.getElementById("timer");
        this.wpmElement = document.getElementById("wpm");
        this.errorsElement = document.getElementById("errors");
        this.restartButton = document.getElementById("restart-btn");
        this.chartCanvas = document.getElementById("progress-chart");

        this.startTime = null;
        this.endTime = null;
        this.errors = 0;
        this.isTestRunning = false;

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderChart();
    }

    setupEventListeners() {
        this.userInput.addEventListener("input", () => this.handleInput());
        this.restartButton.addEventListener("click", () => this.restartTest());
    }

    handleInput() {
        if (!this.isTestRunning) {
            this.startTime = new Date();
            this.isTestRunning = true;
            this.startTimer();
        }

        const typedText = this.userInput.value;
        const currentText = this.textToType.substring(0, typedText.length);

        // Contar erros
        if (typedText !== currentText) {
            this.errors++;
            this.errorsElement.textContent = this.errors;
        }

        // Verificar se o usuário concluiu o texto
        if (typedText === this.textToType) {
            this.endTest();
        }
    }

    startTimer() {
        setInterval(() => {
            if (this.isTestRunning) {
                const currentTime = new Date();
                const elapsedTime = Math.floor((currentTime - this.startTime) / 1000);
                this.timerElement.textContent = `${elapsedTime}s`;
            }
        }, 1000);
    }

    endTest() {
        this.isTestRunning = false;
        this.endTime = new Date();
        const elapsedTime = (this.endTime - this.startTime) / 1000; // Em segundos
        const wordsTyped = this.textToType.split(" ").length;
        const wpm = Math.round((wordsTyped / elapsedTime) * 60);

        this.wpmElement.textContent = wpm;
        alert(`Parabéns! Sua velocidade foi de ${wpm} WPM.`);
        this.updateChart(wpm);
    }

    restartTest() {
        this.userInput.value = "";
        this.errors = 0;
        this.isTestRunning = false;
        this.timerElement.textContent = "0s";
        this.wpmElement.textContent = "0";
        this.errorsElement.textContent = "0";
    }

    renderChart() {
        this.chart = new Chart(this.chartCanvas.getContext("2d"), {
            type: "line",
            data: {
                labels: [],
                datasets: [
                    {
                        label: "Velocidade (WPM)",
                        data: [],
                        borderColor: "#ff6f61",
                        borderWidth: 2,
                        fill: false,
                    },
                ],
            },
            options: {
                responsive: true,
                scales: {
                    x: { beginAtZero: true },
                    y: { beginAtZero: true },
                },
            },
        });
    }

    updateChart(wpm) {
        const now = new Date().toLocaleTimeString();
        this.chart.data.labels.push(now);
        this.chart.data.datasets[0].data.push(wpm);
        this.chart.update();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new TypingTest();
});