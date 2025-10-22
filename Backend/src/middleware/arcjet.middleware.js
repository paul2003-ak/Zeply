import { aj } from "../config/acrjet.js";


//arcjet middleware  for rate limiting and bot detection
export const arcjetMiddleware = async (req, res, next) => {
    try {
        const decision = await aj.protect(req, {
            requested: 1,
        })

        if (decision.isDenied) {
            if (decision.reason.isRateLimit()) {
                return res.status(429).json({ message: "Too Many Requests. Please try again later." });
            } else if (decision.reason.isBot()) {
                return res.status(403).json({ message: "Access Denied. Bot traffic is not allowed." });
            } else {
                return res.status(403).json({ message: "Access Denied." });
            }
        }

        //check for spoofed bots
        if (decision.results.some((result) => result.reason.isBot() && result.reason.isSpoofed())) {
            return res.status(403).json({
                error: "Spoofed bot detected. Access denied.",
                message: "Malicious bot activity detected"
            });
        }

        next();
    } catch (error) {
        console.error("Arcjet Middleware Error:", error);
        return res.status(500).json({ message: "Internal Server Error." });
        next();
    }
};