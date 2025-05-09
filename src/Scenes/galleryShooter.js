class galleryShooter extends Phaser.Scene {
    constructor () {
        super("galleryScene");

        this.my = {sprite: {} , text: {}};

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
        this.counter = 0;
        this.verticalSpacing = 60;     
        this.nextEnemyY = 80;
        this.enemyYFlag = true;
        this.goingLeft = true;
        this.basicEnemyMinFireRate = 1000;
        this.basicEnemyMaxFireRate = 1500;
        this.basicEnemyFireTime = 0;
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.atlasXML("spaceShooters", "spaceReduxSprites.png", "spaceReduxSprites.xml");
        this.load.atlasXML("airplanes", "shipSprites.png", "shipSprites.xml");
        this.load.bitmapFont("rocketSquare", "KennyRocketSquare_0.png", "KennyRocketSquare.fnt");
    }

    create() {
        let my = this.my;

        this.left = this.input.keyboard.addKey("A");
        this.right = this.input.keyboard.addKey("D");
        this.fire = this.input.keyboard.addKey("K");
        this.specialFire = this.input.keyboard.addKey("L");

        my.sprite.player = this.add.sprite(game.config.width/2, game.config.height - 40, "airplanes", "ship3.png");
        my.sprite.player.setScale(1.5);

        my.text.score = this.add.bitmapText(580, 0, "rocketSquare", "Score " + this.myScore);

        document.getElementById('description').innerHTML = "<h2>Gallery Shooter</h2><br>A: left // D: right // K: fire bullet// L: fire special bullet"
    }

    update(time, delta) {
        let my = this.my;
        this.counter++;

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

        for (let bullet of my.sprite.bullet) {
            bullet.y -= this.bulletSpeed;
        }

        for (let specialBullet of my.sprite.specialBullet) {
            specialBullet.y -= this.bulletSpeed;
        }

        // Wave 1 
        for (let spawn = 500; spawn <= 900; spawn += 100) {
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
        
        // cull bullets and enemies when destroyed
        my.sprite.bullet = my.sprite.bullet.filter((bullet) => bullet.y > - (bullet.displayHeight/2));
        my.sprite.basicEnemy = my.sprite.basicEnemy.filter((basicEnemy) => basicEnemy.y > - (basicEnemy.displayHeight/2));
        my.sprite.specialEnemy = my.sprite.specialEnemy.filter((specialEnemy) => specialEnemy.y > - (specialEnemy.displayHeight/2))
        my.sprite.specialbullet = my.sprite.specialBullet.filter((bullet) => bullet.y > - (bullet.displayHeight/2));
        
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
                    enemy.visible = false;
                    enemy.y = -100;
                    this.myScore += enemy.scorePoints;
                    this.updateScore();
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

        for (let bullet of my.sprite.basicEnemyBullet) {
            bullet.y += this.bulletSpeed * 0.5;
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
}