$.ajax({
    url: '/images',
    type: "GET",
    contentType: "application/json"
}).done(function (images) {}).then(function (images) {
    images.forEach((image) => {
        var absPath = image.location;
        var pathArr = absPath.split('//');
        var relPath = pathArr[2];
        $('body').append(`<img src='/images/${relPath}'></img>`);
        $('body').append(`<p>${image.title}</p>`);
        $('body').append(`<p>${image.description}</p>`);
        console.log(relPath);
    });
    console.log(images);
})