const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  await prisma.task.deleteMany();
  await prisma.project.deleteMany();

  const project1 = await prisma.project.create({
    data: {
      name: "E-Commerce Platform",
      description: "Build a modern e-commerce platform",
      status: "In Progress",
      startDate: "2025-01-01",
      endDate: "2025-06-30",
      progress: 45,
      budget: "$50,000",
      tasks: {
        create: [
          {
            title: "Setup Project",
            status: "Completed",
            desc: "Initialize Next.js project",
          },
          {
            title: "Build Product Catalog",
            status: "In Progress",
            desc: "Create product pages",
          },
        ],
      },
    },
  });

  const project2 = await prisma.project.create({
    data: {
      name: "Mobile App",
      description: "React Native app",
      status: "Pending",
      startDate: "2025-03-01",
      endDate: "2025-09-30",
      progress: 10,
      budget: "$75,000",
      tasks: {
        create: [
          {
            title: "Setup React Native",
            status: "In Progress",
            desc: "Initialize project",
          },
        ],
      },
    },
  });

  console.log("Seeded:", { project1, project2 });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());