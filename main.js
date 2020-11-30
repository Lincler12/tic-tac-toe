const Player = (() => {
    return {
        FIRST: 1,
        SECOND: 2,
        NONE: 0
    }
})();
const soundBoard = (() => {
    let firstTime = 0;
    let sound = false;
    song = new Audio();

    const buttonElement = document.getElementById('sound');
    const soundImg = document.getElementById('sound-img');
    buttonElement.addEventListener('click', () => {
        if (soundImg.src.indexOf('icons8-mute-24.png') > -1) {
            soundImg.src = 'icons/sound-on/icons8-sound-24.png';
            sound = true;
            if (!firstTime)
                setSong();
            firstTime++;
        } else {
            soundImg.src = 'icons/sound-off/icons8-mute-24.png';
            sound = false;
            stopSong();
        }
    });

    function setSong(theme) {
        song.volume = 0.2;
        switch (theme) {
            case 'dark': {
                song = darksideSong;
                break;
            }
            case 'light': {
                song = lightsideSong;
                break;
            }
            default: {
                song = themeSong;
            }
        }
        if (sound) {
            song.play();
        }

    }

    function stopSong() {
        song.pause();
        song.currentTime = 0;
    }
    const themeSong = document.getElementById('theme-song');
    const darksideSong = document.getElementById('darkside-audio');
    const lightsideSong = document.getElementById('lightside-audio');

    return {
        setSong,
        stopSong,
        themeSong,
        darksideSong,
        lightsideSong,
    }
})();

const modal = (() => {
    let modalElement = document.getElementById('modal');
    let winMessageElement = document.getElementById('win-message');
    let contentIcon = document.getElementById('player-icon');
    let closeModalElement = document.getElementById('close');
    let quoteElement = document.getElementById('quote');
    const bodyElement = document.querySelector('body');
    closeModalElement.addEventListener('click', () => {
        displayNo();
    })

    function displayYes(player) {
        bodyElement.style.overflow = 'hidden';
        modalElement.style.display = 'flex';
        if(player === Player.NONE){
         winMessageElement.textContent = `It's a tie! The battle continues...`   
         return;
        }
        winMessageElement.textContent = player.winMessage;
        contentIcon.src = player.icon;
        quoteElement.textContent = player.quote;
        soundBoard.stopSong();
        soundBoard.setSong(player.music);
    }

    function displayNo() {
        bodyElement.style.overflow = 'auto';
        modalElement.style.display = 'none';
        winMessageElement.textContent = '';
        quoteElement.textContent = '';
        contentIcon.src = '';
        soundBoard.stopSong();

    }

    return {
        displayYes,
        displayNo
    }
})();


const GameBoard = (() => {
    // const startUpMusic = document.getElementById('theme-song');

    const gridElement = document.getElementById("grid");
    let gameBoard = [];

    const init = function () {
        soundBoard.setSong(soundBoard.themeSong);
        let counter = 0;
        for (let i = 0; i < 9; i++) {
            const gridCell = document.createElement('div');
            const img = document.createElement('img');
            gridCell.appendChild(img);
            gridCell.id = `grid-${counter}`;
            gridCell.dataset.player = '';
            counter++;
            gameBoard.push(gridCell);
            gridElement.appendChild(gridCell);
        }

    };

    const reset = function () {
        gameBoard.forEach(cell => {
            cell.dataset.player = '';
            cell.removeChild(cell.firstChild);
            const img = document.createElement('img');
            cell.appendChild(img);
        })
    }
    return {
        gridElement: gridElement,
        gameBoard,
        init,
        reset
    };
})();


function playerFactory(name, icon, music, winMessage, quote) {
    const play = function (e) {
        if (e.target.nodeName.toLowerCase() === 'div') {
            const img = e.target.querySelector('img');
            if (img.src.length === 0) {
                img.src = icon;
                return true;
            }
        } else if (e.target.nodeName.toLowerCase() === 'img') {
            return false;
        }

    }
    return {
        play,
        name,
        icon,
        music,
        winMessage,
        quote
    }
}


const Game = (() => {
    // GameBoard.init;

    // let winner = Player.NONE;
    let turn = Player.FIRST;
    const totalRounds = 8;
    let round = 0;
    let player1 = playerFactory('player 1', 'icons/luke-skywalker/icons8-luke-skywalker-96.png', 'light', 'Rebels win! The force is strong in you!', '“You’ve failed, Your Highness. I am a Jedi, like my father before me.”');
    let player2 = playerFactory('player 2', 'icons/darth-vader/icons8-darth-vader-96.png', 'dark', 'Empire win! Unlimited power!', '“I don’t like sand. It’s coarse and rough and irritating and it gets everywhere.”');
    GameBoard.init(player1, player2, round);
    let gameBoard = GameBoard.gameBoard;

    function play(e) {
        if (round === totalRounds) {
            console.log("yay");
            modal.displayYes(Player.NONE);
        }

        switch (turn) {
            case Player.FIRST:
                if (player1.play(e)) {
                    turn = Player.SECOND;
                    e.target.dataset.player = Player.FIRST;
                    round++;
                    if (parseInt(checkWinner()) !== Player.NONE) {
                        console.log(checkWinner());

                        modal.displayYes(player1);
                    }
                }
                break;
            case Player.SECOND:
                if (player2.play(e)) {
                    turn = Player.FIRST;
                    e.target.dataset.player = Player.SECOND;
                    round++;
                    if (parseInt(checkWinner()) !== Player.NONE) {
                        console.log(checkWinner());
                        modal.displayYes(player2);
                       

                    }
                }
                break;
        }
    };

    function reset() {
        turn = Player.FIRST;
        round = 0;
        GameBoard.reset();

    }
    document.getElementById('close').addEventListener('click', reset);


    function checkWinner() {
        let winner = Player.NONE;
        for (let i = 0; i < 9; i = i + 3) {
            if (gameBoard[i].dataset.player) {
                if ((gameBoard[i].dataset.player === gameBoard[i + 1].dataset.player) && (gameBoard[i + 1].dataset.player === gameBoard[i + 2].dataset.player)) { //check rows
                    winner = gameBoard[i].dataset.player;
                    return winner;
                }
            }
        }
        for (let i = 0; i < 3; i++) {
            if (gameBoard[i].dataset.player) {
                if ((gameBoard[i].dataset.player === gameBoard[i + 3].dataset.player) && (gameBoard[i + 3].dataset.player === gameBoard[i + 6].dataset.player)) { //check cols
                    winner = gameBoard[i].dataset.player;
                    return winner;
                }
            }
        }
        if (gameBoard[0].dataset.player) {
            if ((gameBoard[0].dataset.player === gameBoard[4].dataset.player) && (gameBoard[4].dataset.player === gameBoard[8].dataset.player)) {
                winner = gameBoard[0].dataset.player;
                return winner;
            }
        }
        if (gameBoard[2].dataset.player) {
            if ((gameBoard[2].dataset.player === gameBoard[4].dataset.player) && (gameBoard[4].dataset.player === gameBoard[6].dataset.player)) {
                winner = gameBoard[2].dataset.player;
                return winner;
            }
        }

        return winner;
    }


    gameBoard.forEach(gridCell => {
        gridCell.addEventListener('click', play)
    })


})();