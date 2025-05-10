class credits extends Phaser.Scene {
    constructor() {
        super("creditScene");
        this.my = {sprite: {} , text: {}};
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.bitmapFont("rocketSquare", "KennyRocketSquare_0.png", "KennyRocketSquare.fnt");
    }

    create() {
        let my = this.my;
        this.menu = this.input.keyboard.addKey("M")
        my.text.menuButton = this.add.bitmapText(350, 500, "rocketSquare", "Press M for menu")
        my.text.menuButton.setScale(0.5);
        my.text.credits = this.add.bitmapText(400, 300, "rocketSquare", "Made by Bryan Long");
        my.text.credits.setScale(0.75);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.menu)) {
            this.scene.start("menuScene");
        }
    }
}