
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CandidateResult } from '@/services/sessionService';
import { format } from 'date-fns';

interface SessionResultsTableProps {
  results: CandidateResult[];
}

const SessionResultsTable: React.FC<SessionResultsTableProps> = ({ results }) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm:ss');
    } catch (e) {
      return 'Invalid date';
    }
  };

  const formatTimeTaken = (seconds: number) => {
    if (seconds === 0) return 'N/A';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    let result = '';
    if (hours > 0) result += `${hours}h `;
    if (minutes > 0 || hours > 0) result += `${minutes}m `;
    result += `${secs}s`;
    
    return result;
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'NOT_STARTED':
        return 'Chưa bắt đầu';
      case 'IN_PROGRESS':
        return 'Đang làm bài';
      case 'COMPLETED':
        return 'Đã hoàn thành';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NOT_STARTED':
        return 'text-gray-500';
      case 'IN_PROGRESS':
        return 'text-blue-600';
      case 'COMPLETED':
        return 'text-green-600';
      default:
        return '';
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Thời gian nộp</TableHead>
            <TableHead>Điểm</TableHead>
            <TableHead>Thời gian làm</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                Không có kết quả nào
              </TableCell>
            </TableRow>
          ) : (
            results.map((result) => (
              <TableRow key={result.testResultId}>
                <TableCell className="font-medium">#{result.testResultId}</TableCell>
                <TableCell className={getStatusColor(result.status)}>
                  {getStatusText(result.status)}
                </TableCell>
                <TableCell>{formatDate(result.submitAt)}</TableCell>
                <TableCell>{result.score.toFixed(2)}</TableCell>
                <TableCell>{formatTimeTaken(result.timeTaken)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default SessionResultsTable;
