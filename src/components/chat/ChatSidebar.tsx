'use client';

import { Menu, X } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Conversation {
  id: string;
  title: string;
  updatedAt: string;
}

const ChatSidebar = () => {
  const router = useRouter();
  const params = useParams();
  const currentId = params?.id as string | undefined;

  const [isLoading, setIsLoading] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await fetch('/api/conversations');
        const data = await response.json();
        setConversations(data.conversations || []);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();
  }, [currentId]);

  const handleNavigate = (path: string) => {
    router.push(path as any);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Hamburger button - visible only on mobile */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-24 left-4 z-50 flex h-11 w-11 items-center justify-center rounded-xl border border-gray-700 bg-[#111827] text-white shadow-lg md:hidden"
        aria-label="Open sidebar"
      >
        <Menu size={22} />
      </button>

      {/* Mobile overlay */}
      <div
        onClick={() => setMobileOpen(false)}
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen w-64 border-r border-gray-700 bg-[#0f172a] flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          md:static md:translate-x-0 md:flex md:h-screen
        `}
      >
        {/* Mobile sidebar header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700 md:hidden">
          <h2 className="text-white font-semibold">Conversations</h2>
          <button
            onClick={() => setMobileOpen(false)}
            className="text-gray-300 hover:text-white transition"
            aria-label="Close sidebar"
          >
            <X size={22} />
          </button>
        </div>

        {/* New Chat button */}
        <div className="p-4 border-b border-gray-700">
          <button
            onClick={() => handleNavigate('/chat')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-2 px-4 text-sm font-medium transition"
          >
            + New chat
          </button>
        </div>

        {/* Conversations list */}
        <div className="flex-1 overflow-y-auto p-2">
          {isLoading ? (
            <p className="text-gray-400 text-sm text-center mt-4">....</p>
          ) : conversations.length === 0 ? (
            <p className="text-gray-400 text-sm text-center mt-4">No previous conversations</p>
          ) : (
            <ul className="space-y-1">
              {conversations.map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => handleNavigate(`/chat/${c.id}`)}
                    className={`w-full text-right block rounded-lg px-3 py-2 text-sm truncate transition hover:bg-gray-700 ${
                      currentId === c.id ? 'bg-gray-700 font-medium text-white' : 'text-gray-300'
                    }`}
                  >
                    {c.title || 'Untitled conversation'}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    </>
  );
};

export default ChatSidebar;
