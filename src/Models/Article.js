// class constructor
function Article(title, image, URL, price,  olderPrice) {
    this.title = title;
    this.image = image;
    this.URL = URL;
    this.price = price;
    this.olderPrice = olderPrice;
}

// export the class
module.exports = Article;