let player = JSON.parse(localStorage.getItem("playerData"));
let enemy;
let enemyEasy = [];
let enemyMedium = [];
let enemyHard = [];
let counter = 1;
let playerName = localStorage.getItem("name");
let bossState = localStorage.getItem("bossState") || "alive";
const { className: nombreClase, level: nivel, portrait: retrato } = player || "";


let screen = document.getElementById("screen");
let interface = document.getElementById("interface")
let text = document.getElementById("texto")
let nameBtn = document.getElementById("nameBtn");
let loadBtn = document.getElementById("loadBtn")
let nameImput = document.getElementById("name");

const enemiesURL = "./enemies.json";


nameBtn.addEventListener("click", () => {
    playerName = nameImput.value || "Jugador"
    classRender();
    text.innerHTML = `<div class="text-center text-light align-self-center">Para volver a la pantalla anterior reinicia la página</div>`
});
loadBtn.addEventListener("click", loadGame)

player != undefined && loadStateInterface();

function Heroclass(className, maxHealth, attack, defense, speed,) {
    this.className = className;
    this.maxHealth = maxHealth;
    this.currentHealth = maxHealth;
    this.attack = attack;
    this.defense = defense;
    this.speed = speed;
    this.level = 1
    this.experience = 0
    this.maxExperience = 100
    this.gold = 50
    this.potion = 2
    this.portrait = `./assets/img/players/${className.toLowerCase()}.png`
    this.battleImg = `./assets/img/players/${className.toLowerCase()}battle.png`
}

const clases = [
    { name: "Guerrero", imgURL: "./assets/img/players/guerrero.png", health: 22, attack: 5, defense: 3, speed: 2 },
    { name: "Monje", imgURL: "./assets/img/players/monje.png", health: 30, attack: 4, defense: 4, speed: 1 },
    { name: "Arquera", imgURL: "./assets/img/players/arquera.png", health: 14, attack: 6, defense: 1, speed: 4 }

]
const getEnemies = () => {
    fetch(`./js/enemies.json`)
        .then(res => res.json())
        .then(res => {
            enemyEasy = res.enemyEasy
            enemyMedium = res.enemyMedium
            enemyHard = res.enemyHard
        })

}
getEnemies();

const boss = {
    name: "Entrega Final", level: 20, maxHealth: 200, health: 200, attack: 20, defense: 20, speed: 20, exp: 20000, id: 1, gold: 20000, imgURL: "./assets/img/enemies/finalboss.png",
}
const backgrounds = [
    { name: "screen-fight1", imgURL: "./assets/img/backgrounds/lucha1.png", id: 1 },
    { name: "screen-fight2", imgURL: "./assets/img/backgrounds/lucha2.png", id: 2, },
    { name: "screen-fight3", imgURL: "./assets/img/backgrounds/lucha3.png", id: 3, },
    { name: "screen-fight4", imgURL: "./assets/img/backgrounds/lucha4.png", id: 4, },
    { name: "screen-fight5", imgURL: "./assets/img/backgrounds/lucha5.png", id: 5, },
    { name: "screen-fight6", imgURL: "./assets/img/backgrounds/lucha6.png", id: 6, },
    { name: "screen-fight7", imgURL: "./assets/img/backgrounds/lucha7.png", id: 7, },
    { name: "screen-fight8", imgURL: "./assets/img/backgrounds/lucha8.png", id: 8, },
    { name: "finalboss", imgURL: "./assets/img/backgrounds/boss.png", id: 9, },
]

function classRender() {
    let acumulador = `
                        <div>
                            <h3 class="text-center fs-1">Hola ${playerName}, Selecciona la clase con la que jugarás:</h3>
                        </div>
                    `;
    clases.forEach(classes => {
        acumulador += `
                         <div class="container-fluid row col classSelect d-flex">
                                           <img src="${classes.imgURL}" alt='${classes.name}' class="col img-fluid">
                                            <div class="fs-4 col d-flex justify-content-center align-items-center classStatText">
                                                            <h2 class="text-center">Clase: ${classes.name}</h2>  
                                                                <h4>Vida ${classes.health}</h4>
                                                                <h4>Ataque ${classes.attack}</h4>
                                                                <h4>Defensa ${classes.defense}</h4>
                                                                <h4>Velocidad ${classes.speed}</h4>
                                                                <input type="button" id="${classes.name.toLowerCase()}" class="btn btn-dark btn-class btn w-auto align-self-center"
                                                     value="Elegir">
                                                             
                                            </div>
                                                    
                         </div>
        `
    });

    screen.innerHTML = acumulador;
    const btnDefiner = document.querySelectorAll(".btn-class");
    btnDefiner.forEach(button => button.addEventListener("click", classSelect));

}



const classSelect = (e) => {
    let clase = (e.target.getAttribute('id'))

    const selectClass = (classSelected) => {
        if (classSelected == "guerrero") {
            player = new Heroclass("Guerrero", 22, 5, 3, 2);
            return player;
        } else if (classSelected == "monje") {
            player = new Heroclass("Monje", 30, 4, 4, 1);
            return player;
        } else if (classSelected == "arquera") {
            player = new Heroclass("Arquera", 18, 6, 1, 4);
            return player;
        } else {
        }
    }
    selectClass(clase)
    changeInterface();

    text.innerHTML = `
                            <h1 class="fs-1 container">Tu objetivo es volverte muy fuerte para enfrentar al terrible Jefe que te espera al final de esta aventura...</h1>
                            <input type="button" id="startBtn" class="container btn btn-success btn btn-start w-50 fs-2 align-self-center align-self-center" value="Jugar como ${player.className}">
                        `

    const startBtn = document.getElementById("startBtn");
    startBtn.addEventListener("click", gameStart)

}

let damageDealt = []
const playerOptions = {
    attack: function () {
        damageDealt = [];
        function playerAttack() {
            let offsetDamage = getRandomNumber(1, player.attack)
            let calcPlayerDamage = player.attack + offsetDamage - enemy.defense
            enemy.health = enemy.health - calcPlayerDamage

            damageDealt[0] = (calcPlayerDamage)
        }
        function enemyAttack() {
            let offsetDamage = getRandomNumber(1, enemy.attack)
            let calcEnemyDamage = enemy.attack + offsetDamage - player.defense
            calcEnemyDamage < 0 ? calcEnemyDamage = 0 : calcEnemyDamage
            player.currentHealth = player.currentHealth - calcEnemyDamage
            damageDealt[1] = (calcEnemyDamage)
        }

        if (player.speed >= enemy.speed) {
            playerAttack();
            screenBattle();
            if (enemy.health <= 0) {
                enemy.health = 0;
                enemyDead(enemy.name, enemy.exp, enemy.gold);

            } else {
                enemyAttack();
                screenBattle();
                if (player.currentHealth <= 0) {
                    player.currentHealth = 0
                    text.innerText = "Has muerto."
                    changeInterface();
                    gameOver();
                } else {
                    battleAnimation();
                }
            }
        } else {
            enemyAttack();
            screenBattle();
            if (player.currentHealth <= 0) {
                player.currentHealth = 0
                text.innerText = "Has muerto."
                changeInterface();
                gameOver();
            } else {
                playerAttack();
                screenBattle();
                if (enemy.health <= 0) {
                    enemy.health = 0
                    enemyDead(enemy.name, enemy.exp, enemy.gold);
                } else {
                    battleAnimation();
                }
            }
        }

    },
    heal: function () {
        if (player.potion > 0) {
            player.currentHealth = parseInt(player.currentHealth + (player.maxHealth * 0.7))
            player.currentHealth > player.maxHealth ? player.currentHealth = player.maxHealth : player.currentHealth = player.currentHealth
            player.potion--
            text.innerHTML = `<p class="fs-2">Retrocedes para tomar una poción. Te curas <span class="green-text">${parseInt(player.maxHealth * 0.7)}</span> puntos de vida.</p>`;
            screenBattle();
            changeInterface();
        } else {
            text.innerHTML = `<h1 class="fs-1 fw-bold red-text d-flex justify-content-center align-items-center animate__animated animate__flash">¡No te quedan pociones!</>`
        }

    }

}

// Función para determinar el enemigo a combatir
function combat() {
    if (player.level >= 8) {
        enemySelect(enemyHard);
    } else if (player.level >= 4 && player.level < 8) {
        enemySelect(enemyMedium);
    } else {
        enemySelect(enemyEasy);
    }
    let number = getRandomNumber(1, 8)
    bgImg = backgrounds.find(((el) => el.id == number))
    text.innerHTML = `<p class="fs-1 text-center mt-4">Lucharás contra ${enemy.name}.</br><span class="fw-bold">ELIGE UNA ACCIÓN</span></p>`
    screenBattle();
}

function rest() {
    player.currentHealth = player.maxHealth;
    changeInterface();
    saveGame();
    text.innerHTML = `<div class="d-flex flex-column justify-content-between">
                                            <p class="fs-1">Descansas en la taberna y recuperas tus energías.</p>
                                            <p class="fs-2 green-text align-self-end">(Se han guardado tus datos.)</p>
                       </div>`
}

// Funcion que selecciona un enemigo del Array correspondiente
function enemySelect(difficulty) {
    let number = getRandomNumber(1, 5)
    const enemyGet = structuredClone(difficulty)
    enemy = enemyGet.find(((el) => el.id == number));
    return enemy;

}

// Función que modifica la pantalla principal durante el combate
function screenBattle() {
    screen.innerHTML = `
    <div class="${bgImg.name} d-flex justify-content-center align-items-center gap-2 flex-column">
        <div class="container bg-fight d-flex flex-column">
                                            <img id="enemyImage" class="portrait align-self-center" src="${enemy.imgURL}">
                                            <p class="fs-2 fw-bolder align-self-center">${enemy.name}</p>
                                            <p id="enemyHP" class="fs-2 d-flex align-items-center align-self-center">Vida: <span class="fs-2 align-self-center mx-1"> ${enemy.health}/${enemy.maxHealth}</span><progress class="progress-bar enemy" value="${enemy.health}" max="${enemy.maxHealth}"></progress></p>
        </div>
        <div id="battleButtons" class="align-self-center">
            <button type="button" class="attack btn btn-fight btn-lg p-1">Atacar</button>
            <button type="button" class="potion btn btn-fight btn-lg p-1">Poción</button>
        </div>
        <div class="container-fluid bg-fight d-flex flex-column gap-1 align-items-center"> 
                                            <img id="playerImage" class="portrait align-self-center" src="${player.portrait}">
                                            <p class="fs-2 d-flex align-items-center">Vida: <span class="fs-2 align-self-center mx-1"> ${player.currentHealth}/${player.maxHealth}</span> <progress class="progress-bar" value="${player.currentHealth}" max="${player.maxHealth}"></progress></p>
        </div>
`
    const btnFight = document.querySelectorAll(".attack")
    const btnPotion = document.querySelectorAll(".potion");
    btnFight.forEach(el => el.addEventListener("click", () => {
        text.innerHTML = ``
        const el = document.createElement("p")
        el.classList.add("fs-2",)
        el.setAttribute("id", "attackText")
        text.appendChild(el)
    }));
    btnFight.forEach(el => el.addEventListener("click", playerOptions.attack));
    btnPotion.forEach(el => el.addEventListener("click", playerOptions.heal));
}

function battleAnimation() {
    screen.innerHTML = `<div class="${bgImg.name} d-flex justify-content-center align-items-center flex-column">
    <div class="container bg-fight d-flex flex-row justify-content-between py-4">
                                        <img id="enemyImage" class="align-self-center enemyBattle" src="${enemy.imgURL}">
                                        <img id="playerImage" class="align-self-end playerBattle" src="${player.battleImg}">
    `
    screen.classList.add("animate__animated", "animate__flipInX")

    let enemyImage = document.getElementById("enemyImage");
    let playerImage = document.getElementById("playerImage");

    screen.addEventListener("animationend", () => {
        enemyImage.classList.add("enemyAttack")
        playerImage.classList.add("playerAttack")
        screen.classList.remove("animate__animated", "animate__flipInX")
        if (enemy.health > 0 && player.currentHealth > 0) {
            Swal.fire({
                background: "#292b2c",
                color: "white",
                width: "900px",
                position: "bottom",
                html: `<p class="fs-1">Atacas por <strong class="red-text">${damageDealt[0]}</strong> puntos de daño. A ${enemy.name} enemigo le quedan <strong class="green-text">${enemy.health}</strong> puntos de vida</p>
            </br><p class="fs-1">${enemy.name} te ataca por <strong class="red-text">${damageDealt[1]}</strong> puntos de daño. Te quedan <strong class="green-text">${player.currentHealth}</strong> puntos de vida</p>`,
                confirmButtonColor: '#7f00c9',
                confirmButtonText: 'Continuar',
                backdrop: false,
            }).then((result) => {
                if (result.isConfirmed) {
                    screenBattle();
                    texto.innerHTML = `<p class="fs-2">Atacaste por <span class="red-text fs-2">${damageDealt[0]}</span> puntos de daño. A ${enemy.name} enemigo le quedan <strong class="green-text">${enemy.health}</strong> puntos de vida</p>
                                        <p class="fs-2">${enemy.name} te atacó por <span class="red-text fs-2">${damageDealt[1]}</span> puntos de daño. Te quedan <strong class="green-text">${player.currentHealth}</strong> puntos de vida</p>
                                        `
                    changeInterface();
                }
            })
        }
    })


}

function gameStart() {
    screenTown();
    text.innerHTML = `<p class="fs-2">Te despiertas en la taberna del pueblo. Recuerdas vagamente que aceptaste derrotar al terrible monstruo que aterroriza a los habitantes.
                        Para ello deberás entrenar o no tendrás oportunidad alguna.</p>
                      
                    `
}

// Función que lleva al pueblo
function screenTown() {
    const bossFight = `<h1 class="fs-1 text-center">¿Te sientes preparado/a para enfrentar al enemigo más poderoso?<h1/>
    <button type="button" id="bossFight" class="btn btn-town btn-lg p-3">Hora de salvar al pueblo</button>`

    screen.innerHTML = `
    <div class="screen-village d-flex flex-column gap-3 justify-content-center align-items-center">
        <h1 class="fs-1 text-center">Elige una opción...</h1>
        <button type="button" id="fight" class="btn btn-town btn-lg p-2">Salir a luchar</button>
        <button type="button" id="tavern" class="btn btn-town btn-lg p-2">Ir a la taberna</button>
        ${player.level >= 12 && bossState == "alive" ? bossFight : ""}
    </div>
`
    let btnDefinerFight = document.getElementById("fight");
    let btnDefinerTavern = document.getElementById("tavern");
    btnDefinerFight.addEventListener("click", combat);
    btnDefinerTavern.addEventListener("click", tavern);
    if (bossState == "alive" && player.level > 11) {
        let btnDefinerBoss = document.getElementById("bossFight");
        btnDefinerBoss.addEventListener("click", () => {
            enemy = boss;
            bgImg = backgrounds.find(((el) => el.name == "finalboss"))
            screenBattle();
            text.innerHTML = `<h1 class="fs-1 fw-bold red-text d-flex justify-content-center align-items-center animate__animated animate__flash">¡PREPARATE! te enfrentas al enemigo más temido</>`
        })
    } else {
        return
    };
}

function tavern() {
    screen.innerHTML = `
    <div class="screen-tavern d-flex flex-column gap-3 justify-content-center align-items-center animate__animated animate__fadeIn">
        <h1 class="fs-1 text-center">En la taberna puedes recuperar tus fuerzas o comprar pociones para el combate.</h1>
        <button type="button" id="rest" class="btn btn-tavern btn-lg p-1">Descansar</button>
        <button type="button" id="buyPotionMenu" class="btn btn-tavern btn-lg p-1">Comprar Pociones</button>
        <button type="button" id="village" class="btn btn-town btn-lg w-auto my-5">Volver al Pueblo</button>
    </div>
    `
    text.innerHTML = `<p class="fs-1">Ingresas a la taberna. ${bossState == "dead" ? "</br>Las personas te reciben con aplausos y ovaciones." : ""}</p>`
    let btnDefinerSleep = document.getElementById("rest");
    let btnDefinerPotion = document.getElementById("buyPotionMenu");
    let btnDefinerVillage = document.getElementById("village");
    btnDefinerSleep.addEventListener("click", rest);
    btnDefinerPotion.addEventListener("click", potionBuyMenu);
    btnDefinerVillage.addEventListener("click", () => {
        screenTown();
        text.innerHTML = `<p class="fs-1">Sales de la taberna hacia el centro del pueblo.</p>`
    });
}

function potionBuyMenu() {
    const renderPotionScreen = () => {
        potionScreen.innerHTML = `  <div class="fs-1 text-center">¿Cuántas pociones deseas comprar?<div class="fs-1 text-center">
                                                                    Cada poción cuesta <span class="gold-text">50</span> de oro</div>
                                    </div>                                    
                                    <div class="d-flex gap-4">                                    
                                        <button type="button" id="minusPotion" class="btn btn-minuspotion"></button>
                                        <div id="counter" class="fs-2 text-center green-text">${counter}</div>
                                        <button type="button" id="plusPotion" class="btn btn-pluspotion"></button>
                                     </div>
                                    <button type="button" id="buyPotion" class="btn btn-tavern">Comprar</button>
                                    <button type="button" id="goBack" class="btn btn-town">Volver atrás</button>
                                 `};
    const potionScreen = document.createElement("div");
    potionScreen.classList.add("potionScreen", "d-flex", "flex-column", "justify-content-center", "align-items-center", "gap-3")
    screen.appendChild(potionScreen);



    const closePotionMenu = () => {
        screen.removeChild(screen.lastChild)
    };
    const potionHandler = (action) => {
        if (action == "substraction") {
            if (counter > 1) {
                counter--
            }

        } else if (action == "addition") {
            if (counter >= 1) {
                counter++
            }

        }
        document.getElementById("counter").innerHTML = `<div id="counter" class="fs-2 text-center green-text">${counter}</div>`
    }
    renderPotionScreen();
    document.getElementById("minusPotion").addEventListener("click", () => potionHandler("substraction"));
    document.getElementById("plusPotion").addEventListener("click", () => potionHandler("addition"));
    document.getElementById("goBack").addEventListener("click", closePotionMenu);

    const buyPotions = () => {
        let potionCost = counter * 50
        if (potionCost <= player.gold) {
            player.potion += counter;
            player.gold -= potionCost;
            changeInterface();
            text.innerHTML = `<h1 class="fs-1 fw-bold d-flex justify-content-center align-items-center gap-3">¡Has comprado <span class="green-text fs-1"> ${counter}</span> ${counter < 2 ? "poción" : "pociones"}!</>`
            counter = 1
            document.getElementById("counter").innerHTML = `<div id="counter" class="fs-2 text-center green-text">${counter}</div>`
            saveGame();
        } else {
            text.innerHTML = `<h1 class="fs-1 fw-bold red-text d-flex justify-content-center align-items-center animate__animated animate__flash">¡No tienes oro suficiente!</>`
        }
    };
    const btnPotion = document.getElementById("buyPotion")
    btnPotion.addEventListener("click", buyPotions)


}

function changeInterface() {
    interface.innerHTML = `
    <div class="d-flex flex-column">
                                    <div class="text-center">
                                                                            <img class="portrait" src="${player.portrait}">
                                                                            <h2 class="fs-3">${playerName}</h2>
                                                                            <h2 class="fs-3 col">Nivel: ${player.level}</h2>                                                                            
                                    </div>
                                    <div>
                                                    <p class="fs-3">Vida : <progress class="progress-bar" value="${player.currentHealth}" max="${player.maxHealth}"></progress></p>
                                                    <p class="fs-3">Exp. : <progress class="progress-bar experience" value="${player.experience}" max="${player.maxExperience}"></progress> </p>
                                                    <p class="fs-3">Ataque : ${player.attack} </p>
                                                    <p class="fs-3">Defensa : ${player.defense} </p>
                                                    <p class="fs-3">Velocidad : ${player.speed} </p>
                                                    <div class="fs-3"><img src="./assets/img/players/moneda.png">: <span class="gold-text">${player.gold}</span></div>
                                                    <div class="fs-3"><img src="./assets/img/players/pocion.png">: <span class="red-text fs-2">${player.potion}</span></div>
                                    </div>
    </div>
    `
}

function enemyDead(enemyName, enemyExp, enemyGold) {
    if (enemyName == "Entrega Final") {
        screen.innerHTML = `
                            <div class="screen-victory d-flex flex-column gap-3 justify-content-center align-items-center">
                            <h1 class="fs-1 text-center text-shadow">¡Has librado al pueblo del mal que lo oprimía!</br>Te conviertes en una leyenda entre los aldeanos.</h1>
                            </div>     
                            `;
        text.innerHTML = `<div class="d-flex flex-wrap text-center">
                            <p class="fs-2 mx-3">¡Has llegado al final del juego, Muchas gracias por tomarte este tiempo para jugarlo!</br>Puedes volver a cargar la partida y seguir subiendo de nivel.</p>
                            <button type="button" id="restartGame" class="btn btn-lvlup m-1 text-shadow">Volver a jugar</button>
                         </div>`;
        bossState = "dead"
        localStorage.setItem("bossState", "dead")
        document.getElementById("restartGame").addEventListener("click", () => {
            screenTown();
            text.innerHTML = ``
        })

    } else {
        const enemyHP = document.getElementById("enemyHP")
        const battleButtons = document.getElementById("battleButtons")
        const enemyImage = document.getElementById("enemyImage")
        enemyImage.classList.add("animate__animated", "animate__flipOutX")
        enemyHP.remove();
        battleButtons.remove();
        player.experience += enemyExp;
        player.gold += enemy.gold;
        enemyImage.addEventListener("animationend", () => {
            enemyImage.classList.remove("animate__animated", "animate__flipOutX")
            enemyImage.remove()
            if (player.experience >= player.maxExperience) {
                levelUp();
                changeInterface();
            } else {
                Swal.fire({
                    background: "#292b2c",
                    color: "white",
                    width: "900px",
                    position: "center",
                    html: `<p class="fs-1">${enemyName} ha muerto! Obtienes <span class="fs-1 exp-text">${enemyExp}</span> puntos de experiencia y <span class="fs-1 gold-text">${enemyGold}</span> de oro.</p>`,
                    confirmButtonColor: '#7f00c9',
                    confirmButtonText: 'Volver al pueblo',
                    backdrop: false,
                }).then((result) => {
                    if (result.isConfirmed) {
                        screenTown();
                        text.innerHTML = `<div class="d-flex flex-column justify-content-between">
                                            <p class="fs-2">Obtuviste <span class="fs-1 exp-text">${enemyExp}</span> puntos de experiencia y <span class="fs-1 gold-text">${enemyGold}</span> de oro.</p>
                                            <p class="fs-2 green-text align-self-end">(Se han guardado tus datos.)</p>
                                        </div>`
                    }
                })
                changeInterface();
            }
        })
        saveGame();
    }
}

function gameOver() {
    screen.innerHTML = `<div class="screen-dead d-flex flex-column justify-content-center align-items-center">
        <h1 class="text-center">Has muerto...</h1>
        <button type="submit" id="dead" class="btn-dead">Reiniciar</button>
    </div>`;
    const btnDead = document.getElementById("dead");
    btnDead.addEventListener("click", () => location.reload());
}

function levelUp() {
    text.innerHTML = `<h1 class="fs-1 text-center align-self-center justify-self-center">¡Has subido de nivel!</h1>`
    if (player.className == "Guerrero") {
        player.level++
        player.maxHealth = (player.maxHealth + 5)
        player.currentHealth = player.maxHealth
        player.attack = (player.attack + 2)
        player.defense = (player.defense + 1)
        player.speed = (player.speed + 1)
        player.experience = 0
        player.maxExperience = (player.maxExperience * 1.3)
        screen.innerHTML = `
        <div class="d-flex flex-column justify-content-center align-items-center screen-level text-shadow">
            <div class="level-up">
                <h1 class="fs-1 fw-bold text-shadow green-text">¡¡¡Subes de nivel!!!</h1>
                <h2 class="fs-1 text-shadow">Vida: ${(player.maxHealth - 4)} <strong class="green-text">>>>> ${player.maxHealth}</strong></h2>
                <h2 class="fs-1 text-shadow">Ataque: ${(player.attack - 2)} <strong class="green-text">>>>> ${player.attack}</strong></h2>
                <h2 class="fs-1 text-shadow">Defensa: ${(player.defense - 1)} <strong class="green-text">>>>> ${player.defense}</strong></h2>
                <h2 class="fs-1 text-shadow">Velocidad: ${(player.speed) - 1} <strong class="green-text">>>>> ${player.speed}</strong></h2>
                <button type="button" id="levelUp" class="btn btn-lvlup btn-lg p-1 text-shadow">Continuar</button>
            </div>
        </div>
`

    } else if (player.className == "Monje") {
        player.level++
        player.maxHealth = (player.maxHealth + 6)
        player.currentHealth = player.maxHealth
        player.attack = (player.attack + 1)
        player.defense = (player.defense + 2)
        player.speed = (player.speed + 1)
        player.experience = 0
        player.maxExperience = (player.maxExperience * 1.3)
        screen.innerHTML = `
        <div class="d-flex flex-column justify-content-center align-items-center screen-level text-shadow">
            <div class="level-up">
                <h1 class="fs-1 fw-bold text-shadow green-text">¡¡¡Subes de nivel!!!</h1>
                <h2 class="fs-1 text-shadow">Vida: ${(player.maxHealth - 6)} <strong class="green-text">>>>> ${player.maxHealth}</strong></h2>
                <h2 class="fs-1 text-shadow">Ataque: ${(player.attack - 1)} <strong class="green-text">>>>> ${player.attack}</strong></h2>
                <h2 class="fs-1 text-shadow">Defensa: ${(player.defense - 2)} <strong class="green-text">>>>> ${player.defense}</strong></h2>
                <h2 class="fs-1 text-shadow">Velocidad: ${(player.speed) - 1} <strong class="green-text">>>>> ${player.speed}</strong></h2>
                <button type="button" id="levelUp" class="btn btn-lvlup btn-lg p-1 text-shadow">Continuar</button>
            </div>
        </div>
`
    } else {
        player.level++
        player.maxHealth = (player.maxHealth + 4)
        player.currentHealth = player.maxHealth
        player.attack = (player.attack + 2)
        player.defense = (player.defense + 1)
        player.speed = (player.speed + 2)
        player.experience = 0
        player.maxExperience = (player.maxExperience * 1.3)
        screen.innerHTML = `
        <div class="d-flex flex-column justify-content-center align-items-center screen-level text-shadow">
            <div class="level-up">
                <h1 class="fs-1 fw-bold text-shadow green-text">¡¡¡Subes de nivel!!!</h1>
                <h2 class="fs-1 text-shadow">Vida: ${(player.maxHealth - 3)} <strong class="green-text">>>>> ${player.maxHealth}</strong></h2>
                <h2 class="fs-1 text-shadow">Ataque: ${(player.attack - 2)} <strong class="green-text">>>>> ${player.attack}</strong></h2>
                <h2 class="fs-1 text-shadow">Defensa: ${(player.defense - 1)} <strong class="green-text">>>>> ${player.defense}</strong></h2>
                <h2 class="fs-1 text-shadow">Velocidad: ${(player.speed) - 2} <strong class="green-text">>>>> ${player.speed}</strong></h2>
                <button type="button" id="levelUp" class="btn btn-lvlup btn-lg p-1 text-shadow">Continuar</button>
            </div>
        </div>
`
    }
    let btnLvlUp = document.getElementById("levelUp");
    btnLvlUp.addEventListener("click", screenTown);
    btnLvlUp.addEventListener("click", () => text.innerHTML = ``);
}

//Función para guardar la partida

function saveGame() {
    localStorage.setItem("name", `${playerName}`);
    localStorage.setItem("playerData", JSON.stringify(player));
    localStorage.setItem("bossState", bossState)
}
// Función para cargar los datos guardados
function loadGame() {
    if (player == undefined) {
        const loadScreen = document.getElementById("loadScreen")
        loadScreen.classList.add("text-center")
        loadScreen.innerHTML = `<h1 class="m-5">Lo siento, no se encontraron datos guardados</h1>`

    } else {
        playerName = localStorage.getItem("name")
        player = JSON.parse(localStorage.getItem("playerData"));
        bossState = localStorage.getItem("bossState")
        changeInterface();
        screenTown();
        text.innerHTML = `<h1 class="fs-1 text-center align-self-center">Partida cargada. Hola de nuevo ${playerName}. ${bossState == "dead" ? "</br>El mal que acechaba estas tierras ya está muerto." : ""}</h1>`
    }

}
function loadStateInterface() {
    interface.innerHTML = `
                            <div class= "d-flex flex-column text-center justify-content-center">
                                    <div class"d-flex flex-column">
                                                                            <h1 class="fs-1">${playerName} ${bossState == "dead" ? "<strong class='gold-text'>*</strong>" : ""}</h1>                                    
                                                                            <img class="portrait" src="${retrato}">
                                                                            <h2 class="fs-3">${nombreClase}</h2>
                                                                            <h2 class="fs-3">Nivel: ${nivel}</h2>
                                                                            <h2 class="fs-2 text-success">TU PERSONAJE GUARDADO</h2>

                                    </div>                                                                            
                            </div>`

}


// Función para recibir un número entero aleatorio
function getRandomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}
