class menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
        this.my = {sprite: {} , text: {}};
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.bitmapFont("rocketSquare", "KennyRocketSquare_0.png", "KennyRocketSquare.fnt");
        
    }

    create() {
        let my = this.my;
        my.text.title = this.add.bitmapText(400, 300, "rocketSquare", "Gallery Shooter");
        my.text.start = this.add.bitmapText(400, 350, "rocketSquare", "Space to start");
        my.text.control = this.add.bitmapText(400, 400, "rocketSquare", "P for controls");
        my.text.credit = this.add.bitmapText(400, 450, "rocketSquare", "C for credits");
        my.text.start.setScale(0.5);
        my.text.control.setScale(0.5);
        my.text.credit.setScale(0.5);
        this.gameScene = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.creditScene = this.input.keyboard.addKey("C");
        this.controlScene = this.input.keyboard.addKey("P");
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.gameScene)) {
            this.scene.start("galleryScene");
        }
        if (Phaser.Input.Keyboard.JustDown(this.creditScene)) {
            this.scene.start("creditScene");
        }
        if (Phaser.Input.Keyboard.JustDown(this.controlScene)) {
            this.scene.start("controlScene");
        }
    }
}