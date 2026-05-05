const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`);
  console.error(err.stack);

  if (err.code === "ER_DUP_ENTRY") {
    return res.status(409).json({ success: false, message: "Duplicate entry. Resource already exists." });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = { errorHandler };
