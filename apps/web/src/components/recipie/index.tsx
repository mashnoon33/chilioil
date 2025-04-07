import type { Recipe } from '@repo/parser';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Section } from './sections';
import { Badge } from '../ui/badge';
import { RouterOutputs } from '@/trpc/react';
interface RecipeProps {
  recipe: Recipe;
  version: number;
}

export const RecipeComponent: React.FC<RecipeProps> = ({ recipe, version }) => {
  return (
    <div className="flex flex-1 flex-col gap-1 pt-10 md:pt-20 h-[100%]px-4  @container">
      <div className=" max-w-xl @lg:max-w-4xl mx-auto">
        <div>
          <Badge className="mb-2">
            <span className="text-gray-300 ">version {version}</span>
          </Badge>
        </div>
        <h1 className="text-4xl dark:text-white font-bold">{recipe.title}</h1>

        {/* Description */}
        <div className="flex-col hidden @lg:flex ">
          {recipe.description.length < 250 ? (
            <div className="text-black/75 dark:text-white/75">{recipe.description}</div>
          ) : (
            <TwoColumnDiv text={recipe.description} />
          )}
        </div>
        <div className="block @lg:hidden mt-6 text-black/75 dark:text-white/75">
          <ReactMarkdown>{recipe.description}</ReactMarkdown>
        </div>

        {/* Sections */}
        <div className="flex flex-col gap-10 mt-10 w-full">
          {recipe.sections.map((section, index) => (
            <Section key={index} section={section} />
          ))}
        </div>
        <div className="min-h-[100px]"></div>
      </div>
    </div>
  );
};

const TwoColumnDiv = ({ text }: { text: string; }) => {
  const maxLines = 5;
  const lineHeight = 1;
  const maxChars = Math.floor(
    (text.length / 2) * (maxLines / (maxLines * lineHeight))
  );

  const splitIndex = text.lastIndexOf(' ', maxChars);
  const firstColumnText = text.slice(0, splitIndex);
  const secondColumnText = text.slice(splitIndex + 1);

  return (
    <div className="flex flex-row gap-20 text-justify mt-6 text-black/75 dark:text-white/75">
      <div className="w-1/2">
        <ReactMarkdown>{firstColumnText}</ReactMarkdown>
      </div>
      {secondColumnText && (
        <div className="w-1/2">
          <ReactMarkdown>{secondColumnText}</ReactMarkdown>
        </div>
      )}
    </div>
  );
};
