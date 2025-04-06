import { RecipeLanguageServerDependencies } from './types';

export function registerLanguageConfiguration({ monaco }: RecipeLanguageServerDependencies): void {
  monaco.languages.register({ id: 'recipe' });

  // Define the recipe language syntax
  monaco.languages.setMonarchTokensProvider('recipe', {
    tokenizer: {
      root: [
        // YAML Frontmatter
        [/^---$/, 'recipe-frontmatter-delimiter'],
        [/^(short-description|short-url|yields|cuisine)(:)(.*)$/, ['recipe-frontmatter-key', 'recipe-frontmatter-colon', 'recipe-frontmatter-value']],
        
        // Headers
        [/^#\s.*$/, 'recipe-header'],
        [/^==\s.*$/, 'recipe-section'],
        [/^-.*!!.*$/, 'recipe-important'],
        // Ingredients
        [/^-\s\[[^\]]*\]/, 'recipe-quantity'],
        [/\*\(.*?\)\*/, 'recipe-description'],
        // Instructions
        [/^\d+\.\s/, 'recipe-step-number'],
      ]
    }
  });

  // Define the recipe language theme
  monaco.editor.defineTheme('recipe-theme', {
    base: 'vs',
    inherit: true,
    rules: [
      { token: 'recipe-frontmatter-delimiter', foreground: '808080', fontStyle: 'bold' },
      { token: 'recipe-frontmatter-key', foreground: '0451A5', fontStyle: 'bold' },
      { token: 'recipe-frontmatter-colon', foreground: '0451A5' },
      { token: 'recipe-frontmatter-value', foreground: '098658' },
      { token: 'recipe-header', foreground: '569CD6', fontStyle: 'bold' },
      { token: 'recipe-section', foreground: '569CD6' },
      { token: 'recipe-subsection', foreground: '569CD6' },
      { token: 'recipe-quantity', foreground: '4EC9B0' },
      { token: 'recipe-description', foreground: '608B4E', fontStyle: 'italic' },
      { token: 'recipe-step-number', foreground: 'CE9178' },
      { token: 'recipe-important', foreground: 'FF0000', fontStyle: 'bold' },
    ],
    colors: {
      'editor.background': '#f7f7f7',
    }
  });
  monaco.editor.setTheme('recipe-theme');

  monaco.languages.setLanguageConfiguration('recipe', {
    brackets: [
      ['{', '}'],
      ['[', ']'],
      ['(', ')']
    ],
    comments: {
      lineComment: '#',
    },
    autoClosingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '"', close: '"' },
      { open: "'", close: "'" },
      { open: '*(', close: ')*' }
    ],
    surroundingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '"', close: '"' },
      { open: "'", close: "'" }
    ],
    onEnterRules: [
      {
        // Auto-populate ingredient lines
        beforeText: /^-\s*\[[^\]]*\][^$]*$/,
        action: {
          indentAction: monaco.languages.IndentAction.None,
          appendText: '- [',
        },
      },
      {
        // Auto-increment numbered lists (for instructions) - pattern matches "1. " through "9. " with content
        beforeText: /^1\.\s.+$/,
        action: {
          indentAction: monaco.languages.IndentAction.None,
          appendText: '2. ',
        },
      },
      {
        beforeText: /^2\.\s.+$/,
        action: {
          indentAction: monaco.languages.IndentAction.None,
          appendText: '3. ',
        },
      },
      {
        beforeText: /^3\.\s.+$/,
        action: {
          indentAction: monaco.languages.IndentAction.None,
          appendText: '4. ',
        },
      },
      {
        beforeText: /^4\.\s.+$/,
        action: {
          indentAction: monaco.languages.IndentAction.None,
          appendText: '5. ',
        },
      },
      {
        beforeText: /^5\.\s.+$/,
        action: {
          indentAction: monaco.languages.IndentAction.None,
          appendText: '6. ',
        },
      },
      {
        beforeText: /^6\.\s.+$/,
        action: {
          indentAction: monaco.languages.IndentAction.None,
          appendText: '7. ',
        },
      },
      {
        beforeText: /^7\.\s.+$/,
        action: {
          indentAction: monaco.languages.IndentAction.None,
          appendText: '8. ',
        },
      },
      {
        beforeText: /^8\.\s.+$/,
        action: {
          indentAction: monaco.languages.IndentAction.None,
          appendText: '9. ',
        },
      },
      {
        beforeText: /^9\.\s.+$/,
        action: {
          indentAction: monaco.languages.IndentAction.None,
          appendText: '10. ',
        },
      },
    ],
  });

  // Add folding provider
  monaco.languages.registerFoldingRangeProvider('recipe', {
    provideFoldingRanges: (model, context, token) => {
      const ranges: { start: number; end: number; }[] = [];
      const lines = model.getLinesContent();
      
      let currentSectionLine = -1;
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i] || '';
        const trimmedLine = line.trim();
        
        // Check for section markers (==)
        if (trimmedLine.startsWith('==')) {
          // If we had a previous section, create a folding range
          if (currentSectionLine !== -1 && i > currentSectionLine + 1) {
            ranges.push({
              start: currentSectionLine + 1,
              end: i - 1
            });
          }
          currentSectionLine = i;
        }
      }
      
      // Add the last section if it exists
      if (currentSectionLine !== -1 && currentSectionLine < lines.length - 1) {
        ranges.push({
          start: currentSectionLine + 1,
          end: lines.length - 1
        });
      }
      
      return ranges;
    }
  });
}