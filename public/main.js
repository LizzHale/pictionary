var pictionary = function() {
    var canvas, context;

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
    // mousemove listener
    canvas.on('mousemove', function(event) {
        // find the offset of the canvas on the page
        var offset = canvas.offset();
        // subtract the offset from the event page x and y attributes
        // page attributes give the position of the mouse relative to the whole page
        // by subtracting the offset we obtain the position of the mouse relative to the top-left of the canvas
        var position = {x: event.pageX - offset.left,
            y: event.pageY - offset.top};
        // this position is passed to the draw function
        draw(position);
    });
};

$(document).ready(function() {
    pictionary();
});