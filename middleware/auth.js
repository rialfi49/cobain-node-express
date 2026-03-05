import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token tidak ada" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // const time_iat = decoded.iat; // waktu token dibuat (dalam detik)
    // const time_now = Math.floor(Date.now() / 1000); // waktu sekarang (dalam detik)
    // const time_diff = time_now - time_iat; // selisih waktu dalam detik
    // const max_age = 3; // maksimal usia token dalam 3 detik

    // if (time_diff > max_age) {
    //   return res.status(401).json({
    //     message: "Token sudah kedaluwarsa",
    //     time_iat,
    //     time_now,
    //     time_diff,
    //     max_age,
    //   });
    // }

    req.user = decoded; // simpan user ke request
    next();
  } catch (err) {
    // cek apakah token sudah kedaluwarsa
    const isTokenExpired = err.name === "TokenExpiredError";
    if (isTokenExpired) {
      return res.status(401).json({ message: "Token sudah kedaluwarsa" });
    }

    return res.status(401).json({ message: "Token tidak valid" });
  }
};

export default authMiddleware;
