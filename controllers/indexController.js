class IndexController {
  openIndex = (req, res) => {
    res.render("index");
  };
}

module.exports = new IndexController();
