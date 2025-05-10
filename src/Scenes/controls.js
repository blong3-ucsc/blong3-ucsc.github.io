class controls extends Phaser.Scene {
    constructor() {
        super("controlScene");
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
        my.text.line1 = this.add.bitmapText(100, 300, "rocketSquare", "A and D for Movement");
        my.text.line1.setScale(0.75);
        my.text.line2 = this.add.bitmapText(100, 350, "rocketSquare", "K and L to shoot normal and special");
        my.text.line2.setScale(0.75);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.menu)) {
            this.scene.start("menuScene");
        }
    }
}