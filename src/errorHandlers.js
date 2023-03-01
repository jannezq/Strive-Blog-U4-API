export const badRequestHandler = (err, req, res, next) => {
  //this is for 400 status error
  if (err.status === 400) {
    res.status(400).send({
      success: false,
      message: err.message,
    });
  } else {
    next(err);
  }
};
export const unauthorizedHandler = (err, req, res, next) => {
  //this is for 401 status error
  if (err.status === 401) {
    res.status(401).send({ success: false, message: err.message });
  } else {
    next(err);
  }
};

export const notFoundHandler = (err, req, res, next) => {
  //this is for 404 status error
  if (err.status === 404) {
    res.status(404).send({ success: false, message: err.message });
  } else {
    next(err);
  }
};

export const genericErrorHandler = (err, req, res, next) => {
  //this is for 500 status error
  console.log("ERROR:", err);
  res.status(500).send({
    success: false,
    message: "Problem occured in the server. Currently fixing the problem!",
  });
};
