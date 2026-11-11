
export const validateRequest = (schema) => {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            const flatErrors = result.error.issues.map((issue) => issue.message);

            return res.status(400).json({ message: flatErrors.join(", ") });
        }

        // Use the parsed values, including schema transformations.
        req.body = result.data;
        next();
    };
};
