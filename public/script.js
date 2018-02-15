$.ajax({
    url: '/images',
    type: "GET",
    contentType: "application/json"
}).done(function (images) {}).then(function (images) {

    images.forEach((e) => {
        $('body').append(`<img src='${e.location}'></img>`)
    });
    console.log(images);
})