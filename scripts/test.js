import { PrismaClient } from "../lib/generated/prisma/index.js";
const prisma = new PrismaClient();

async function main() {
  const project = await prisma.project.create({
    data: {
      name: "My First Project",
      description: "This is a test project",
      status: "Active",
      progress: 20,
      tasks: {
        create: [
          { title: "Task 1", status: "Todo", desc: "First task" },
          { title: "Task 2", status: "In Progress", desc: "Second task" },
        ],
      },
    },
    include: { tasks: true },
  });

  console.log(project);
}

main()
  .catch(console.error)
  .finally(async () => await prisma.$disconnect());
