import { MonacoType } from '../type';
import { MarkerData, TextModel } from './types';
import { z } from 'zod';
import yaml from 'yaml';

// Define the frontmatter schema using Zod
export const frontmatterSchema = z.object({
  'short-description': z.string().optional(),
  'slug': z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Must be a dash-separated string with no spaces').optional(),
  'yields': z.string().optional(),
  'cuisine': z.string().transform(s => s.split(',').map(c => c.trim())).optional(),
  'source': z.string().optional(),
}).strict();


export const frontmatterKeys = Object.keys(frontmatterSchema.shape);
export type FrontmatterKey = keyof typeof frontmatterSchema.shape;

export type FrontmatterType = z.infer<typeof frontmatterSchema>;

export interface FrontmatterParseResult {
  raw: Record<string, any>;
  parsed: FrontmatterType;
  hasFrontmatter: boolean;
  startLine: number;
  endLine: number;
}


const extractFrontmatterData = (
  lines: string[], 
  startLine: number, 
  endLine: number
): Record<string, any> => {
  const yamlContent = lines.slice(startLine + 1, endLine).join('\n');
  try {
    return yaml.parse(yamlContent) || {};
  } catch (error) {
    return {};
  }
};


export const parseFrontmatter = (text: string): FrontmatterParseResult => {
  const lines = text.split('\n');
  let raw: Record<string, any> = {};
  let parsed: FrontmatterType = {};
  let hasFrontmatter = false;
  let startLine = -1;
  let endLine = -1;

  if (lines.length > 0 && lines[0]?.trim() === '---') {
    startLine = 0;
    
    for (let i = 1; i < lines.length; i++) {
      if (lines[i]?.trim() === '---') {
        endLine = i;
        hasFrontmatter = true;
        break;
      }
    }

    if (hasFrontmatter) {
      raw = extractFrontmatterData(lines, startLine, endLine);
    }
  }

  try {
    parsed = frontmatterSchema.parse(raw);
  } catch (error) {
  }

  return { raw, parsed, hasFrontmatter, startLine, endLine };
};


const validateFrontmatterKeys = (
  monaco: MonacoType,
  lines: string[],
  startLine: number,
  endLine: number
): MarkerData[] => {
  const problems: MarkerData[] = [];
  const allowedKeys = Object.keys((frontmatterSchema.shape as Record<string, any>));
  
  const yamlContent = lines.slice(startLine + 1, endLine).join('\n');
  let parsedYaml;
  
  try {
    parsedYaml = yaml.parse(yamlContent) || {};
  } catch (error) {
    return [{
      severity: monaco.MarkerSeverity.Error,
      message: `Invalid YAML syntax: ${error instanceof Error ? error.message : 'Unknown error'}`,
      startLineNumber: startLine + 2,
      startColumn: 1,
      endLineNumber: endLine,
      endColumn: 1
    }];
  }

  Object.keys(parsedYaml).forEach(key => {
    if (!allowedKeys.includes(key)) {
      // Find the line containing this key
      const lineIndex = lines.findIndex((line, idx) => 
        idx > startLine && idx < endLine && line.trim().startsWith(`${key}:`)
      );
      
      if (lineIndex !== -1) {
        problems.push({
          severity: monaco.MarkerSeverity.Error,
          message: `Unknown frontmatter key: '${key}'. Allowed keys are: ${allowedKeys.join(', ')}`,
          startLineNumber: lineIndex + 1,
          startColumn: 1,
          endLineNumber: lineIndex + 1,
          endColumn: lines[lineIndex]?.length || 0
        });
      }
    }
  });
  
  return problems;
};


const mapZodErrorsToMarkers = (
  monaco: MonacoType,
  result: z.SafeParseError<any>,
  lines: string[],
  startLine: number,
  endLine: number
): MarkerData[] => {
  const problems: MarkerData[] = [];
  
  result.error.errors.forEach(error => {
    const key = error.path[0] as string;
    const lineIndex = lines.findIndex((line, idx) => 
      idx > startLine && idx < endLine && line.trim().startsWith(`${key}:`)
    );
    
    if (lineIndex === -1) return;
    const line = lines[lineIndex];
    if (!line) return;
    
    const keyStartPos = line.indexOf(key);
    const valueStartPos = line.indexOf(':', keyStartPos) + 1;
    
    problems.push({
      severity: monaco.MarkerSeverity.Error,
      message: error.message,
      startLineNumber: lineIndex + 1,
      startColumn: valueStartPos + 1,
      endLineNumber: lineIndex + 1,
      endColumn: line.length + 1
    });
  });
  
  return problems;
};

export const validateFrontmatter = (
  monaco: MonacoType, 
  model: TextModel
): MarkerData[] => {
  const text = model.getValue();
  const { raw, hasFrontmatter, startLine, endLine } = parseFrontmatter(text);
  const problems: MarkerData[] = [];

  if (!hasFrontmatter) {
    return problems;
  }

  const lines = text.split('\n');
  
  const keyProblems = validateFrontmatterKeys(monaco, lines, startLine, endLine);
  problems.push(...keyProblems);

  const result = frontmatterSchema.safeParse(raw);
  
  if (!result.success) {
    const zodProblems = mapZodErrorsToMarkers(monaco, result, lines, startLine, endLine);
    problems.push(...zodProblems);
  }
  
  return problems;
};