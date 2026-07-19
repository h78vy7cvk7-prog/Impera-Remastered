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

    const scenarioButtons =
        document.querySelectorAll(".scenario-card");

    const backToMenuButton =
        document.getElementById("backToMenu");

    const selectedScenarioText =
        document.getElementById("selectedScenario");

    const worldMap =
        document.getElementById("worldMap");

    const countryName =
        document.getElementById("countryName");

    const countryCode =
        document.getElementById("countryCode");

    const countryIso =
        document.getElementById("countryIso");

    const countryContinent =
        document.getElementById("countryContinent");

    const countryPopulation =
        document.getElementById("countryPopulation");

    const countryGdp =
        document.getElementById("countryGdp");

    const startCountryButton =
        document.getElementById("startCountry");

    let selectedScenario = null;
    let selectedCountry = null;

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
            countryCode.textContent =
                "Haritadaki ülkelere dokun.";
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

    function formatPopulation(value) {
        const number = Number(value);

        if (!Number.isFinite(number) || number <= 0) {
            return "Bilinmiyor";
        }

        return new Intl.NumberFormat("tr-TR").format(number);
    }

    function formatGdp(value) {
        const number = Number(value);

        if (!Number.isFinite(number) || number <= 0) {
            return "Bilinmiyor";
        }

        return `$${new Intl.NumberFormat("tr-TR").format(number)} milyon`;
    }

    function selectCountry(detail) {
        if (!detail || !detail.name) return;

        selectedCountry = detail;

        if (countryName) {
            countryName.textContent =
                detail.name || "Bilinmeyen Ülke";
        }

        if (countryCode) {
            countryCode.textContent =
                "Ülke seçildi. Başlamak için aşağıdaki düğmeye dokun.";
        }

        if (countryIso) {
            countryIso.textContent =
                detail.iso || "—";
        }

        if (countryContinent) {
            countryContinent.textContent =
                detail.continent || "Bilinmiyor";
        }

        if (countryPopulation) {
            countryPopulation.textContent =
                formatPopulation(detail.population);
        }

        if (countryGdp) {
            countryGdp.textContent =
                formatGdp(detail.gdpMd);
        }

        if (startCountryButton) {
            startCountryButton.disabled = false;
        }
    }

    function handleMapMessage(event) {
        if (!worldMap) return;

        const mapWindow =
            worldMap.contentWindow;

        if (
            mapWindow &&
            event.source !== mapWindow
        ) {
            return;
        }

        const message = event.data;

        if (!message || typeof message !== "object") {
            return;
        }

        if (
            message.type !== "impera-country-selected" &&
            message.type !== "country-selected"
        ) {
            return;
        }

        selectCountry(
            message.detail ||
            message.country ||
            message.payload
        );
    }

    function connectToMap() {
        if (!worldMap) return;

        worldMap.addEventListener("load", () => {
            try {
                const svgDocument =
                    worldMap.contentDocument;

                if (!svgDocument) return;

                svgDocument.addEventListener(
                    "impera-country-selected",
                    (event) => {
                        selectCountry(event.detail);
                    }
                );

                svgDocument.addEventListener(
                    "country-selected",
                    (event) => {
                        selectCountry(event.detail);
                    }
                );
            } catch (error) {
                console.warn(
                    "Harita içeriğine doğrudan erişilemedi.",
                    error
                );
            }
        });

        window.addEventListener(
            "message",
            handleMapMessage
        );
    }

    if (newGameButton) {
        newGameButton.addEventListener(
            "click",
            openModal
        );
    }

    if (closeModalButton) {
        closeModalButton.addEventListener(
            "click",
            closeModal
        );
    }

    if (backToMenuButton) {
        backToMenuButton.addEventListener(
            "click",
            showMenu
        );
    }

    if (continueButton) {
        continueButton.addEventListener(
            "click",
            () => {
                alert(
                    "Henüz kayıtlı oyun bulunmuyor."
                );
            }
        );
    }

    if (settingsButton) {
        settingsButton.addEventListener(
            "click",
            () => {
                alert(
                    "Ayarlar ekranı yakında eklenecek."
                );
            }
        );
    }

    if (creditsButton) {
        creditsButton.addEventListener(
            "click",
            () => {
                alert(
                    "IMPERA Remastered\nBilal'in dünya strateji projesi."
                );
            }
        );
    }

    scenarioButtons.forEach((button) => {
        button.addEventListener(
            "click",
            () => {
                const scenario =
                    button.dataset.scenario;

                if (!scenario) return;

                showWorldScreen(scenario);
            }
        );
    });

    if (startCountryButton) {
        startCountryButton.addEventListener(
            "click",
            () => {
                if (!selectedCountry) return;

                const country =
                    selectedCountry.name ||
                    "Seçilen ülke";

                alert(
                    `${country} ile ${selectedScenario} senaryosu başlatılıyor.`
                );
            }
        );
    }

    if (modal) {
        modal.addEventListener(
            "click",
            (event) => {
                if (event.target === modal) {
                    closeModal();
                }
            }
        );
    }

    document.addEventListener(
        "keydown",
        (event) => {
            if (event.key !== "Escape") {
                return;
            }

            if (
                modal &&
                !modal.classList.contains("hidden")
            ) {
                closeModal();
                return;
            }

            if (
                worldScreen &&
                !worldScreen.classList.contains("hidden")
            ) {
                showMenu();
            }
        }
    );

    connectToMap();
    showMenu();
})();