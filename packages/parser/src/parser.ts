import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import { visit } from "unist-util-visit";
import type { Recipe, RecipeSection, Ingredient } from "./types.js";

interface Node {
  type: string;
  children?: Node[];
  depth?: number;
  value?: string;
}

function parseIngredient(text: string): Ingredient {
  // Clean up the text and extract components
  const cleanText = text.trim().replace(/^-\s*/, '');
  
  // First, extract the quantity and unit from within brackets
  const quantityMatch = cleanText.match(/^\[([^[\]]+)\]/);
  if (!quantityMatch) {
    throw new Error(`Invalid ingredient format (no quantity): ${text}`);
  }
  
  const [fullQuantity, amount] = quantityMatch;
  const [quantity, unit = "unit"] = amount.trim().split(/\s+/, 2);
  
  // Remove the quantity part and parse the rest
  const remainingText = cleanText.slice(fullQuantity.length).trim();
  
  // Extract name and optional description
  const descriptionMatch = remainingText.match(/^(.*?)(?:\s*\*\((.*?)\)\*)?(?:\s*!!)?$/);
  if (!descriptionMatch) {
    throw new Error(`Invalid ingredient format (invalid name/description): ${text}`);
  }
  
  const [, name, description] = descriptionMatch;
  
  // Check if the name contains a description in parentheses
  const nameParenMatch = name.trim().match(/^(.*?)\s*\((.*?)\)$/);

  // Convert fractions to decimal if needed
  let normalizedQuantity = quantity.trim();
  const fractionMatch = normalizedQuantity.match(/^(\d+)\/(\d+)$/);
  if (fractionMatch) {
    const [, numerator, denominator] = fractionMatch;
    normalizedQuantity = (Number(numerator) / Number(denominator)).toString();
  }
  
  const result: Ingredient = {
    quantity: normalizedQuantity,
    unit: unit.trim(),
    name: nameParenMatch ? nameParenMatch[1].trim() : name.trim(),
    displayUnit: unit.trim(),
    important: text.includes("!!")
  };
  
  if (description) {
    result.description = description.trim();
  } else if (nameParenMatch) {
    result.description = nameParenMatch[2].trim();
  }
  
  return result;
}

function getNodeText(node: Node): string {
  if (!node) return "";
  
  if (node.type === "text") {
    return node.value ?? "";
  }
  if (node.type === "emphasis") {
    return `*${node.children?.map(getNodeText).join("") ?? ""}*`;
  }
  if (node.type === "strong") {
    return `**${node.children?.map(getNodeText).join("") ?? ""}**`;
  }
  if (node.type === "paragraph") {
    return node.children?.map(getNodeText).join("") ?? "";
  }
  if (node.type === "listItem") {
    return node.children?.map(getNodeText).join("") ?? "";
  }
  if (node.type === "link") {
    const url = (node as any).url ?? "";
    return `[${node.children?.map(getNodeText).join("") ?? ""}](${url})`;
  }
  if (node.type === "inlineCode") {
    return `\`${node.value ?? ""}\``;
  }
  return "";
}

function extractRecipeData(tree: Node): Recipe {
  const recipe: Recipe = {
    title: "",
    description: "",
    sections: [],
  };

  let currentSection: RecipeSection = {
    title: "Main",
    ingredients: [],
    instructions: [],
  };

  let isInDescription = false;
  let hasAddedMainSection = false;

  visit(tree, (node: Node) => {
    if (node.type === "heading" && node.depth === 1) {
      // Parse title
      recipe.title = node.children?.map(getNodeText).join("") ?? "";
      isInDescription = true;
    } else if (node.type === "paragraph" && node.children?.[0].value?.startsWith("==")) {
      // New section
      if (currentSection.ingredients.length > 0 || currentSection.instructions.length > 0) {
        recipe.sections.push({ ...currentSection });
      }
      currentSection = {
        title: node.children?.[0].value.replace(/^==\s*/, "").trim(),
        ingredients: [],
        instructions: [],
      };
      hasAddedMainSection = true;
    } else if (node.type === "paragraph" && isInDescription) {
      // Parse description
      recipe.description = node.children?.map(getNodeText).join("") ?? "";
      isInDescription = false;
    } else if (node.type === "list") {
      const items = node.children?.map(item => getNodeText(item)) ?? [];
      // Check if this is an ingredients list or instructions
      if (items[0]?.includes("[")) {
        // Ingredients
        const ingredients = items.map(item => {
          try {
            return parseIngredient(item);
          } catch (error) {
            console.error("Error parsing ingredient:", error);
            // Return a default ingredient object to prevent failures
            return {
              name: item.replace(/\[.*?\]/g, "").trim(),
              quantity: "",
              unit: "",
              displayUnit: "",
              optional: false,
              notes: ""
            };
          }
        });
        currentSection.ingredients.push(...ingredients);
      } else {
        // Instructions
        currentSection.instructions.push(...items.map(item => item.trim()));
      }
    }
  });

  // Add the last section if it has content
  if (currentSection.ingredients.length > 0 || currentSection.instructions.length > 0) {
    recipe.sections.push({ ...currentSection });
  }

  // If no sections were explicitly defined, ensure we have at least the Main section
  if (!hasAddedMainSection && recipe.sections.length === 0 && (currentSection.ingredients.length > 0 || currentSection.instructions.length > 0)) {
    recipe.sections.push({ ...currentSection });
  }

  return recipe;
}

export function parseRecipe(markdown: string): Recipe {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm);

  const tree = processor.parse(markdown);
  const recipe = extractRecipeData(tree as Node);
  return recipe;
} 

export type { Recipe, RecipeSection, Ingredient };