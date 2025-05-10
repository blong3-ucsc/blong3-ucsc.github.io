class galleryShooter extends Phaser.Scene {
    constructor () {
        super("galleryScene");

        this.my = {sprite: {} , text: {}};
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.atlasXML("spaceShooters", "spaceReduxSprites.png", "spaceReduxSprites.xml");
        this.load.atlasXML("airplanes", "shipSprites.png", "shipSprites.xml");
        this.load.bitmapFont("rocketSquare", "KennyRocketSquare_0.png", "KennyRocketSquare.fnt");
    }

    create() {
        let my = this.my;

        this.playerSpeed = 2.5;     
        this.bulletSpeed = 5;     
        this.baseFireRate = 175;
        this.specialFireRate = 750;
        this.nextFireTime = 0;   
        this.my.sprite.bullet = []; 
        this.my.sprite.specialBullet = [];  
        this.myScore = 0;
        this.my.sprite.basicEnemy = [];
        this.my.sprite.specialEnemy = [];
        this.my.sprite.basicEnemyBullet = [];
        this.my.sprite.specialEnemyBullet = [];
        this.counter = 0;
        this.verticalSpacing = 60;     
        this.nextEnemyY = 80;
        this.enemyYFlag = true;
        this.goingLeft = true;
        this.basicEnemyMinFireRate = 1000;
        this.basicEnemyMaxFireRate = 1500;
        this.basicEnemyFireTime = 0;
        this.lives = 3
        this.specialEnemyFireRate = 750;
        this.iFrames = 1000;
        this.playerDamaged = -Infinity;
        this.gameRunning = true;

        // Controls 
        this.left = this.input.keyboard.addKey("A");
        this.right = this.input.keyboard.addKey("D");
        this.fire = this.input.keyboard.addKey("K");
        this.specialFire = this.input.keyboard.addKey("L");
        this.restart = this.input.keyboard.addKey("R")
        this.menu = this.input.keyboard.addKey("M")

        my.sprite.player = this.add.sprite(game.config.width/2, game.config.height - 60, "airplanes", "ship3.png");
        my.sprite.player.setScale(1.5);

        my.text.score = this.add.bitmapText(500, 0, "rocketSquare", "Score " + this.myScore);
        my.text.lives = this.add.bitmapText(10, 560, "rocketSquare", "Lives: " + this.lives);

        document.getElementById('description').innerHTML = "<h2>Gallery Shooter</h2><br>A: left // D: right // K: fire bullet// L: fire special bullet"
    }

    update(time, delta) {
        let my = this.my;
        this.counter++;
        const enemiesCleared = this.my.sprite.basicEnemy.length == 0 && this.my.sprite.specialEnemy.length == 0;

        // Controls and bullet definition
        if (this.left.isDown) {
            if (my.sprite.player.x > (my.sprite.player.displayWidth/2)) {
                my.sprite.player.x -= this.playerSpeed;
            }
        }

        if (this.right.isDown) {
            if (my.sprite.player.x < (game.config.width - (my.sprite.player.displayWidth/2))) {
                my.sprite.player.x += this.playerSpeed;
            }
        }

        if (this.fire.isDown) {
            if (time > this.nextFireTime) {
                this.nextFireTime = time + this.baseFireRate;
                my.sprite.bullet.push(this.add.sprite(
                    my.sprite.player.x, my.sprite.player.y-(my.sprite.player.displayHeight/2), "spaceShooters", "laserBlue01.png")
                );
            }
        }

        if (this.specialFire.isDown) {
            if (time > this.nextFireTime) {
                this.nextFireTime = time + this.specialFireRate;
                my.sprite.specialBullet.push(this.add.sprite(
                    my.sprite.player.x, my.sprite.player.y-(my.sprite.player.displayHeight/2), "spaceShooters", "laserRed08.png")
                );
            }
        }

        if (this.gameRunning == false && Phaser.Input.Keyboard.JustDown(this.restart)) {
            this.scene.restart();
        }

        if (this.gameRunning == false && Phaser.Input.Keyboard.JustDown(this.menu)) {
            this.scene.start("menuScene");
        }

        if (this.gameRunning == true && this.counter >= 700 && enemiesCleared) {
            this.gameRunning = false;
            my.text.victoryText = this.add.bitmapText(400, 300, "rocketSquare", "You Win!")
            my.text.restartButton = this.add.bitmapText(350, 350, "rocketSquare", "Press R to restart")
            my.text.menuButton = this.add.bitmapText(350, 400, "rocketSquare", "Press M for menu")
        }

        for (let bullet of my.sprite.bullet) {
            bullet.y -= this.bulletSpeed;
        }

        for (let specialBullet of my.sprite.specialBullet) {
            specialBullet.y -= this.bulletSpeed;
        }

        if (this.gameRunning == true && this.lives <= 0) {
            this.gameRunning = false;
            my.sprite.player.y = -100
            my.text.gameOver = this.add.bitmapText(400, 300, "rocketSquare", "Game Over");
            my.text.restartButton = this.add.bitmapText(350, 350, "rocketSquare", "Press R to restart")
            my.text.menuButton = this.add.bitmapText(350, 350, "rocketSquare", "Press M for menu")
        }

        // Wave 1 
        for (let spawn = 500; spawn <= 1200; spawn += 50) {
            if (this.counter == spawn) {
                const enemy = this.add.sprite(game.config.width / 2, this.nextEnemyY, "spaceShooters", "playerShip1_orange.png");
                enemy.setScale(0.50);
                enemy.flipY = true;
                enemy.scorePoints = 100;
                my.sprite.basicEnemy.push(enemy);
                enemy.nextShotAt = time + Phaser.Math.Between(this.basicEnemyMinFireRate, this.basicEnemyMaxFireRate);
                if (this.enemyYFlag) {
                    this.nextEnemyY += this.verticalSpacing;
                    if (this.nextEnemyY >= 200) {
                        this.enemyY = 200;
                        this.enemyYFlag = false;
                    }
                } else {
                    this.nextEnemyY -= this.verticalSpacing;
                    if (this.nextEnemyY <= 80) {
                        this.enemyYFlag = true;
                    }
                }
            }
        }

        if (this.counter == 800) {
            const enemy = this.add.sprite(game.config.width / 2, this.nextEnemyY, "spaceShooters", "ufoBlue.png"); 
            enemy.flipY = true;
            enemy.scorePoints = 500;
            my.sprite.specialEnemy.push(enemy);
            enemy.nextShotAt = time + this.specialEnemyFireRate
            this.nextEnemyY = 40
            enemy.goingLeft = true;
            
        }
        
        // cull bullets and enemies when destroyed
        my.sprite.bullet = my.sprite.bullet.filter((bullet) => bullet.y > - (bullet.displayHeight/2));
        my.sprite.basicEnemy = my.sprite.basicEnemy.filter((basicEnemy) => basicEnemy.y > - (basicEnemy.displayHeight/2));
        my.sprite.specialEnemy = my.sprite.specialEnemy.filter((specialEnemy) => specialEnemy.y > - (specialEnemy.displayHeight/2))
        my.sprite.specialBullet = my.sprite.specialBullet.filter((bullet) => bullet.y > - (bullet.displayHeight/2));
        my.sprite.specialEnemyBullet = my.sprite.specialEnemyBullet.filter((bullet) => bullet.y > - (bullet.displayHeight/2));
        
        // collision detection
        for (let bullet of my.sprite.bullet) {
            for (let enemy of my.sprite.basicEnemy) {
                if (this.collides(enemy, bullet)) {
                    bullet.y = -100;
                    enemy.visible = false;
                    enemy.y = -100;
                    this.myScore += enemy.scorePoints;
                    this.updateScore();
                }
            }
            for (let enemy of my.sprite.specialEnemy) {
                if (this.collides(enemy, bullet)) {
                    bullet.y = -100;
                }
            }
        }

        for (let bullet of my.sprite.specialBullet) {
            for (let enemy of my.sprite.basicEnemy.concat(my.sprite.specialEnemy)) {
                if (this.collides(enemy, bullet)) {
                    bullet.y = -100;
                    enemy.visible = false;
                    enemy.y = -100;
                    this.myScore += enemy.scorePoints;
                    this.updateScore();
                }
            }    
        }

        for (let bullet of my.sprite.basicEnemyBullet.concat(my.sprite.specialEnemyBullet)) {
            if (this.collides(my.sprite.player, bullet)) {
                if (this.playerDamaged + this.iFrames < time) {
                    this.playerDamaged = time;
                    this.lives -= 1;
                    bullet.y = -100;
                    this.updateLives();
                } 
            }
        }

        // basic enemy definitions
        for (let enemy of my.sprite.basicEnemy) {
            if (enemy.goingLeft) {
                enemy.x -= 1;
                if (enemy.x <= (my.sprite.player.displayWidth/2 + 40)) {
                    enemy.goingLeft = false;
                }
            } else {
                enemy.x += 1;
                if (enemy.x >= (game.config.width - (my.sprite.player.displayWidth/2 + 40))) {
                    enemy.goingLeft = true;
                }
            }
            if (time > (enemy.nextShotAt || 0)) {
                my.sprite.basicEnemyBullet.push(this.add.sprite(enemy.x,enemy.y + enemy.displayHeight / 2,"spaceShooters", "laserBlue03.png"));
                enemy.nextShotAt = time + Phaser.Math.Between(this.basicEnemyMinFireRate, this.basicEnemyMaxFireRate);
            }
        }

        //special enemy definitions
        for (let enemy of my.sprite.specialEnemy) {
            if (enemy.goingLeft) {
                enemy.x -= 0.6;
                if (enemy.x <= (my.sprite.player.displayWidth/2 + 40)) {
                    enemy.goingLeft = false;
                }
            } else {
                enemy.x += 0.6;
                if (enemy.x >= (game.config.width - (my.sprite.player.displayWidth/2 + 40))) {
                    enemy.goingLeft = true;
                }
            }
            if (time > (enemy.nextShotAt || 0)) {
                my.sprite.specialEnemyBullet.push(this.add.sprite(enemy.x,enemy.y + enemy.displayHeight / 2,"spaceShooters", "laserRed01.png"));
                enemy.nextShotAt = time + this.specialEnemyFireRate;
            }
        }
            for (let bullet of my.sprite.basicEnemyBullet) {
                bullet.y += this.bulletSpeed * 0.5;
            }
            for (let bullet of my.sprite.specialEnemyBullet) {
                bullet.y += this.bulletSpeed * 0.75
            }
    }

    collides(a, b) {
        if (Math.abs(a.x - b.x) > (a.displayWidth/2 + b.displayWidth/2)) return false;
        if (Math.abs(a.y - b.y) > (a.displayHeight/2 + b.displayHeight/2)) return false;
        return true;
    }

    updateScore() {
        let my = this.my;
        my.text.score.setText("Score " + this.myScore);
    }

    updateLives() {
        let my = this.my;
        my.text.lives.setText("Lives: " + this.lives);
    }
}