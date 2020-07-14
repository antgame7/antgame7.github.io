var CoordinateParser = Coordinates,
    imageDataCache = null,
    data = null

imageData = function(images) {

    var total = images.length,
        data = [],
        i;

    if(imageDataCache) {

        for(i=0; i<total; i++) {
            data.push(new CoordinateParser(imageDataCache[i]));
        }

        return data;
    }

    imageDataCache = [];



    for(i=0; i<total; i++) {
        var image = images[i];
        var canvas = document.createElement("canvas");
        var context = canvas.getContext("2d");
        canvas.width = image.width;
        canvas.height = image.height;
        context.scale(1,-1);
        context.drawImage(image, 0, image.height * -1);
        var imageData = context.getImageData(0, 0, canvas.width, canvas.height);

        imageDataCache.push(imageData);

        data.push(new CoordinateParser(imageData));
    }

    return data;

}
