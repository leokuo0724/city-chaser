// 圓形進度初始
$(function(){
  Exp_circle();
})
function Exp_circle(){
 $('#portrait').each( function() {
      var num = $(this).find('span').text() * 3.6 ;
      if(num<=180){
        $(this).find('.right').css('transform',"rotate("+num+"deg)");
      }
      else{
        $(this).find('.right').css('transform',"rotate(180deg)");
        $(this).find('.left').css('transform',"rotate("+(num-180)+"deg)");
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
var Exp = $(".mask").find('span').text(Exp);
var wH = window.innerHeight;
var wW = window.innerWidth;
$('#new-building-btn').css({left:innerWidth/2-28});
var game = new Phaser.Game(wW, wH, Phaser.AUTO,'test');

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
        game.backgrond = this.game.add.tileSprite(0, 0, wW, wH, 'bg');

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

var isNewBuildingSectionShow = false;
$('#new-building-btn').click(()=>{
    if(isNewBuildingSectionShow == false){
        $('#new-building-wrapper').stop().animate({bottom:0},300);
    } else {
        $('#new-building-wrapper').stop().animate({bottom:'-100%'},300);
    }
    isNewBuildingSectionShow = !isNewBuildingSectionShow;
    Exp = Exp+10;
    $(".mask").find('span').text(Exp);
    Exp_circle();
});

$('.type-title').click(function(){
    $(this).next().children().toggleClass('active');
});

// test
// $('#new-building-wrapper').stop().animate({bottom:0},30);


game.state.add('Boot', BasicGame.Boot);
game.state.start('Boot');
