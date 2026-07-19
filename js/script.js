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

    const countryNamesTR = {
        TR: "Türkiye",
        TUR: "Türkiye",
        Turkey: "Türkiye",
        turkey: "Türkiye",

        DE: "Almanya",
        DEU: "Almanya",
        Germany: "Almanya",
        germany: "Almanya",

        FR: "Fransa",
        FRA: "Fransa",
        France: "Fransa",
        france: "Fransa",

        GB: "Birleşik Krallık",
        GBR: "Birleşik Krallık",
        UK: "Birleşik Krallık",

        IT: "İtalya",
        ITA: "İtalya",
        Italy: "İtalya",
        italy: "İtalya",

        ES: "İspanya",
        ESP: "İspanya",
        Spain: "İspanya",
        spain: "İspanya",

        US: "Amerika Birleşik Devletleri",
        USA: "Amerika Birleşik Devletleri",

        RU: "Rusya",
        RUS: "Rusya",
        Russia: "Rusya",
        russia: "Rusya",

        CN: "Çin",
        CHN: "Çin",
        China: "Çin",
        china: "Çin",

        JP: "Japonya",
        JPN: "Japonya",
        Japan: "Japonya",
        japan: "Japonya",

        GR: "Yunanistan",
        GRC: "Yunanistan",

        IR: "İran",
        IRN: "İran",

        IQ: "Irak",
        IRQ: "Irak",

        SY: "Suriye",
        SYR: "Suriye",

        BG: "Bulgaristan",
        BGR: "Bulgaristan",

        RO: "Romanya",
        ROU: "Romanya",

        PL: "Polonya",
        POL: "Polonya",

        UA: "Ukrayna",
        UKR: "Ukrayna",

        CA: "Kanada",
        CAN: "Kanada",

        BR: "Brezilya",
        BRA: "Brezilya",

        AR: "Arjantin",
        ARG: "Arjantin",

        AU: "Avustralya",
        AUS: "Avustralya",

        IN: "Hindistan",
        IND: "Hindistan",

        EG: "Mısır",
        EGY: "Mısır",

        SA: "Suudi Arabistan",
        SAU: "Suudi Arabistan"
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

    function getTurkishCountryName(detail) {
        const possibleKeys = [
            detail.iso,
            detail.name,
            detail.id
        ];

        for (const key of possibleKeys) {
            if (!key) continue;

            if (countryNamesTR[key]) {
                return countryNamesTR[key];
            }

            const upperKey = String(key).toUpperCase();

            if (countryNamesTR[upperKey]) {
                return countryNamesTR[upperKey];
            }
        }

        return detail.name || detail.id || "Bilinmeyen Ülke";
    }

    function selectCountry(detail) {
        if (!detail) return;

        const normalizedDetail = {
            name: getTurkishCountryName(detail),
            iso:
                detail.iso ||
                detail.code ||
                detail.id ||
                "—",
            continent:
                detail.continent ||
                "Bilinmiyor",
            population:
                detail.population ||
                0,
            gdpMd:
                detail.gdpMd ||
                detail.gdp ||
                0
        };

        selectedCountry = normalizedDetail;

        if (countryName) {
            countryName.textContent =
                normalizedDetail.name;
        }

        if (countryCode) {
            countryCode.textContent =
                "Ülke seçildi. Başlamak için aşağıdaki düğmeye dokun.";
        }

        if (countryIso) {
            countryIso.textContent =
                normalizedDetail.iso;
        }

        if (countryContinent) {
            countryContinent.textContent =
                normalizedDetail.continent;
        }

        if (countryPopulation) {
            countryPopulation.textContent =
                formatPopulation(
                    normalizedDetail.population
                );
        }

        if (countryGdp) {
            countryGdp.textContent =
                formatGdp(
                    normalizedDetail.gdpMd
                );
        }

        if (startCountryButton) {
            startCountryButton.disabled = false;
        }
    }

    function createCountryDetail(country) {
        return {
            id:
                country.id ||
                "",

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
                "—",

            continent:
                country.dataset.continent ||
                "Bilinmiyor",

            population:
                country.dataset.population ||
                0,

            gdpMd:
                country.dataset.gdpMd ||
                country.dataset.gdp ||
                0
        };
    }

    function connectCountryElements(svgDocument) {
        const countries = svgDocument.querySelectorAll(
            "[data-name], [data-country], [data-iso], path[id], polygon[id], g[id]"
        );

        console.log(
            `${countries.length} harita bölgesi bulundu.`
        );

        countries.forEach((country) => {
            if (country.dataset.imperaConnected === "true") {
                return;
            }

            country.dataset.imperaConnected = "true";
            country.style.cursor = "pointer";

            country.addEventListener("click", (event) => {
                event.stopPropagation();

                const oldSelected =
                    svgDocument.querySelectorAll(
                        ".impera-selected-country"
                    );

                oldSelected.forEach((item) => {
                    item.classList.remove(
                        "impera-selected-country"
                    );
                });

                country.classList.add(
                    "impera-selected-country"
                );

                const detail =
                    createCountryDetail(country);

                selectCountry(detail);
            });
        });

        let style =
            svgDocument.getElementById(
                "impera-selection-style"
            );

        if (!style) {
            style =
                svgDocument.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "style"
                );

            style.id =
                "impera-selection-style";

            style.textContent = `
                [data-name],
                [data-country],
                [data-iso],
                path[id],
                polygon[id],
                g[id] {
                    cursor: pointer;
                    transition:
                        filter 0.18s ease,
                        opacity 0.18s ease;
                }

                [data-name]:hover,
                [data-country]:hover,
                [data-iso]:hover,
                path[id]:hover,
                polygon[id]:hover {
                    filter: brightness(1.3);
                }

                .impera-selected-country {
                    filter:
                        brightness(1.35)
                        drop-shadow(
                            0 0 5px #d7b35d
                        );
                }
            `;

            svgDocument.documentElement.appendChild(
                style
            );
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

        if (
            !message ||
            typeof message !== "object"
        ) {
            return;
        }

        const detail =
            message.detail ||
            message.country ||
            message.payload;

        if (!detail) return;

        selectCountry(detail);
    }

    function connectToMap() {
        if (!worldMap) return;

        worldMap.addEventListener("load", () => {
            try {
                const svgDocument =
                    worldMap.contentDocument;

                if (!svgDocument) {
                    console.warn(
                        "SVG belgesi bulunamadı."
                    );
                    return;
                }

                connectCountryElements(
                    svgDocument
                );

                svgDocument.addEventListener(
                    "impera-country-selected",
                    (event) => {
                        selectCountry(
                            event.detail
                        );
                    }
                );

                svgDocument.addEventListener(
                    "country-selected",
                    (event) => {
                        selectCountry(
                            event.detail
                        );
                    }
                );
            } catch (error) {
                console.error(
                    "Dünya haritasına bağlanılamadı:",
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

                alert(
                    `${selectedCountry.name} ile ${selectedScenario} senaryosu başlatılıyor.`
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