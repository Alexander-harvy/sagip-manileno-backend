exports.healthCheck = (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "Sagip Manileño API is running",
        timestamp: new Date()
    });
};