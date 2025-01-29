"use client";

import {
  InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HeadingNode } from "@lexical/rich-text";

import ExampleTheme from "./example-theme";
import Toolbar from "./toolbar";
import { ToolbarContext } from "./toolbar-context";

function onError(error: any) {
  console.error(error);
}

export default function Editor(props: {
  value: any;
  onChange: (value: any) => void;
}) {
  const initialConfig: InitialConfigType = {
    namespace: "MyEditor",
    theme: ExampleTheme,
    onError,
    nodes: [HeadingNode],
    editorState: props.value ? JSON.stringify(props.value) : undefined,
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="w-full rounded-md border border-input bg-background p-2 text-sm">
        <ToolbarContext>
          <Toolbar {...props} />
        </ToolbarContext>
        <div className="relative mt-2 px-1">
          <OnChangePlugin onChange={props.onChange} />
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="min-h-[80px] w-full bg-background text-sm focus:outline-none" />
            }
            placeholder={
              <div className="absolute top-0 text-sm text-muted-foreground">
                Écrivez quelque chose...
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>
      </div>
      <HistoryPlugin />
    </LexicalComposer>
  );
}
