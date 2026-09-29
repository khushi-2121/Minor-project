import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowRight, Download, FileText, ShieldAlert } from 'lucide-react';
import AppLayout from '../layouts/AppLayout';
import Container from '../components/common/Container';
import Button from '../components/common/Button';
import { reportService } from '../services/reportService';

const formatDate = (value) => {
  if (!value) return 'Not available';
  return new Date(value).toLocaleDateString();
};

const getStatusClass = (status) => {
  if (status === 'analyzed') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (status === 'processing') return 'bg-blue-50 text-blue-700 border-blue-200';
  if (status === 'failed') return 'bg-red-50 text-red-700 border-red-200';
  return 'bg-slate-100 text-slate-700 border-slate-200';
};

export default function ReportsPage() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [unauthorized, setUnauthorized] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        setError('');
        setUnauthorized(false);

        const response = await reportService.getReports();
        if (!response?.success) {
          setError(response?.message || 'Unable to load your soil reports.');
          return;
        }

        setReports(response.reports || []);
      } catch (err) {
        if (err?.status === 401 || err?.message?.toLowerCase().includes('unauthorized')) {
          setUnauthorized(true);
          return;
        }

        setError(err?.message || 'Unable to load your soil reports.');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const handleDownload = async (analysisId) => {
    try {
      setDownloadingId(analysisId);
      await reportService.downloadReport(analysisId);
    } catch (err) {
      setError(err?.message || 'Unable to generate your report. Please try again.');
    } finally {
      setDownloadingId(null);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <Container className="py-12">
          <div className="animate-pulse space-y-6">
            <div className="h-12 w-64 rounded bg-slate-200" />
            <div className="h-20 rounded-xl bg-slate-200" />
            {[...Array(3)].map((_, index) => (
              <div key={index} className="h-24 rounded-xl bg-slate-200" />
            ))}
          </div>
        </Container>
      </AppLayout>
    );
  }

  if (unauthorized) {
    return (
      <AppLayout>
        <Container className="py-16">
          <div className="mx-auto max-w-xl rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <ShieldAlert className="mx-auto mb-4 text-red-600" size={40} />
            <h2 className="text-2xl font-semibold text-red-900">Unauthorized access</h2>
            <p className="mt-3 text-red-700">You must be logged in to view your soil reports.</p>
            <Button onClick={() => navigate('/login')} className="mt-6">
              Return to login
            </Button>
          </div>
        </Container>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <Container className="py-16">
          <div className="mx-auto max-w-xl rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <AlertCircle className="mx-auto mb-4 text-red-600" size={40} />
            <h2 className="text-2xl font-semibold text-red-900">Unable to load reports</h2>
            <p className="mt-3 text-red-700">{error}</p>
            <Button onClick={() => navigate('/soil-analysis')} className="mt-6">
              Analyze Your Soil
            </Button>
          </div>
        </Container>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="border-b border-slate-200 bg-white px-6 py-8">
        <Container>
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Soil intelligence</p>
              <h1 className="mt-2 text-3xl font-bold text-slate-900">Soil Reports</h1>
              <p className="mt-2 text-slate-600">View, download, and manage your AI-powered soil analysis reports.</p>
            </div>
            <Button onClick={() => navigate('/soil-analysis')} className="gap-2">
              <span>Analyze Your Soil</span>
              <ArrowRight size={16} />
            </Button>
          </div>
        </Container>
      </div>

      <Container className="py-8">
        {reports.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <FileText className="text-slate-500" size={28} />
            </div>
            <h2 className="text-2xl font-semibold text-slate-900">No soil reports available yet.</h2>
            <Button onClick={() => navigate('/soil-analysis')} className="mt-6 gap-2">
              <span>Analyze Your Soil</span>
              <ArrowRight size={16} />
            </Button>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm text-slate-700">
                <thead className="bg-slate-50 text-xs uppercase tracking-[0.14em] text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Report ID</th>
                    <th className="px-4 py-3">Analysis Date</th>
                    <th className="px-4 py-3">Crop</th>
                    <th className="px-4 py-3">Soil Type</th>
                    <th className="px-4 py-3">Fertility</th>
                    <th className="px-4 py-3">Soil Health Score</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">View</th>
                    <th className="px-4 py-3">Download</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report) => (
                    <tr key={report.analysisId} className="border-t border-slate-200">
                      <td className="px-4 py-4 font-semibold text-slate-900">{report.reportId}</td>
                      <td className="px-4 py-4">{formatDate(report.createdAt)}</td>
                      <td className="px-4 py-4">{report.crop || 'Not available'}</td>
                      <td className="px-4 py-4">{report.soilType || 'Not available'}</td>
                      <td className="px-4 py-4">{report.summary?.fertilityLevel || 'Not available'}</td>
                      <td className="px-4 py-4">{report.summary?.soilHealthScore !== null && report.summary?.soilHealthScore !== undefined ? `${report.summary.soilHealthScore}/100` : 'Not available'}</td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusClass(report.status)}`}>
                          {report.status || 'submitted'}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <Button onClick={() => navigate(`/reports/${report.analysisId}`)} variant="secondary" className="rounded-full px-3 py-2">
                          View
                        </Button>
                      </td>
                      <td className="px-4 py-4">
                        <Button
                          onClick={() => handleDownload(report.analysisId)}
                          variant="secondary"
                          className="rounded-full px-3 py-2 gap-2"
                          disabled={downloadingId === report.analysisId}
                        >
                          <Download size={16} />
                          {downloadingId === report.analysisId ? 'Preparing...' : 'Download'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Container>
    </AppLayout>
  );
}
