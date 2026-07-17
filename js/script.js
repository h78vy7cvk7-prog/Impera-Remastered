(() => {
    "use strict";

    const newGameButton = document.getElementById("newGame");
    const continueButton = document.getElementById("continueGame");
    const settingsButton = document.getElementById("settings");
    const creditsButton = document.getElementById("credits");

    const modal = document.getElementById("gameModal");
    const closeModalButton = document.getElementById("closeModal");

    const scenarioButtons =
        document.querySelectorAll(".scenario-card");

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

    if (newGameButton) {
        newGameButton.addEventListener("click", openModal);
    }

    if (closeModalButton) {
        closeModalButton.addEventListener("click", closeModal);
    }

    if (continueButton) {
        continueButton.addEventListener("click", () => {
            alert("Henüz kayıtlı oyun bulunmuyor.");
        });
    }

    if (settingsButton) {
        settingsButton.addEventListener("click", () => {
            alert("Ayarlar ekranı yakında eklenecek.");
        });
    }

    if (creditsButton) {
        creditsButton.addEventListener("click", () => {
            alert(
                "IMPERA Remastered\nBilal'in dünya strateji projesi."
            );
        });
    }

    scenarioButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const scenario = button.dataset.scenario;

            if (scenario === "1936") {
                alert(
                    "1936: Dünya savaşın eşiğinde."
                );
            }

            if (scenario === "1914") {
                alert(
                    "1914: Büyük Savaş başlıyor."
                );
            }

            if (scenario === "modern") {
                alert(
                    "Günümüz: Yeni dünya düzeni."
                );
            }
        });
    });

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

    closeModal();
})();