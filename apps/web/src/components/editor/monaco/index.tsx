"use client"
import Editor, { OnMount, useMonaco } from '@monaco-editor/react';
import type * as Monaco from 'monaco-editor';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { register, validate } from './faux-language-server';
import { useErrorStore } from '@/lib/stores/errorStore';

export interface RecipeEditorProps {
  initialValue?: string;
  onChange?: (value: string | undefined) => void;
}

export interface RecipeEditorRef {
  setValue: (value: string) => void;
}

export const RecipeEditor = forwardRef<RecipeEditorRef, RecipeEditorProps>(({ 
  initialValue,
  onChange 
}, ref) => {
  const monaco = useMonaco();
  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);
  const { clearErrors, setErrors } = useErrorStore();

  useImperativeHandle(ref, () => ({
    setValue: (value: string) => {
      if (editorRef.current) {
        editorRef.current.setValue(value);
      }
    }
  }));

  useEffect(() => {
    if (monaco) {
      register(monaco);
    }
    // Reset errors when component mounts
    clearErrors();
  }, [monaco, clearErrors]);

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;
  };

  const handleEditorValidation = (markers: Monaco.editor.IMarker[]) => {
    if (!monaco || !editorRef.current) return;
    
    const model = editorRef.current.getModel();
    if (!model) return;

    // Update markers with our custom validation
    const problems = validate(monaco, model);
    monaco.editor.setModelMarkers(model, 'recipe', problems);

    // Count errors (only count Error severity, not Warning)
    setErrors(problems);
  };

  const handleEditorChange = (value: string | undefined) => {
    if (onChange) {
      onChange(value);
    }
    // Trigger validation on change
    handleEditorValidation([]);
  };

  return (
    <Editor
      className="h-screen z-10"
      defaultLanguage="recipe"
      defaultValue={initialValue}
      theme="recipe-theme"
      onChange={handleEditorChange}
      onMount={handleEditorDidMount}
      onValidate={handleEditorValidation}
      options={{
        minimap: { enabled: false },
        lineNumbers: 'on',
        fontSize: 14,
        wordWrap: 'on',
        renderWhitespace: 'none',
        scrollBeyondLastLine: false,
        padding: { top: 10, bottom: 200 },
      }}
    />
  );
});

RecipeEditor.displayName = 'RecipeEditor';

export default RecipeEditor; 