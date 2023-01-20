const verifySchema = (schema) => (req, res, next) => {
    const result = schema.validate(req.body);
    if (result.error) {
        res.status(422).json(result.error);
    }
    else {
        next();
    }
}

module.exports = verifySchema;