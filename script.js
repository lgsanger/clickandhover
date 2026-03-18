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
});