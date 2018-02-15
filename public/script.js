$('document').ready(function () {
    $.ajax({
        url: '/images',
        type: "GET",
        contentType: "application/json"
    }).done(function (images) {}).then(function (images) {
        images.reverse().forEach((image) => {
            var absPath = image.location;
            var pathArr = absPath.split('/');
            var relPath = pathArr[2];
            $('#image-form').append(`<img src='/images/${relPath}'></img>`);
            $('#image-form').append(`<p>${image.title}</p>`);
            $('#image-form').append(`<p>${image.description}</p>`);
            console.log(relPath);
        });
    });

    $.ajax({
        url: '/videos',
        type: "GET",
        contentType: "application/json"
    }).done(function (videos) {}).then(function (videos) {
        videos.reverse().forEach((video) => {
            var origLink = video.link;
            var correctedLink = origLink.replace("watch?v=", "embed/");
            $('#video-form').append(`<iframe src='${correctedLink}' width="420" height="315" frameborder="0" allowfullscreen></iframe>`);
            $('#video-form').append(`<p>${video.title}</p>`);
            $('#video-form').append(`<p>${video.description}</p>`);
        });
    });
});