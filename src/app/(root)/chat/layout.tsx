import ChatSidebar from '@/components/chat/ChatSidebar';
import { ReactNode } from 'react';
const ReactLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <ChatSidebar />

      {/* Main Chat Area */}
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
};

export default ReactLayout;
