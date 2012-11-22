
xLib.methods.slider = function () {
    this.$('li.sub').onclick(function (e) {
        if (e.target === this || this.childNodes[0] === e.target) {
            $(this).toggleClass('open');
        }
    })
}

