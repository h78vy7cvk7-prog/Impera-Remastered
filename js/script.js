(() => {
    "use strict";

    const menuScreen = document.getElementById("menuScreen");
    const worldScreen = document.getElementById("worldScreen");

    const newGameButton = document.getElementById("newGame");
    const continueButton = document.getElementById("continueGame");
    const settingsButton = document.getElementById("settings");
    const creditsButton = document.getElementById("credits");

    const modal = document.getElementById("gameModal");
    const closeModalButton = document.getElementById("closeModal");
    const scenarioButtons = document.querySelectorAll(".scenario-card");

    const backToMenuButton = document.getElementById("backToMenu");
    const selectedScenarioText = document.getElementById("selectedScenario");
    const worldMap = document.getElementById("worldMap");

    const countryName = document.getElementById("countryName");
    const countryCode = document.getElementById("countryCode");
    const countryIso = document.getElementById("countryIso");
    const countryContinent = document.getElementById("countryContinent");
    const countryPopulation = document.getElementById("countryPopulation");
    const countryGdp = document.getElementById("countryGdp");
    const startCountryButton = document.getElementById("startCountry");

    let selectedScenario = null;
    let selectedCountry = null;
    let gameState = null;

    const countryData = {
        TR: {
            name: "Türkiye",
            treasury: 220,
            income: 22,
            industry: 28,
            army: 42,
            population: 16,
            stability: 72
        },

        DE: {
            name: "Almanya",
            treasury: 900,
            income: 95,
            industry: 180,
            army: 180,
            population: 68,
            stability: 75
        },

        FR: {
            name: "Fransa",
            treasury: 750,
            income: 80,
            industry: 145,
            army: 135,
            population: 42,
            stability: 70
        },

        GB: {
            name: "Birleşik Krallık",
            treasury: 1000,
            income: 100,
            industry: 170,
            army: 150,
            population: 47,
            stability: 80
        },

        IT: {
            name: "İtalya",
            treasury: 500,
            income: 55,
            industry: 90,
            army: 100,
            population: 44,
            stability: 65
        },

        US: {
            name: "Amerika Birleşik Devletleri",
            treasury: 1200,
            income: 120,
            industry: 220,
            army: 140,
            population: 132,
            stability: 85
        },

        RU: {
            name: "Sovyetler Birliği",
            treasury: 650,
            income: 70,
            industry: 140,
            army: 260,
            population: 170,
            stability: 60
        },

        JP: {
            name: "Japonya",
            treasury: 600,
            income: 65,
            industry: 120,
            army: 130,
            population: 70,
            stability: 75
        },

        CN: {
            name: "Çin",
            treasury: 300,
            income: 35,
            industry: 55,
            army: 160,
            population: 530,
            stability: 45
        },

        ES: {
            name: "İspanya",
            treasury: 320,
            income: 38,
            industry: 62,
            army: 75,
            population: 25,
            stability: 50
        }
    };

    const countryAliases = {
        TUR: "TR",
        Turkey: "TR",
        turkey: "TR",

        DEU: "DE",
        Germany: "DE",
        germany: "DE",

        FRA: "FR",
        France: "FR",
        france: "FR",

        GBR: "GB",
        UK: "GB",

        ITA: "IT",
        Italy: "IT",
        italy: "IT",

        USA: "US",

        RUS: "RU",
        Russia: "RU",
        russia: "RU",

        JPN: "JP",
        Japan: "JP",
        japan: "JP",

        CHN: "CN",
        China: "CN",
        china: "CN",

        ESP: "ES",
        Spain: "ES",
        spain: "ES"
    };

    function openModal() {
        if (!modal) return;

        modal.classList.remove("hidden");
        modal.setAttribute("aria-hidden", "false");
    }

    function closeModal() {
        if (!modal) return;

        modal.classList.add("hidden");
        modal.setAttribute("aria-hidden", "true");
    }

    function showMenu() {
        closeModal();

        if (worldScreen) {
            worldScreen.classList.add("hidden");
            worldScreen.setAttribute("aria-hidden", "true");
        }

        if (menuScreen) {
            menuScreen.classList.remove("hidden");
        }
    }

    function showWorldScreen(scenario) {
        selectedScenario = scenario;
        selectedCountry = null;

        closeModal();

        if (menuScreen) {
            menuScreen.classList.add("hidden");
        }

        if (worldScreen) {
            worldScreen.classList.remove("hidden");
            worldScreen.setAttribute("aria-hidden", "false");
        }

        updateScenarioText(scenario);
        resetCountryPanel();
    }

    function updateScenarioText(scenario) {
        if (!selectedScenarioText) return;

        const scenarioNames = {
            "1936": "1936 — Savaşın Eşiğinde",
            "1914": "1914 — Büyük Savaş",
            modern: "Günümüz — Yeni Dünya Düzeni"
        };

        selectedScenarioText.textContent =
            `Senaryo: ${scenarioNames[scenario] || scenario}`;
    }

    function resetCountryPanel() {
        if (countryName) {
            countryName.textContent = "Bir ülke seç";
        }

        if (countryCode) {
            countryCode.textContent = "Haritadaki ülkelere dokun.";
        }

        if (countryIso) {
            countryIso.textContent = "—";
        }

        if (countryContinent) {
            countryContinent.textContent = "—";
        }

        if (countryPopulation) {
            countryPopulation.textContent = "—";
        }

        if (countryGdp) {
            countryGdp.textContent = "—";
        }

        if (startCountryButton) {
            startCountryButton.disabled = true;
        }
    }

    function normalizeCountryCode(detail) {
        const possibleValues = [
            detail.iso,
            detail.code,
            detail.id,
            detail.name
        ];

        for (const value of possibleValues) {
            if (!value) continue;

            const cleanValue = String(value).trim();

            if (countryData[cleanValue]) {
                return cleanValue;
            }

            if (countryAliases[cleanValue]) {
                return countryAliases[cleanValue];
            }

            const upperValue = cleanValue.toUpperCase();

            if (countryData[upperValue]) {
                return upperValue;
            }

            if (countryAliases[upperValue]) {
                return countryAliases[upperValue];
            }
        }

        return null;
    }

    function selectCountry(detail) {
        if (!detail) return;

        const code = normalizeCountryCode(detail);

        if (!code || !countryData[code]) {
            selectedCountry = {
                code: detail.iso || detail.id || "—",
                name: detail.name || detail.id || "Bilinmeyen Ülke",
                supported: false
            };

            if (countryName) {
                countryName.textContent = selectedCountry.name;
            }

            if (countryCode) {
                countryCode.textContent =
                    "Bu ülke için başlangıç verileri henüz eklenmedi.";
            }

            if (countryIso) {
                countryIso.textContent = selectedCountry.code;
            }

            if (countryContinent) {
                countryContinent.textContent = "Bilinmiyor";
            }

            if (countryPopulation) {
                countryPopulation.textContent = "—";
            }

            if (countryGdp) {
                countryGdp.textContent = "—";
            }

            if (startCountryButton) {
                startCountryButton.disabled = true;
            }

            return;
        }

        const data = countryData[code];

        selectedCountry = {
            code,
            name: data.name,
            supported: true
        };

        if (countryName) {
            countryName.textContent = data.name;
        }

        if (countryCode) {
            countryCode.textContent =
                `Başlangıç hazinesi: ${data.treasury} • Tur geliri: +${data.income}`;
        }

        if (countryIso) {
            countryIso.textContent = code;
        }

        if (countryContinent) {
            countryContinent.textContent = "Oynanabilir";
        }

        if (countryPopulation) {
            countryPopulation.textContent = `${data.population} milyon`;
        }

        if (countryGdp) {
            countryGdp.textContent = `Sanayi: ${data.industry}`;
        }

        if (startCountryButton) {
            startCountryButton.disabled = false;
        }
    }

    function createCountryDetail(country) {
        return {
            id: country.id || "",

            name:
                country.dataset.name ||
                country.dataset.country ||
                country.getAttribute("aria-label") ||
                country.getAttribute("name") ||
                country.id ||
                "Bilinmeyen Ülke",

            iso:
                country.dataset.iso ||
                country.dataset.code ||
                country.getAttribute("data-id") ||
                country.id ||
                "—"
        };
    }

    function connectCountryElements(svgDocument) {
        const countries = svgDocument.querySelectorAll(
            "[data-name], [data-country], [data-iso], path[id], polygon[id], g[id]"
        );

        countries.forEach((country) => {
            if (country.dataset.imperaConnected === "true") {
                return;
            }

            country.dataset.imperaConnected = "true";
            country.style.cursor = "pointer";

            country.addEventListener("click", (event) => {
                event.stopPropagation();

                svgDocument
                    .querySelectorAll(".impera-selected-country")
                    .forEach((item) => {
                        item.classList.remove("impera-selected-country");
                    });

                country.classList.add("impera-selected-country");

                selectCountry(createCountryDetail(country));
            });
        });

        if (!svgDocument.getElementById("impera-selection-style")) {
            const style = svgDocument.createElementNS(
                "http://www.w3.org/2000/svg",
                "style"
            );

            style.id = "impera-selection-style";

            style.textContent = `
                path[id],
                polygon[id],
                [data-country],
                [data-iso] {
                    cursor: pointer;
                    transition: filter 0.18s ease;
                }

                path[id]:hover,
                polygon[id]:hover,
                [data-country]:hover,
                [data-iso]:hover {
                    filter: brightness(1.25);
                }

                .impera-selected-country {
                    filter:
                        brightness(1.35)
                        drop-shadow(0 0 5px #d7b35d);
                }
            `;

            svgDocument.documentElement.appendChild(style);
        }
    }

    function connectToMap() {
        if (!worldMap) return;

        worldMap.addEventListener("load", () => {
            try {
                const svgDocument = worldMap.contentDocument;

                if (!svgDocument) return;

                connectCountryElements(svgDocument);
            } catch (error) {
                console.error("Haritaya bağlanılamadı:", error);
            }
        });
    }

    function createGameScreen() {
        let gameScreen = document.getElementById("playScreen");

        if (gameScreen) {
            return gameScreen;
        }

        gameScreen = document.createElement("section");
        gameScreen.id = "playScreen";
        gameScreen.className = "play-screen hidden";

        gameScreen.innerHTML = `
            <header class="play-header">
                <div>
                    <p class="eyebrow">IMPERA REMASTERED</p>
                    <h2 id="playCountryName">Ülke</h2>
                </div>

                <button id="quitGame" type="button">
                    Ana Menü
                </button>
            </header>

            <div class="game-stats">
                <div>
                    <span>Tur</span>
                    <strong id="statTurn">1</strong>
                </div>

                <div>
                    <span>Hazine</span>
                    <strong id="statTreasury">0</strong>
                </div>

                <div>
                    <span>Tur Geliri</span>
                    <strong id="statIncome">+0</strong>
                </div>

                <div>
                    <span>Sanayi</span>
                    <strong id="statIndustry">0</strong>
                </div>

                <div>
                    <span>Ordu</span>
                    <strong id="statArmy">0</strong>
                </div>

                <div>
                    <span>İstikrar</span>
                    <strong id="statStability">0%</strong>
                </div>
            </div>

            <div class="game-actions">
                <button id="buildIndustry" type="button">
                    Sanayi Kur
                    <small>-30 hazine</small>
                </button>

                <button id="recruitArmy" type="button">
                    Asker Topla
                    <small>-20 hazine</small>
                </button>

                <button id="raiseTaxes" type="button">
                    Vergi Artır
                    <small>+25 hazine, -5 istikrar</small>
                </button>

                <button id="endTurn" type="button">
                    Turu Bitir
                </button>
            </div>

            <div id="gameLog" class="game-log">
                Oyun başladı.
            </div>
        `;

        document.body.appendChild(gameScreen);

        document
            .getElementById("quitGame")
            .addEventListener("click", () => {
                gameScreen.classList.add("hidden");
                showMenu();
            });

        document
            .getElementById("buildIndustry")
            .addEventListener("click", buildIndustry);

        document
            .getElementById("recruitArmy")
            .addEventListener("click", recruitArmy);

        document
            .getElementById("raiseTaxes")
            .addEventListener("click", raiseTaxes);

        document
            .getElementById("endTurn")
            .addEventListener("click", endTurn);

        return gameScreen;
    }

    function startGame() {
        if (!selectedCountry || !selectedCountry.supported) {
            return;
        }

        const baseData = countryData[selectedCountry.code];

        gameState = {
            countryCode: selectedCountry.code,
            countryName: baseData.name,
            turn: 1,
            treasury: baseData.treasury,
            baseIncome: baseData.income,
            industry: baseData.industry,
            army: baseData.army,
            population: baseData.population,
            stability: baseData.stability
        };

        const gameScreen = createGameScreen();

        if (worldScreen) {
            worldScreen.classList.add("hidden");
        }

        gameScreen.classList.remove("hidden");

        updateGameScreen();
        addLog(`${gameState.countryName} ile oyun başladı.`);
    }

    function calculateIncome() {
        const industryBonus = Math.floor(gameState.industry * 0.15);
        const armyMaintenance = Math.floor(gameState.army * 0.08);

        return Math.max(
            0,
            gameState.baseIncome + industryBonus - armyMaintenance
        );
    }

    function updateGameScreen() {
        if (!gameState) return;

        document.getElementById("playCountryName").textContent =
            gameState.countryName;

        document.getElementById("statTurn").textContent =
            gameState.turn;

        document.getElementById("statTreasury").textContent =
            gameState.treasury;

        document.getElementById("statIncome").textContent =
            `+${calculateIncome()}`;

        document.getElementById("statIndustry").textContent =
            gameState.industry;

        document.getElementById("statArmy").textContent =
            gameState.army;

        document.getElementById("statStability").textContent =
            `${gameState.stability}%`;
    }

    function addLog(message) {
        const gameLog = document.getElementById("gameLog");

        if (!gameLog) return;

        gameLog.textContent = message;
    }

    function buildIndustry() {
        if (!gameState) return;

        if (gameState.treasury < 30) {
            addLog("Sanayi kurmak için yeterli hazine yok.");
            return;
        }

        gameState.treasury -= 30;
        gameState.industry += 1;

        addLog("Yeni sanayi tesisi kuruldu.");
        updateGameScreen();
    }

    function recruitArmy() {
        if (!gameState) return;

        if (gameState.treasury < 20) {
            addLog("Asker toplamak için yeterli hazine yok.");
            return;
        }

        gameState.treasury -= 20;
        gameState.army += 5;

        addLog("Orduya 5 birlik eklendi.");
        updateGameScreen();
    }

    function raiseTaxes() {
        if (!gameState) return;

        if (gameState.stability <= 5) {
            addLog("İstikrar çok düşük. Vergi artırılamaz.");
            return;
        }

        gameState.treasury += 25;
        gameState.stability -= 5;

        addLog("Vergiler artırıldı. Hazine büyüdü, istikrar düştü.");
        updateGameScreen();
    }

    function endTurn() {
        if (!gameState) return;

        const income = calculateIncome();

        gameState.treasury += income;
        gameState.turn += 1;

        if (gameState.stability <= 0) {
            alert("İstikrar çöktü. Oyun sona erdi.");
            document.getElementById("playScreen").classList.add("hidden");
            showMenu();
            return;
        }

        addLog(
            `${gameState.turn}. tura geçildi. Hazineye ${income} eklendi.`
        );

        updateGameScreen();
    }

    if (newGameButton) {
        newGameButton.addEventListener("click", openModal);
    }

    if (closeModalButton) {
        closeModalButton.addEventListener("click", closeModal);
    }

    if (backToMenuButton) {
        backToMenuButton.addEventListener("click", showMenu);
    }

    if (continueButton) {
        continueButton.addEventListener("click", () => {
            alert("Henüz kayıtlı oyun bulunmuyor.");
        });
    }

    if (settingsButton) {
        settingsButton.addEventListener("click", () => {
            alert("Ayarlar ekranı ileriki sürümde eklenecek.");
        });
    }

    if (creditsButton) {
        creditsButton.addEventListener("click", () => {
            alert("IMPERA Remastered\nBilal'in strateji oyunu.");
        });
    }

    scenarioButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const scenario = button.dataset.scenario;

            if (!scenario) return;

            showWorldScreen(scenario);
        });
    });

    if (startCountryButton) {
        startCountryButton.addEventListener("click", startGame);
    }

    if (modal) {
        modal.addEventListener("click", (event) => {
            if (event.target === modal) {
                closeModal();
            }
        });
    }

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeModal();
        }
    });

    connectToMap();
    showMenu();
})();