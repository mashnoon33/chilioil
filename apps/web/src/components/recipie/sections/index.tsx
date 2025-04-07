import React from 'react';
import type { RecipeSection } from '@repo/parser';
import { Ingredients } from '../ingredients';
import { Steps } from '../steps';

interface SectionProps {
  section: RecipeSection;
}

export const Section: React.FC<SectionProps> = ({ section }) => {
  let accum = 1;

  return (
    <div >
      <h4 className="font-semibold text-gray-500 mb-4">{section.title}</h4>
      <div className="flex flex-col gap-4 mb-10">
        {/* Mobile/small screens */}
        <div className="@lg:hidden">
          <div className="border border-gray-300 dark:border-neutral-300/10 bg-neutral-50 dark:bg-primary rounded-lg py-2 mb-4">
            <Ingredients ingredients={section.ingredients} />
          </div>
          <Steps instructions={section.instructions} accum={accum} />
        </div>

        {/* Desktop/large screens */}
        <div className="hidden @lg:flex gap-20">
          <div className="flex-1">
            <div className="border border-gray-300 dark:border-neutral-300/10 bg-neutral-50 dark:bg-primary rounded-lg py-2">
              <Ingredients ingredients={section.ingredients} />
            </div>
          </div>
          <div className="flex-1">
            <Steps instructions={section.instructions} accum={accum} />
          </div>
        </div>
      </div>
    </div>
  );
};