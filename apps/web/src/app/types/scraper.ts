export interface ScrapedRecipie {
    author: string;
    canonical_url: string;
    category: string;
    cook_time: number;
    cuisine: string;
    description: string;
    host: string;
    image: string;
    ingredient_groups: IngredientGroup[];
    ingredients: string[];
    instructions: string;
    instructions_list: string[];
    language: string;
    nutrients: Nutrients;
    prep_time: number;
    site_name: string;
    title: string;
    total_time: number;
    yields: string;
}

export interface IngredientGroup {
    ingredients: string[];
    purpose: null;
}

export interface Nutrients {
    calories: string;
    carbohydrateContent: string;
    cholesterolContent: string;
    fatContent: string;
    fiberContent: string;
    proteinContent: string;
    saturatedFatContent: string;
    sodiumContent: string;
    sugarContent: string;
    unsaturatedFatContent: string;
}

export function toRecipeMarkdown(scrapedRecipe: ScrapedRecipie): string {
    return `---
short-description: ${scrapedRecipe.description}
yields: ${scrapedRecipe.yields}
cuisine: ${scrapedRecipe.cuisine}
---

# ${scrapedRecipe.title}

${scrapedRecipe.description}

${scrapedRecipe.ingredient_groups.map(group => `== ${group.purpose || 'Ingredients'}
${group.ingredients.map(ingredient => {
    // Try to extract quantity and unit from ingredient string
    const match = ingredient.match(/^([\d./]+)\s*([a-zA-Z]+)\s+(.+)$/);
    if (match) {
        const [_, amount, unit, item] = match;
        return `- [${amount} ${unit}] ${item}`;
    }
    return `- ${ingredient}`;
}).join('\n')}
`).join('\n\n')}

${scrapedRecipe.instructions_list.map((instruction, index) => `${index + 1}. ${instruction}`).join('\n')}`;
}
