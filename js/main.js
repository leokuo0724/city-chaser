// 圓形進度初始
$(function(){
  Exp_circle();
})
function Exp_circle(){
 $('#portrait').each( function() {
       
      if(Exp<=180){
        $(this).find('.right').css('transform',"rotate("+Exp+"deg)");
        $(this).find('.left').css('transform',"rotate(0deg)");
      }
      else{
        $(this).find('.right').css('transform',"rotate(180deg)");
        $(this).find('.left').css('transform',"rotate("+(Exp-180)+"deg)");
      }
    })
}
// 確認螢幕方向
// $(window).on("deviceorientation resize", function( event ) {
//     if (window.matchMedia("(orientation: landscape)").matches) {
//         $('#warning-wrapper').show();
//     }
//     if (window.matchMedia("(orientation: portrait)").matches) {
//         $('#warning-wrapper').hide();
//     }
// });:
// if(window.innerHeight > window.innerWidth){
//     $('#warning-wrapper').hide();
// }
// if(window.innerWidth > window.innerHeight){
//     $('#warning-wrapper').show();
// }
var Exp = 180;   //need DATA in server
var wH = window.innerHeight;
var wW = window.innerWidth;
$('#new-building-btn').css({left:innerWidth/2-28});
var game = new Phaser.Game(wW, wH, Phaser.AUTO,'test');
// var camera = new camera(game, 1, 0, 0, wW, wH);

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
tileArray[6] = 'tile_building_concrete';

var tiles = [
    3,4,2,0,1,1,0,
    0,1,0,2,3,4,0,
    0,1,2,1,0,1,0,
    0,0,0,3,2,1,0,
    0,1,4,0,3,0,0,
    1,0,0,0,4,2,0,
    2,3,4,1,0,2,3
];

var tileMapScale = 2; // 地圖格子幾乘幾
var mapAnchorY = 0.6 - 0.05*(tileMapScale-2); // 因應格子變多，改變初始地圖視點

BasicGame.Boot.prototype =
{
    preload: function () {
        game.load.image('bg','assets/bg.png')
        game.load.image('tile_green', 'assets/tile_green.png');
        game.load.image('tile_yellow', 'assets/tile_yellow.png');
        game.load.image('tile_building', 'assets/tile_building.png');
        game.load.image('tile_building_low', 'assets/tile_building_low.png');
        game.load.image('tile_building_high', 'assets/tile_building_high.png');
        game.load.image('tile_building_tiny', 'assets/tile_building_tiny.png');
        game.load.image('tile_building_concrete', 'assets/tile_building_concrete.png');

        game.time.advancedTiming = true;

        // Add and enable the plug-in.
        game.plugins.add(new Phaser.Plugin.Isometric(game));

        // This is used to set a game canvas-based offset for the 0, 0, 0 isometric coordinate - by default
        // this point would be at screen coordinates 0, 0 (top left) which is usually undesirable.
        game.iso.anchor.setTo(0.5, mapAnchorY);

    },
    create: function () {
        var canvasBounds = 1500; //畫面可拖拉範圍，最大值為背景(3000)

        game.world.setBounds(0,0, canvasBounds, canvasBounds);
        game.camera.x = canvasBounds/2 - wW/2;
        game.camera.y = canvasBounds/2 - wH/2;

        game.backgrond = this.game.add.tileSprite(0, 0, 3000, 3000, 'bg');

        // Create a group for our tiles.
        // isoGroup = game.add.group();

        // Let's make a load of tiles on a grid.
        this.spawnTiles();

        // Provide a 3D position for the cursor
        cursorPos = new Phaser.Plugin.Isometric.Point3();

        // 重新繪製圖面
        // $('#new-building-btn').click(()=>{
        //     tiles[3] = 6;
        //     isoGroup.destroy();
        //     this.spawnTiles();
        // });

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

        // 拉動
        if (this.game.input.activePointer.isDown) {	
            console.log(this.game.camera.x)
            console.log(this.game.camera.y)
            if (this.game.origDragPoint) {		
                // move the camera by the amount the mouse has moved since last update		
                this.game.camera.x += this.game.origDragPoint.x - this.game.input.activePointer.position.x;		
                this.game.camera.y += this.game.origDragPoint.y - this.game.input.activePointer.position.y;	}	

                // set new drag origin to current position	
                this.game.origDragPoint = this.game.input.activePointer.position.clone();
            } 
        else {	
            this.game.origDragPoint = null;
        }

    },
    render: function () {
        // game.debug.text("isometric city!", 2, 90, "#ffffff");
        // game.debug.text(game.time.fps || '--', 2, 70, "#a7aebe");
    },
    spawnTiles: function () {
        isoGroup = game.add.group();
        var tile;
        var size = 76;
        var i = 0;
        for (var xx = 0; xx < size*tileMapScale; xx += size) {
            for (var yy = 0; yy < size*tileMapScale; yy += size) {
                tile = game.add.isoSprite(xx, yy, 0, tileArray[tiles[i]], 0, isoGroup);
                tile.anchor.set(0.5, 1);
                i++;
            }
        }
    }
};

game.state.add('Boot', BasicGame.Boot);
game.state.start('Boot');


// 點開興建建築button
var isNewBuildingSectionShow = false;
$('#new-building-btn').click(()=>{
    if(isNewBuildingSectionShow == false){
        $('#new-building-wrapper').stop().animate({bottom:0},300);
    } else {
        $('#new-building-wrapper').stop().animate({bottom:'-100%'},300);
    }
    isNewBuildingSectionShow = !isNewBuildingSectionShow;
    // Update  Exp
    Exp = (Exp + 108) %360; 
    Exp_circle();
});
// test
// $('#new-building-wrapper').stop().animate({bottom:0},30);


game.state.add('Boot', BasicGame.Boot);
game.state.start('Boot');
// 點開建築list
$('.type-title').click(function(){
    $(this).next().children().toggleClass('active-bd-list');
});
