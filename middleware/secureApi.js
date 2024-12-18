function SecureApi(req, res, next) {
  if (req.headers.password == "119340") {
    next();
  } else {
    res.send({ error: "Authentication Failed" });
  }
}

module.exports = SecureApi;
