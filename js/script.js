(() => {
    "use strict";

    const getElement = (id) => {
        return document.getElementById(id);
    };

    const menuScreen = getElement("menuScreen");
    const worldScreen = getElement("worldScreen");
    const playScreen = getElement("playScreen");

    const gameModal = getElement("gameModal");
    const worldMap = getElement("worldMap");

    const startCountryButton =
        getElement("startCountry");

    const countryData = {
        TR: {
            name: "Türkiye",
            treasury: 220,
            income: 22,
            industry: 28,
            army: 42,
            stability: 72
        },

        DE: {
            name: "Almanya",
            treasury: 900,
            income: 95,
            industry: 180,
            army: 180,
            stability: 75
        },

        FR: {
            name: "Fransa",
            treasury: 750,
            income: 80,
            industry: 145,
            army: 135,
            stability: 70
        },

        GB: {
            name: "Birleşik Krallık",
            treasury: 1000,
            income: 100,
            industry: 170,
            army: 150,
            stability: 80
        },

        IT: {
            name: "İtalya",
            treasury: 500,
            income: 55,
            industry: 90,
            army: 100,
            stability: 65
        },

        US: {
            name: "Amerika Birleşik Devletleri",
            treasury: 1200,
            income: 120,
            industry: 220,
            army: 140,
            stability: 85
        },

        RU: {
            name: "Sovyetler Birliği",
            treasury: 650,
            income: 70,
            industry: 140,
            army: 260,
            stability: 60
        },

        JP: {
            name: "Japonya",
            treasury: 600,
            income: 65,
            industry: 120,
            army: 130,
            stability: 75
        },

        CN: {
            name: "Çin",
            treasury: 300,
            income: 35,
            industry: 55,
            army: 160,
            stability: 45
        },

        ES: {
            name: "İspanya",
            treasury: 320,
            income: 38,
            industry: 62,
            army: 75,
            stability: 50
        }
    };

    const countryAliases = {
        TUR: "TR",
        TURKEY: "TR",
        TÜRKİYE: "TR",

        DEU: "DE",
        GERMANY: "DE",
        ALMANYA: "DE",

        FRA: "FR",
        FRANCE: "FR",
        FRANSA: "FR",

        GBR: "GB",
        UK: "GB",
        "UNITED KINGDOM": "GB",

        ITA: "IT",
        ITALY: "IT",
        İTALYA: "IT",

        USA: "US",
        AMERICA: "US",
        ABD: "US",

        RUS: "RU",
        RUSSIA: "RU",
        SSCB: "RU",
        "SOVIET UNION": "RU",

        JPN: "JP",
        JAPAN: "JP",
        JAPONYA: "JP",

        CHN: "CN",
        CHINA: "CN",
        ÇİN: "CN",

        ESP: "ES",
        SPAIN: "ES",
        İSPANYA: "ES"
    };

    let selectedCountryCode = null;

    let gameState = null;

    let toastTimer = null;

    function normalizeCountryCode(value) {
        if (!value) {
            return null;
        }

        const rawValue =
            String(value).trim();

        const upperValue =
            rawValue.toLocaleUpperCase("tr-TR");

        if (countryData[rawValue]) {
            return rawValue;
        }

        if (countryData[upperValue]) {
            return upperValue;
        }

        if (countryAliases[upperValue]) {
            return countryAliases[upperValue];
        }

        if (countryAliases[rawValue.toUpperCase()]) {
            return countryAliases[
                rawValue.toUpperCase()
            ];
        }

        return null;
    }

    function showOnlyScreen(activeScreen) {
        const screens = [
            menuScreen,
            worldScreen,
            playScreen
        ];

        screens.forEach((screen) => {
            const isActive =
                screen === activeScreen;

            screen.classList.toggle(
                "hidden",
                !isActive
            );

            screen.setAttribute(
                "aria-hidden",
                String(!isActive)
            );
        });
    }

    function openModal() {
        gameModal.classList.remove("hidden");

        gameModal.setAttribute(
            "aria-hidden",
            "false"
        );
    }

    function closeModal() {
        gameModal.classList.add("hidden");

        gameModal.setAttribute(
            "aria-hidden",
            "true"
        );
    }

    function showToast(message) {
        const toast =
            getElement("toast");

        toast.textContent = message;

        toast.classList.remove("hidden");

        clearTimeout(toastTimer);

        toastTimer = setTimeout(() => {
            toast.classList.add("hidden");
        }, 2600);
    }

    function resetCountryPanel() {
        selectedCountryCode = null;

        getElement("countryName").textContent =
            "Bir ülke seç";

        getElement("countryMessage").textContent =
            "Haritadaki bir ülkeye dokun.";

        const resetIds = [
            "countryIso",
            "countryTreasury",
            "countryIncome",
            "countryIndustry",
            "countryArmy",
            "countryStability"
        ];

        resetIds.forEach((id) => {
            getElement(id).textContent = "—";
        });

        startCountryButton.disabled = true;
    }

    function selectCountry(input) {
        const detail =
            input && input.detail
                ? input.detail
                : input || {};

        const possibleCode =
            detail.iso ||
            detail.code ||
            detail.id ||
            detail.name ||
            detail.country;

        const code =
            normalizeCountryCode(possibleCode);

        if (!code || !countryData[code]) {
            const shownName =
                detail.name ||
                detail.id ||
                "Bu ülke";

            getElement("countryName").textContent =
                shownName;

            getElement("countryMessage").textContent =
                "Bu ülkenin verileri henüz eklenmedi.";

            startCountryButton.disabled = true;

            return;
        }

        selectedCountryCode = code;

        const data =
            countryData[code];

        getElement("countryName").textContent =
            data.name;

        getElement("countryMessage").textContent =
            "Bu ülke oynanabilir.";

        getElement("countryIso").textContent =
            code;

        getElement("countryTreasury").textContent =
            data.treasury;

        getElement("countryIncome").textContent =
            `+${data.income}`;

        getElement("countryIndustry").textContent =
            data.industry;

        getElement("countryArmy").textContent =
            data.army;

        getElement("countryStability").textContent =
            `${data.stability}%`;

        startCountryButton.disabled = false;
    }

    function createCountryDetail(element) {
        return {
            id:
                element.id || "",

            name:
                element.dataset.name ||
                element.dataset.country ||
                element.getAttribute(
                    "aria-label"
                ) ||
                element.getAttribute("name") ||
                element.id ||
                "",

            iso:
                element.dataset.iso ||
                element.dataset.code ||
                element.getAttribute(
                    "data-id"
                ) ||
                element.id ||
                ""
        };
    }

    function connectMap() {
        if (!worldMap) {
            return;
        }

        function attachMapEvents() {
            try {
                const svgDocument =
                    worldMap.contentDocument;

                if (!svgDocument) {
                    return;
                }

                const countryElements =
                    svgDocument.querySelectorAll(
                        [
                            "[data-iso]",
                            "[data-code]",
                            "[data-country]",
                            "[data-name]",
                            "path[id]",
                            "polygon[id]",
                            "g[id]"
                        ].join(",")
                    );

                countryElements.forEach(
                    (element) => {
                        if (
                            element.dataset
                                .imperaConnected ===
                            "true"
                        ) {
                            return;
                        }

                        element.dataset
                            .imperaConnected =
                            "true";

                        element.style.cursor =
                            "pointer";

                        element.addEventListener(
                            "click",
                            (event) => {
                                event.stopPropagation();

                                svgDocument
                                    .querySelectorAll(
                                        ".impera-selected"
                                    )
                                    .forEach(
                                        (selected) => {
                                            selected
                                                .classList
                                                .remove(
                                                    "impera-selected"
                                                );
                                        }
                                    );

                                element.classList.add(
                                    "impera-selected"
                                );

                                selectCountry(
                                    createCountryDetail(
                                        element
                                    )
                                );
                            }
                        );
                    }
                );

                if (
                    !svgDocument.getElementById(
                        "impera-selection-style"
                    )
                ) {
                    const style =
                        svgDocument.createElementNS(
                            "http://www.w3.org/2000/svg",
                            "style"
                        );

                    style.id =
                        "impera-selection-style";

                    style.textContent = `
                        .impera-selected {
                            filter:
                                brightness(1.35)
                                drop-shadow(
                                    0 0 5px #efd58f
                                ) !important;
                        }
                    `;

                    svgDocument
                        .documentElement
                        .appendChild(style);
                }
            } catch (error) {
                console.error(
                    "Harita bağlantı hatası:",
                    error
                );
            }
        }

        worldMap.addEventListener(
            "load",
            attachMapEvents
        );

        setTimeout(
            attachMapEvents,
            900
        );
    }

    function calculateNetIncome() {
        if (!gameState) {
            return 0;
        }

        const industryBonus =
            Math.floor(
                gameState.industry * 0.12
            );

        const armyMaintenance =
            Math.floor(
                gameState.army * 0.06
            );

        const stabilityModifier =
            Math.floor(
                (
                    gameState.stability - 50
                ) / 10
            );

        return Math.max(
            1,
            gameState.baseIncome +
                industryBonus +
                stabilityModifier -
                armyMaintenance
        );
    }

    function renderGame() {
        if (!gameState) {
            return;
        }

        getElement(
            "playCountryName"
        ).textContent =
            gameState.name;

        getElement(
            "statTurn"
        ).textContent =
            gameState.turn;

        getElement(
            "statTreasury"
        ).textContent =
            gameState.treasury;

        getElement(
            "statIncome"
        ).textContent =
            `+${calculateNetIncome()}`;

        getElement(
            "statIndustry"
        ).textContent =
            gameState.industry;

        getElement(
            "statArmy"
        ).textContent =
            gameState.army;

        getElement(
            "statStability"
        ).textContent =
            `${gameState.stability}%`;

        const progress =
            Math.min(
                100,
                (
                    gameState.turn /
                    20
                ) * 100
            );

        getElement(
            "turnProgress"
        ).style.width =
            `${progress}%`;

        getElement(
            "objectiveText"
        ).textContent =
            `${Math.min(
                gameState.turn,
                20
            )} / 20 tur`;
    }

    function writeLog(message) {
        getElement(
            "gameLog"
        ).textContent =
            message;

        showToast(message);
    }

    function saveGame() {
        if (!gameState) {
            return;
        }

        localStorage.setItem(
            "imperaSaveV01",
            JSON.stringify(gameState)
        );
    }

    function loadGame() {
        try {
            const savedGame =
                JSON.parse(
                    localStorage.getItem(
                        "imperaSaveV01"
                    )
                );

            if (
                !savedGame ||
                !savedGame.name
            ) {
                throw new Error(
                    "Kayıt bulunamadı"
                );
            }

            gameState =
                savedGame;

            showOnlyScreen(playScreen);

            renderGame();

            writeLog(
                "Kayıtlı oyun yüklendi."
            );
        } catch (error) {
            showToast(
                "Henüz kayıtlı oyun bulunmuyor."
            );
        }
    }

    function startGame() {
        if (
            !selectedCountryCode ||
            !countryData[
                selectedCountryCode
            ]
        ) {
            showToast(
                "Önce oynanabilir bir ülke seç."
            );

            return;
        }

        const country =
            countryData[
                selectedCountryCode
            ];

        gameState = {
            code:
                selectedCountryCode,

            name:
                country.name,

            turn:
                1,

            treasury:
                country.treasury,

            baseIncome:
                country.income,

            industry:
                country.industry,

            army:
                country.army,

            stability:
                country.stability
        };

        showOnlyScreen(playScreen);

        getElement(
            "gameLog"
        ).textContent =
            `${gameState.name} ile oyun başladı.`;

        renderGame();

        saveGame();
    }

    function spendTreasury(
        amount,
        successMessage
    ) {
        if (
            gameState.treasury <
            amount
        ) {
            writeLog(
                "Bu karar için yeterli hazine yok."
            );

            return false;
        }

        gameState.treasury -=
            amount;

        writeLog(
            successMessage
        );

        return true;
    }

    function buildIndustry() {
        if (!gameState) {
            return;
        }

        const success =
            spendTreasury(
                60,
                "Yeni sanayi tesisleri kuruldu. Sanayi +3."
            );

        if (!success) {
            return;
        }

        gameState.industry += 3;

        renderGame();

        saveGame();
    }

    function recruitArmy() {
        if (!gameState) {
            return;
        }

        const success =
            spendTreasury(
                45,
                "Yeni birlikler orduya katıldı. Ordu +5."
            );

        if (!success) {
            return;
        }

        gameState.army += 5;

        renderGame();

        saveGame();
    }

    function raiseTaxes() {
        if (!gameState) {
            return;
        }

        if (
            gameState.stability <=
            6
        ) {
            writeLog(
                "İstikrar çok düşük. Vergiler daha fazla artırılamaz."
            );

            return;
        }

        gameState.treasury += 40;

        gameState.stability -= 6;

        writeLog(
            "Vergiler artırıldı. Hazine +40, istikrar -6."
        );

        renderGame();

        saveGame();
    }

    function publicInvestment() {
        if (!gameState) {
            return;
        }

        if (
            gameState.stability >=
            100
        ) {
            writeLog(
                "İstikrar zaten en yüksek seviyede."
            );

            return;
        }

        const success =
            spendTreasury(
                35,
                "Halka yatırım yapıldı. İstikrar +5."
            );

        if (!success) {
            return;
        }

        gameState.stability =
            Math.min(
                100,
                gameState.stability + 5
            );

        renderGame();

        saveGame();
    }

    function endTurn() {
        if (!gameState) {
            return;
        }

        const income =
            calculateNetIncome();

        gameState.treasury +=
            income;

        gameState.turn += 1;

        if (
            gameState.army >
            gameState.industry *
                1.25
        ) {
            gameState.stability =
                Math.max(
                    0,
                    gameState.stability - 2
                );
        } else if (
            gameState.stability < 100 &&
            gameState.turn % 3 === 0
        ) {
            gameState.stability += 1;
        }

        if (
            gameState.stability <=
            0
        ) {
            localStorage.removeItem(
                "imperaSaveV01"
            );

            alert(
                "İstikrar çöktü. Hükûmet devrildi ve oyun sona erdi."
            );

            gameState = null;

            showOnlyScreen(
                menuScreen
            );

            return;
        }

        renderGame();

        saveGame();

        if (
            gameState.turn >=
            20
        ) {
            alert(
                `Zafer! ${gameState.name} ile 20 tur boyunca yönetimde kaldın.`
            );

            return;
        }

        writeLog(
            `${gameState.turn}. tura geçildi. Hazineye ${income} gelir eklendi.`
        );
    }

    getElement(
        "newGame"
    ).addEventListener(
        "click",
        openModal
    );

    getElement(
        "closeModal"
    ).addEventListener(
        "click",
        closeModal
    );

    getElement(
        "backToMenu"
    ).addEventListener(
        "click",
        () => {
            showOnlyScreen(
                menuScreen
            );
        }
    );

    getElement(
        "quitGame"
    ).addEventListener(
        "click",
        () => {
            showOnlyScreen(
                menuScreen
            );
        }
    );

    getElement(
        "continueGame"
    ).addEventListener(
        "click",
        loadGame
    );

    getElement(
        "settings"
    ).addEventListener(
        "click",
        () => {
            showToast(
                "Ayarlar sonraki sürümde eklenecek."
            );
        }
    );

    getElement(
        "credits"
    ).addEventListener(
        "click",
        () => {
            showToast(
                "IMPERA Remastered • Bilal"
            );
        }
    );

    document
        .querySelectorAll(
            ".scenario-card[data-scenario]"
        )
        .forEach((button) => {
            button.addEventListener(
                "click",
                () => {
                    closeModal();

                    resetCountryPanel();

                    getElement(
                        "selectedScenario"
                    ).textContent =
                        "Senaryo: 1936 — Savaşın Eşiğinde";

                    showOnlyScreen(
                        worldScreen
                    );
                }
            );
        });

    startCountryButton.addEventListener(
        "click",
        startGame
    );

    getElement(
        "buildIndustry"
    ).addEventListener(
        "click",
        buildIndustry
    );

    getElement(
        "recruitArmy"
    ).addEventListener(
        "click",
        recruitArmy
    );

    getElement(
        "raiseTaxes"
    ).addEventListener(
        "click",
        raiseTaxes
    );

    getElement(
        "publicInvestment"
    ).addEventListener(
        "click",
        publicInvestment
    );

    getElement(
        "endTurn"
    ).addEventListener(
        "click",
        endTurn
    );

    gameModal.addEventListener(
        "click",
        (event) => {
            if (
                event.target ===
                gameModal
            ) {
                closeModal();
            }
        }
    );

    document.addEventListener(
        "keydown",
        (event) => {
            if (
                event.key ===
                "Escape"
            ) {
                closeModal();
            }
        }
    );

    const countryEvents = [
        "countrySelected",
        "imperaCountrySelected",
        "selectCountry"
    ];

    countryEvents.forEach(
        (eventName) => {
            window.addEventListener(
                eventName,
                selectCountry
            );

            document.addEventListener(
                eventName,
                selectCountry
            );
        }
    );

    window.selectCountry =
        selectCountry;

    connectMap();

    resetCountryPanel();

    showOnlyScreen(
        menuScreen
    );
})();