var WORDS = [
    "word", "letter", "number", "person", "pen", "class", "people",
    "sound", "water", "side", "place", "man", "men", "woman", "women", "boy",
    "girl", "year", "day", "week", "month", "name", "sentence", "line", "air",
    "land", "home", "hand", "house", "picture", "animal", "mother", "father",
    "brother", "sister", "world", "head", "page", "country", "question",
    "answer", "school", "plant", "food", "sun", "state", "eye", "city", "tree",
    "farm", "story", "sea", "night", "day", "life", "north", "south", "east",
    "west", "child", "children", "example", "paper", "music", "river", "car",
    "foot", "feet", "book", "science", "room", "friend", "idea", "fish",
    "mountain", "horse", "watch", "color", "face", "wood", "list", "bird",
    "body", "dog", "family", "song", "door", "product", "wind", "ship", "area",
    "rock", "order", "fire", "problem", "piece", "top", "bottom", "king",
    "space"
];

var pictionary = function() {
    var socket = io();
    var canvas, context;
    var drawing = false;
    var guessBox = $('#guess input');
    var guesses = $('#guesses');

    var user = function(user) {
        if (user['drawer'] == true) {
            $('#word').css("display", "block");
        } else {
            $('#guess').css("display", "block");
            canvas.css("pointer-events", "none");
        }
    };

    var begin = function() {
        if ($('#word')) {
            var word = WORDS[Math.floor(Math.random() * WORDS.length)];
            $('#word').text('Draw this: ' + word);
        }
    };

    var onKeyDown = function(event) {
        if (event.keyCode != 13) {
            return;
        }

        socket.emit('guess', guessBox.val());
        guessBox.val('');
    };

    guessBox.on('keydown', onKeyDown);

    var guess = function(guess) {
        guesses.append('<div>' + guess + '</div>');
    };

    var draw = function(position) {
        // the beginPath method tells the context object that you are about to start drawing
        context.beginPath();
        // we tell the arc to draw an entire circle (shape of the draw object)
        context.arc(position.x, position.y,
            6, 0, 2 * Math.PI);
        // files the path in to create a solid black circle
        context.fill();
    };

    canvas = $('canvas');
    // the context object allows you to draw simple graphics to the canvas
    // documenation on context 2d: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
    context = canvas[0].getContext('2d');
    // set the height and width equal to the offset width and heigh
    // this allows the drawing to display with the correct resolutions
    canvas[0].width = canvas[0].offsetWidth;
    canvas[0].height = canvas[0].offsetHeight;

    // in lieu of mousedown/mouseup use on click event to toggle the true of drawing
    canvas.on('click', function() {
        drawing = !drawing;
    });

    canvas.on('mousemove', function (event) {
        if (drawing) {
            // find the offset of the canvas on the page
            var offset = canvas.offset();
            // subtract the offset from the event page x and y attributes
            // page attributes give the position of the mouse relative to the whole page
            // by subtracting the offset we obtain the position of the mouse relative to the top-left of the canvas
            var position = {
                x: event.pageX - offset.left,
                y: event.pageY - offset.top
            };
            // this position is passed to the draw function
            socket.emit('draw', position);
            draw(position);
        }
    });

    socket.on('guess', guess);
    socket.on('draw', draw);
    socket.on('user', user);
    socket.on('begin', begin);
};

$(document).ready(function() {
    pictionary();
});
