// // parameter
// var gameWidth = 800;
// var gameHeight = 480
// var v_background = 0.2;

// var game = new Phaser.Game(gameWidth, gameHeight, Phaser.AUTO);



// var GameState = {
//     preload: function(){
//         this.load.image('background', '../assets/background.jpg');
//         this.load.image('mario1', '../assets/mario_1.png');
//         this.load.image('mario2', '../assets/mario_2.png');
//     },
//     create: function(){  

//         this.background = this.game.add.tileSprite(0, 0, 640, 360, 'background');

//         this.mario1 = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'mario1');
//         this.mario1.anchor.setTo(0.5,0);
//         this.mario1.scale.setTo(0.1);

//         this.mario2 = this.game.add.sprite(20,150,'mario2');
//         this.mario2.anchor.setTo(0,0);
//         this.mario2.scale.setTo(0.1);
//     },
//     update: function(){
//         this.mario1.angle += 0.5;
//         this.background.tilePosition.x += v_background;
//     }
// };

// game.state.add('GameState', GameState);
// game.state.start('GameState');




var game = new Phaser.Game(1200, 800, Phaser.AUTO, 'test', null, true, false);

var BasicGame = function (game) { };

BasicGame.Boot = function (game) { };

var isoGroup, cursorPos, cursor;

var tileArray = [];
tileArray[0] = 'tile_green';
tileArray[1] = 'tile_yellow';
tileArray[2] = 'tile_building';
tileArray[3] = 'tile_building_low';
tileArray[4] = 'tile_building_high';
tileArray[5] = 'tile_building_tiny';

var tiles = [
    5,4,2,0,1,1,0,
    0,1,3,2,3,4,0,
    0,1,2,5,5,2,0,
    0,0,0,5,2,1,0,
    0,1,5,0,4,0,0,
    1,0,0,0,5,5,5,
    2,3,4,1,1,2,5
];

BasicGame.Boot.prototype =
{
    preload: function () {
        game.load.image('tile_green', '../assets/tile_green.png');
        game.load.image('tile_yellow', '../assets/tile_yellow.png');
        game.load.image('tile_building', '../assets/tile_building.png');
        game.load.image('tile_building_low', '../assets/tile_building_low.png');
        game.load.image('tile_building_high', '../assets/tile_building_high.png');
        game.load.image('tile_building_tiny', '../assets/tile_building_tiny.png');

        game.time.advancedTiming = true;

        // Add and enable the plug-in.
        game.plugins.add(new Phaser.Plugin.Isometric(game));

        // This is used to set a game canvas-based offset for the 0, 0, 0 isometric coordinate - by default
        // this point would be at screen coordinates 0, 0 (top left) which is usually undesirable.
        game.iso.anchor.setTo(0.5, 0.3);


    },
    create: function () {
        // Create a group for our tiles.
        isoGroup = game.add.group();

        // var tiles = [
        //     1,1,1,1,1,1,1,
        //     1,1,1,1,1,1,1,
        //     1,1,1,1,1,1,1,
        //     1,1,1,1,1,1,1,
        //     1,1,1,1,1,1,1,
        //     1,1,1,1,1,1,1,
        //     1,1,1,1,1,1,1,
        // ];
        // var size = 76;
        // var i=0;
        // for(var y=0; y<=531; y+=size){
        //     for(var x=0; x<=531; x+=size){
        //         tile = game.add.isoSprite(x, y, 0, tileArray[tiles[i]], isoGroup);
        //         tile.anchor.set(0.5, 1);
        //         tile.smoothed =false;
        //         // tile.body.moves = false;
        //         i++;
        //     }
        // }

        // Let's make a load of tiles on a grid.
        this.spawnTiles();

        // Provide a 3D position for the cursor
        cursorPos = new Phaser.Plugin.Isometric.Point3();
    },
    update: function () {
        // Update the cursor position.
        // It's important to understand that screen-to-isometric projection means you have to specify a z position manually, as this cannot be easily
        // determined from the 2D pointer position without extra trickery. By default, the z position is 0 if not set.
        game.iso.unproject(game.input.activePointer.position, cursorPos);

        // Loop through all tiles and test to see if the 3D position from above intersects with the automatically generated IsoSprite tile bounds.
        isoGroup.forEach(function (tile) {
            var inBounds = tile.isoBounds.containsXY(cursorPos.x+76, cursorPos.y+76);
            // If it does, do a little animation and tint change.
            if (!tile.selected && inBounds) {
                tile.selected = true;
                tile.tint = 0x86bfda;
                game.add.tween(tile).to({ isoZ: 8 }, 200, Phaser.Easing.Quadratic.InOut, true);
            }
            // If not, revert back to how it was.
            else if (tile.selected && !inBounds) {
                tile.selected = false;
                tile.tint = 0xffffff;
                game.add.tween(tile).to({ isoZ: 0 }, 200, Phaser.Easing.Quadratic.InOut, true);
            }
        });
    },
    render: function () {
        game.debug.text("isometric city!", 2, 36, "#ffffff");
        game.debug.text(game.time.fps || '--', 2, 14, "#a7aebe");
    },
    spawnTiles: function () {
        var tile;
        var size = 76, scale = 7;
        var i = 0;
        for (var xx = 0; xx < size*scale; xx += size) {
            for (var yy = 0; yy < size*scale; yy += size) {
                tile = game.add.isoSprite(xx, yy, 0, tileArray[tiles[i]], 0, isoGroup);
                tile.anchor.set(0.5, 1);
                i++
            }
        }
    }
};

game.state.add('Boot', BasicGame.Boot);
game.state.start('Boot');