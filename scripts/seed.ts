// scripts/seed.ts
import "dotenv/config";
import Event from "../database/event.model";
import { sampleEvents } from "../database/seed";
import connectDB from "../lib/mongodb";

// Function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

async function seed() {
  try {
    await connectDB();

    // Clear existing events (optional)
    console.log("🗑️  Clearing existing events...");
    await Event.deleteMany({});

    // Add slugs to sample events
    const eventsWithSlugs = sampleEvents.map((event) => ({
      ...event,
      slug: generateSlug(event.title),
    }));

    // Insert sample events
    console.log("📝 Inserting sample events...");
    const created = await Event.insertMany(eventsWithSlugs);

    console.log(`✅ Successfully seeded ${created.length} events to MongoDB`);
    console.log("📚 Events added:");
    created.forEach((event) => {
      console.log(`  - ${event.title} (${event.slug})`);
    });
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seed();
