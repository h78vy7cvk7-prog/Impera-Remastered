// IMPERA REMASTERED

console.log("IMPERA başlatıldı.");

document.addEventListener("DOMContentLoaded", () => {

    const newGame = document.getElementById("newGame");

    if(newGame){
        newGame.addEventListener("click", () => {
            alert("Yeni Oyun yakında eklenecek!");
        });
    }

});