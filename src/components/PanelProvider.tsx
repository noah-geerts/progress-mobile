import { createContext, ReactNode, useContext, useState } from "react";

export interface Panel {
  isOpen: boolean;
  close: () => void;
  open: (content: ReactNode) => void;
  content: ReactNode;
}

const PanelContext = createContext<Panel | null>(null);

export function usePanel(): Panel {
  const panel = useContext(PanelContext);
  if (panel === null) {
    throw new Error("usePanel called outside of PanelProvider");
  }
  return panel;
}

export default function PanelProvider({children}: {children: ReactNode}) {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<ReactNode>(undefined);
  const close = () => {
    setIsOpen(false);
    setContent(undefined);
  }
  const open = (content: ReactNode) => {
    setIsOpen(true);
    setContent(content);
  }

  return <PanelContext value={{isOpen, close, open, content}}>
    {children}
  </PanelContext>
}