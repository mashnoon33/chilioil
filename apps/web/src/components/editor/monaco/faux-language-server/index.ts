import { MonacoType } from '../type';
import { registerCompletionProvider } from './completion-provider';
import { registerLanguageConfiguration } from './language-config';
import { MarkerData, RecipeLanguageServerDependencies, TextModel } from './types';
import { validateModel } from './validator';

let isRegistered = false;

export function register(monaco: MonacoType): void {
  if (isRegistered) return;
  
  const dependencies: RecipeLanguageServerDependencies = { monaco };
  
  registerLanguageConfiguration(dependencies);
  registerCompletionProvider(dependencies);

  isRegistered = true;
}

export function validate(monaco: MonacoType, model: TextModel): MarkerData[] {
  return validateModel({ monaco }, model);
}