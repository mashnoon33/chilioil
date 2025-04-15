export interface ScrapedRecipie {
    author:             string;
    canonical_url:      string;
    category:           string;
    cook_time:          number;
    cuisine:            string;
    description:        string;
    host:               string;
    image:              string;
    ingredient_groups:  IngredientGroup[];
    ingredients:        string[];
    instructions:       string;
    instructions_list:  string[];
    keywords:           string[];
    language:           string;
    nutrients:          Nutrients;
    parsed_ingredients: ParsedIngredient[];
    prep_time:          number;
    ratings:            number;
    ratings_count:      number;
    site_name:          string;
    title:              string;
    total_time:         number;
    yields:             string;
}

export interface IngredientGroup {
    ingredients: string[];
    purpose:     null;
}

export interface Nutrients {
    calories:              string;
    carbohydrateContent:   string;
    cholesterolContent:    string;
    fatContent:            string;
    fiberContent:          string;
    proteinContent:        string;
    saturatedFatContent:   string;
    servingSize:           string;
    sodiumContent:         string;
    sugarContent:          string;
    unsaturatedFatContent: string;
}

export interface ParsedIngredient {
    amount:      Amount[];
    comment:     Comment | null;
    name:        Comment[];
    original:    string;
    preparation: Comment | null;
    purpose:     Comment | null;
    size:        Comment | null;
}

export interface Amount {
    quantity: number;
    unit:     null | string;
}

export interface Comment {
    confidence:     number;
    starting_index: number;
    text:           string;
}


export function toRecipeMarkdown(scrapedRecipe: ScrapedRecipie): string {
    return `---
short-description: ${scrapedRecipe.description}
yields: ${scrapedRecipe.yields}
cuisine: ${scrapedRecipe.cuisine.toLowerCase()}
source: ${scrapedRecipe.canonical_url}
---

# ${scrapedRecipe.title}

${scrapedRecipe.description}
${
    scrapedRecipe.parsed_ingredients.map((ingredient) => {
        if (ingredient.amount && ingredient.amount.length > 0) {
            const amount = ingredient.amount[ingredient.amount.length - 1]!;
            const name = ingredient.name ? ingredient.name.map(n => n.text).join(' ') : ingredient.original;
            const preparation = ingredient.preparation ? ` *(${ingredient.preparation.text})*` : '';
            return `- [${amount.quantity}${amount.unit ? ' ' + amount.unit : ''}] ${name.charAt(0).toUpperCase() + name.slice(1)}${preparation}`;
        }
        return `- ${ingredient.original}`;
    }).join('\n')
}

${
        scrapedRecipe.instructions_list.map((instruction, index) =>
            `${index + 1}. ${instruction}`
        ).join("\n")
    }`;
}
