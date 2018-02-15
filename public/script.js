$('document').ready(function () {
    $.ajax({
        url: '/images',
        type: "GET",
        contentType: "application/json"
    }).done(function (images) {}).then(function (images) {
        images.forEach((image) => {
            var absPath = image.location;
            var pathArr = absPath.split('/');
            var relPath = pathArr[2];
            $('body').append(`<img src='/images/${relPath}'></img>`);
            $('body').append(`<p>${image.title}</p>`);
            $('body').append(`<p>${image.description}</p>`);
            console.log(relPath);
        });
    });

    $.ajax({
        url: '/videos',
        type: "GET",
        contentType: "application/json"
    }).done(function (videos) {}).then(function (videos) {
        videos.forEach((video) => {
            var origLink = video.link;
            var correctedLink = origLink.replace("watch?v=", "embed/");
            $('body').append(`<iframe src='${correctedLink}' width="420" height="315" frameborder="0" allowfullscreen></iframe>`);
            $('body').append(`<p>${video.title}</p>`);
            $('body').append(`<p>${video.description}</p>`);
        });
    });
});