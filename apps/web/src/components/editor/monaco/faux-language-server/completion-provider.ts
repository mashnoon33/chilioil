import { type CompletionItem, type RecipeLanguageServerDependencies } from './types';
import { RECIPE_SECTIONS, COMMON_UNITS } from './constants';
import { frontmatterKeys, parseFrontmatter } from './frontmatter';
import { CUISINES } from '@/lib/cuisine';

export function registerCompletionProvider({ monaco }: RecipeLanguageServerDependencies): void {
  monaco.languages.registerCompletionItemProvider('recipe', {
    triggerCharacters: ['-', '=', ' ', '\n', ':'],
    provideCompletionItems: (model, position) => {
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn
      };

      const textUntilPosition = model.getValueInRange({
        startLineNumber: position.lineNumber,
        startColumn: 1,
        endLineNumber: position.lineNumber,
        endColumn: position.column
      });

      const suggestions: CompletionItem[] = [];

      // Check if we're in the frontmatter section
      const { hasFrontmatter, startLine, endLine } = parseFrontmatter(model.getValue());
      const currentLine = position.lineNumber - 1; // Monaco is 1-indexed, our parser is 0-indexed
      
      if (hasFrontmatter && currentLine > startLine && currentLine < endLine) {
        // We're inside the frontmatter block
        if (textUntilPosition.trim() === '' || textUntilPosition.indexOf(':') === -1) {
          // Suggest frontmatter keys if we're at the start of a line or no colon yet
          suggestions.push(...frontmatterKeys.map(key => ({
            label: key,
            kind: monaco.languages.CompletionItemKind.Property,
            insertText: `${key}: `,
            range
          })));
        } else if (textUntilPosition.includes('cuisine:') && position.column > textUntilPosition.indexOf('cuisine:') + 8) {
          // For cuisine field, suggest all available cuisines
          suggestions.push(...CUISINES.map(cuisine => ({
            label: cuisine,
            kind: monaco.languages.CompletionItemKind.Value,
            insertText: cuisine,
            range
          })));
        }
      }

      if (textUntilPosition.trim() === '-') {
        const addSpace = textUntilPosition.trimStart().endsWith(' ') ? '' : ' ';
        suggestions.push({
          label: 'ingredient',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: addSpace + '[${1:quantity} ${2:unit}] ${3:ingredient name}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: 'Insert ingredient with placeholders',
          range: range,
        });
      }
      // Suggest ingredient snippet
      if (textUntilPosition.trim() === '- [') {
        suggestions.push({
          label: 'ingredient',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: '${1:quantity} ${2:unit}] ${3:ingredient name}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: 'Insert ingredient with placeholders',
          range: range,
        });
      }

      // Suggest sections after ==
      if (textUntilPosition.trim().startsWith('==')) {
        suggestions.push(...RECIPE_SECTIONS.map(section => ({
          label: section,
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: section,
          detail: 'Recipe section',
          range: range,
        })));
      }

      // Suggest units in ingredient lines
      if (textUntilPosition.trim().startsWith('-') && textUntilPosition.includes('[') && /\[\s*\d+/.test(textUntilPosition)) {
        suggestions.push(...COMMON_UNITS.map(unit => ({
          label: unit,
          kind: monaco.languages.CompletionItemKind.Unit,
          insertText: unit,
          detail: 'Measurement unit',
          range: range
        })));
      }

      return { suggestions };
    }
  });
} 