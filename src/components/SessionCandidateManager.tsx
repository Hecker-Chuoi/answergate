
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SessionCandidateManageByType from '@/components/SessionCandidateManageByType';
import SessionCandidateManageByUsernames from '@/components/SessionCandidateManageByUsernames';

interface SessionCandidateManagerProps {
  sessionId: number;
  onSuccess: () => void;
  onCancel: () => void;
}

const SessionCandidateManager: React.FC<SessionCandidateManagerProps> = ({ 
  sessionId,
  onSuccess,
  onCancel
}) => {
  const [activeTab, setActiveTab] = useState<string>('type');

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">Quản lý thí sinh</h2>
      
      <Tabs defaultValue="type" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="type">Gán theo loại quân nhân</TabsTrigger>
          <TabsTrigger value="manual">Gán thủ công</TabsTrigger>
        </TabsList>
        
        <TabsContent value="type" className="pt-4">
          <SessionCandidateManageByType 
            sessionId={sessionId}
            onSuccess={onSuccess}
            onCancel={onCancel}
          />
        </TabsContent>
        
        <TabsContent value="manual" className="pt-4">
          <SessionCandidateManageByUsernames
            sessionId={sessionId}
            onSuccess={onSuccess}
            onCancel={onCancel}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SessionCandidateManager;
