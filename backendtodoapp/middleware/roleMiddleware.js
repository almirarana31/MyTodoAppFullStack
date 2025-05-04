export const checkRole = (roles) => {
    return (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(403).json({ message: "Authentication required" });
            }

            // Allow users to access their own data
            if (req.params.id && req.params.id === req.user.id) {
                return next();
            }

            // Check role permissions for other cases
            if (!roles.includes(req.user.role)) {
                return res.status(403).json({ message: "Access denied. Insufficient permissions." });
            }

            next();
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    };
};