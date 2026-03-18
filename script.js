$(document).ready(function(){
    $("#button").click(function(){
        $("#container").hide();
    });

    // Add hover jiggle to the home page number tiles only.
    if ($("body.home").length) {
        var $tiles = $("#container .link");

        function jiggle($el) {
            // Stop any in-progress animation so repeated hovers don't stack.
            $el.stop(true, true);

            // Ensure starting position.
            $el.css({ top: 0, left: 0 });

            // More dramatic jiggle: larger offsets + quicker timing.
            $el.animate({ top: -20, left: 12 }, 55)
               .animate({ top: -6, left: -14 }, 55)
               .animate({ top: -18, left: 10 }, 55)
               .animate({ top: -4, left: -8 }, 55)
               .animate({ top: -12, left: 6 }, 55)
               .animate({ top: 0, left: 0 }, 95);
        }

        $tiles.hover(
            function () { // mouseenter
                jiggle($(this));
            },
            function () { // mouseleave
                $(this).stop(true, true).animate({ left: 0, top: 0 }, 85);
            }
        );
    }

    // Randomly tile the provided star image across page 1.
    if ($("body.page1").length) {
        // page1.html lives in `sub-pages/`, so assets are one level up from the URL.
        // (Using the CSS-relative path here would fail because JS-relative paths resolve from the HTML page URL.)
        var STAR_TILE_URL = "../assets/star-tile.png";
        var TILE_PROBABILITY = 0.65; // how full the page feels
        var BASE_TILE_SIZE = 140; // px (will be scaled a bit per tile)
        var fadeTimer = null;

        function clearPage1Tiles($layer) {
            $layer.find(".page1-tile").remove();
        }

        function startRandomFades($layer) {
            // Avoid multiple intervals stacking after resize.
            if (fadeTimer) {
                clearInterval(fadeTimer);
                fadeTimer = null;
            }

            fadeTimer = setInterval(function () {
                var $tiles = $layer.find(".page1-tile");
                if (!$tiles.length) return;

                // Randomly pick a few tiles to change state.
                var changes = 2 + Math.floor(Math.random() * 4); // 2..5
                for (var i = 0; i < changes; i++) {
                    var idx = Math.floor(Math.random() * $tiles.length);
                    var $t = $tiles.eq(idx);

                    var baseOpacity = parseFloat($t.data("baseOpacity")) || 0.8;
                    var currentOpacity = parseFloat($t.css("opacity")) || 0;

                    // If it's already visible, fade out; otherwise fade back in.
                    var fadingOut = currentOpacity > Math.max(0.12, baseOpacity * 0.25);

                    $t.stop(true, true);
                    if (fadingOut) {
                        $t.fadeTo(220 + Math.floor(Math.random() * 160), 0);
                    } else {
                        $t.fadeTo(360 + Math.floor(Math.random() * 220), baseOpacity);
                    }
                }
            }, 650);
        }

        function renderPage1Tiles() {
            var $body = $("body.page1");

            var $layer = $("#page1-tile-layer");
            if ($layer.length === 0) {
                $layer = $("<div/>", { id: "page1-tile-layer", "class": "page1-tile-layer" });
                $body.append($layer);
            }

            clearPage1Tiles($layer);

            var width = window.innerWidth;
            var height = window.innerHeight;

            // Add a small margin so edges still get filled after rotation.
            var pad = BASE_TILE_SIZE;

            // Create tiles on a grid with random placement/rotation/scale inside each cell.
            for (var x = -pad; x < width + pad; x += BASE_TILE_SIZE) {
                for (var y = -pad; y < height + pad; y += BASE_TILE_SIZE) {
                    if (Math.random() > TILE_PROBABILITY) continue;

                    var scale = 0.6 + Math.random() * 0.75; // 0.6..1.35
                    var size = Math.floor(BASE_TILE_SIZE * scale);
                    var dx = Math.random() * (BASE_TILE_SIZE * 0.55) - (BASE_TILE_SIZE * 0.2);
                    var dy = Math.random() * (BASE_TILE_SIZE * 0.55) - (BASE_TILE_SIZE * 0.2);
                    var rot = -18 + Math.random() * 36; // -18..18
                    var opacityBase = 0.55 + Math.random() * 0.45;

                    var left = x + dx;
                    var top = y + dy;

                    $("<div/>")
                        .addClass("page1-tile")
                        .data("baseOpacity", opacityBase)
                        .css({
                            left: left + "px",
                            top: top + "px",
                            width: size + "px",
                            height: size + "px",
                            backgroundImage: "url(" + STAR_TILE_URL + ")",
                            transform: "rotate(" + rot + "deg)",
                            opacity: 0
                        })
                        .appendTo($layer);
                }
            }

            // Fade tiles in initially so you get a subtle "twinkle" as they appear.
            $layer.find(".page1-tile").each(function () {
                var $t = $(this);
                var baseOpacity = parseFloat($t.data("baseOpacity")) || 0.8;
                var delay = Math.random() * 650;
                var dur = 420 + Math.random() * 420;
                $t.css({ opacity: 0 });
                $t.delay(delay).fadeTo(dur, baseOpacity);
            });

            startRandomFades($layer);
        }

        // Initial render + re-render on resize.
        renderPage1Tiles();
        $(window).on("resize.page1Tiles", function () {
            renderPage1Tiles();
        });
    }
});