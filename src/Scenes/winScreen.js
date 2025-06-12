class WinScreen extends Phaser.Scene {
    constructor() {
        super("winScreen");
    }

    preload() {
    }

    create() {
        this.map = this.add.tilemap("Title", 18, 18, 30, 20); // Load title map
        this.restartGame = this.input.keyboard.addKey("R"); // Restart game

        this.add.text(320, 300, "Level complete!", { // Main text
            fontFamily: '"Lucida Console", "Courier New", monospace',
            fontSize: 100,
            wordWrap: {
                width: 0
            }
        });

        this.add.text(320, 425, "Press R to return to title screen", { // Restart text
            fontFamily: '"Lucida Console", "Courier New", monospace',
            fontSize: 50,
            wordWrap: {
                width: 0
            }
        });
        // Add a tileset to the map
        // First parameter: name we gave the tileset in Tiled
        // Second parameter: key for the tilesheet (from this.load.image in Load.js)
        this.tileset = this.map.addTilesetImage("Pixel_Platformer", "tilemap_tiles");

        // Create a layer
        this.groundLayer = this.map.createLayer("Ground-n-Platforms", this.tileset, 0, 0);
    }

    update(){
        if (Phaser.Input.Keyboard.JustDown(this.restartGame)) { // Go back to the title screen
            this.scene.stop("winScreen");
            this.scene.start("titleScene");
        }
    }
}