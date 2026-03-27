export default {
    datasources: {
        db: {
            kind: "sqlite",
            url: process.env.DATABASE_URL || "file:./prisma/dev.db",
        },
    },
};
