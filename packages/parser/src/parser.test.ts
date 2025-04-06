import { describe, it, expect } from 'vitest';
import { parseRecipe } from "./parser.js";

describe('parseRecipe', () => {
  it('should parse a basic recipe with sections', async () => {
    const markdown = `# Pancakes

A classic breakfast recipe for fluffy pancakes.

== Dry Ingredients
- [2 cups] all-purpose flour
- [2 tbsp] sugar
- [2 tsp] baking powder *(aluminum-free)*

== Wet Ingredients
- [2] eggs
- [1.5 cups] milk
- [1/4 cup] melted butter

== Instructions
1. Mix dry ingredients in a bowl
2. Whisk wet ingredients in another bowl
3. Combine wet and dry ingredients
4. Cook on a hot griddle until golden brown`;

    const recipe = await parseRecipe(markdown);

    expect(recipe.title).toBe("Pancakes");
    expect(recipe.description).toBe("A classic breakfast recipe for fluffy pancakes.");
    expect(recipe.sections.length).toBe(3);

    // Check Dry Ingredients section
    const drySection = recipe.sections[0];
    expect(drySection.title).toBe("Dry Ingredients");
    expect(drySection.ingredients.length).toBe(3);
    expect(drySection.ingredients[0]).toEqual({
      quantity: "2",
      unit: "cups",
      name: "all-purpose flour",
      displayUnit: "cups",
      important: false
    });
    expect(drySection.ingredients[2]).toEqual({
      quantity: "2",
      unit: "tsp",
      name: "baking powder",
      description: "aluminum-free",
      displayUnit: "tsp",
      important: false
    });

    // Check Wet Ingredients section
    const wetSection = recipe.sections[1];
    expect(wetSection.title).toBe("Wet Ingredients");
    expect(wetSection.ingredients.length).toBe(3);
    expect(wetSection.ingredients[0]).toEqual({
      quantity: "2",
      unit: "unit",
      name: "eggs",
      displayUnit: "unit",
      important: false
    });

    // Check Instructions section
    const instructionsSection = recipe.sections[2];
    expect(instructionsSection.title).toBe("Instructions");
    expect(instructionsSection.instructions.length).toBe(4);
    expect(instructionsSection.instructions[0]).toBe("Mix dry ingredients in a bowl");
  });

  it('should parse ingredients with important flag and descriptions', async () => {
    const markdown = `# Bacon Ranch Dressing

A creamy and flavorful ranch dressing with bacon.

== Dressing
- [3 slice] bacon *(thick cut)* !!
- [1/4 cup] mayonaise !!
- [1/4 cup] sour cream !!
- [1 1/2 tbsp] dill pickle brine !!
- [1 tbsp] fresh dill *(chopped)*
- [1 tbsp] fresh chives *(finely chopped)*
- [1 piece] garlic clove *(small)*
- [1/4 tsp] black pepper *(freshly ground)*`;

    const recipe = await parseRecipe(markdown);

    expect(recipe.title).toBe("Bacon Ranch Dressing");
    expect(recipe.description).toBe("A creamy and flavorful ranch dressing with bacon.");
    expect(recipe.sections.length).toBe(1);

    const dressingSection = recipe.sections[0];
    expect(dressingSection.title).toBe("Dressing");
    expect(dressingSection.ingredients.length).toBe(8);

    // Check important ingredients
    expect(dressingSection.ingredients[0]).toEqual({
      quantity: "3",
      unit: "slice",
      name: "bacon",
      description: "thick cut",
      displayUnit: "slice",
      important: true
    });

    expect(dressingSection.ingredients[1]).toEqual({
      quantity: "0.25",
      unit: "cup",
      name: "mayonaise",
      displayUnit: "cup",
      important: true
    });

    // Check non-important ingredients with descriptions
    expect(dressingSection.ingredients[4]).toEqual({
      quantity: "1",
      unit: "tbsp",
      name: "fresh dill",
      description: "chopped",
      displayUnit: "tbsp",
      important: false
    });

    expect(dressingSection.ingredients[7]).toEqual({
      quantity: "0.25",
      unit: "tsp",
      name: "black pepper",
      description: "freshly ground",
      displayUnit: "tsp",
      important: false
    });
  });
});