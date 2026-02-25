import fs from "fs";
import path from "path";

const dir = "./src";

const colorsToReplace = [
    "blue", "emerald", "purple", "orange", "red", "green", "teal", "sky", "cyan",
    "violet", "fuchsia", "pink", "rose", "indigo", "amber", "yellow"
];

// Regex to capture tailwind classes: prefix-color-number/opacity
// Example: bg-blue-500, hover:text-emerald-400, border-purple-500/20, text-red-500
// Replace with: bg-primary, hover:text-primary, border-primary/20, text-primary
const colorRegex = new RegExp(`([a-z:-]*)(bg|text|border|ring|shadow|from|to|via)-(${colorsToReplace.join("|")})-[0-9]{2,3}(/[0-9]{1,2})?`, "g");

const excludeFiles = [
    // Add any files we don't want to touch
];

function processDirectory(directory) {
    const files = fs.readdirSync(directory);

    for (const file of files) {
        const fullPath = path.join(directory, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith(".tsx") || fullPath.endsWith(".ts")) {
            if (excludeFiles.includes(path.basename(fullPath))) continue;

            let content = fs.readFileSync(fullPath, "utf-8");

            const originalContent = content;

            content = content.replace(colorRegex, (match, prefix, property, color, opacity) => {
                // e.g. prefix = "hover:", property = "bg", color = "blue", opacity = "/20"

                // Some specific exceptions: we might want to keep red for errors, green for success
                // But user requested: "Não quero cores aleatorias para os icones, detalhes, barras e silhuetas. Utilize o amarelo da logo"
                // Let's replace everything to primary to be extremely clean and sober.
                // Wait, what about red for errors/deletions or green for "100% correct"?
                // If we want it totally sober, maybe we keep semantic colors only for critical UI (like a Delete button). Let's just override everything initially as requested.

                // If it's pure background, we might replace it with primary or a muted surface color?
                // Let's replace the color part with 'primary'.
                // Wait, bg-blue-500 -> bg-primary
                // What about text-blue-500 -> text-primary
                // hover:bg-blue-600 -> hover:bg-primary-hover (we might not have -hover utility if tailwind automatically picks up primary-hover, or we just map everything to primary and let tailwind handle opacities).
                // Let's map everything to 'primary'. Tailwind v4 allows bg-primary.

                return `${prefix}${property}-primary${opacity || ""}`;
            });

            if (originalContent !== content) {
                fs.writeFileSync(fullPath, content, "utf-8");
                console.log(`Updated: ${fullPath}`);
            }
        }
    }
}

processDirectory(dir);
console.log("Color replacement complete.");
