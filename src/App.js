import React, { useState } from 'react';
import { Camera, QrCode, CheckCircle, XCircle, Users, Download } from 'lucide-react';

const QRAttendanceSystem = () => {
  const [activeTab, setActiveTab] = useState('generate');
  const [classData] = useState({
    className: 'CSE-7A',
    subject: 'Full Stack Development',
    teacher: 'Prof. Tarun Neeraj',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  });
  
  const [qrData, setQrData] = useState(null);
  const [students, setStudents] = useState([
    { id: '231', name: 'Mansi Rajput', status: null, time: null },
    { id: '232', name: 'Rahul Sharma', status: null, time: null },
    { id: '233', name: 'Priya Patel', status: null, time: null },
    { id: '234', name: 'Amit Kumar', status: null, time: null },
    { id: '235', name: 'Sneha Gupta', status: null, time: null }
  ]);
  
  const [scanResult, setScanResult] = useState(null);
  const [attendanceStats, setAttendanceStats] = useState({ present: 0, absent: 0, total: 5 });

  const generateQRCode = () => {
    const sessionData = {
      classId: `${classData.className}-${Date.now()}`,
      subject: classData.subject,
      teacher: classData.teacher,
      date: classData.date,
      time: classData.time,
      validUntil: Date.now() + 300000
    };
    
    const qrString = btoa(JSON.stringify(sessionData));
    setQrData(qrString);
    
    setTimeout(() => generateQRVisualization(qrString), 0);
  };

  const generateQRVisualization = (data) => {
    const canvas = document.getElementById('qr-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const size = 300;
    canvas.width = size;
    canvas.height = size;
    
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);
    
    ctx.fillStyle = '#000000';
    const blockSize = 10;
    const blocks = size / blockSize;
    
    for (let i = 0; i < blocks; i++) {
      for (let j = 0; j < blocks; j++) {
        if ((data.charCodeAt((i * blocks + j) % data.length) + i + j) % 2 === 0) {
          ctx.fillRect(i * blockSize, j * blockSize, blockSize, blockSize);
        }
      }
    }
    
    const drawPositionSquare = (x, y) => {
      ctx.fillStyle = '#000000';
      ctx.fillRect(x, y, blockSize * 7, blockSize * 7);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x + blockSize, y + blockSize, blockSize * 5, blockSize * 5);
      ctx.fillStyle = '#000000';
      ctx.fillRect(x + blockSize * 2, y + blockSize * 2, blockSize * 3, blockSize * 3);
    };
    
    drawPositionSquare(0, 0);
    drawPositionSquare(size - blockSize * 7, 0);
    drawPositionSquare(0, size - blockSize * 7);
  };

  const simulateScan = (studentId) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    const currentTime = new Date().toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });

    setStudents(prev => prev.map(s => 
      s.id === studentId 
        ? { ...s, status: 'present', time: currentTime }
        : s
    ));

    setScanResult({
      success: true,
      student: student.name,
      id: studentId,
      time: currentTime
    });

    setAttendanceStats(prev => ({
      ...prev,
      present: prev.present + 1
    }));

    setTimeout(() => setScanResult(null), 3000);
  };

  const markAbsent = (studentId) => {
    setStudents(prev => prev.map(s => 
      s.id === studentId && !s.status
        ? { ...s, status: 'absent', time: '-' }
        : s
    ));
    setAttendanceStats(prev => ({
      ...prev,
      absent: prev.absent + 1
    }));
  };

  const exportAttendance = () => {
    const csv = [
      ['Student ID', 'Name', 'Status', 'Time'],
      ...students.map(s => [s.id, s.name, s.status || 'Not Marked', s.time || '-'])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_${classData.className}_${classData.date}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #eff6ff, #e0e7ff)',
      padding: '24px'
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          padding: '24px',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h1 style={{
                fontSize: '30px',
                fontWeight: 'bold',
                color: '#1f2937',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                margin: 0
              }}>
                <QrCode style={{ color: '#4f46e5' }} size={36} />
                QR Attendance System
              </h1>
              <p style={{ color: '#6b7280', marginTop: '8px', margin: '8px 0 0 0' }}>EdFloor Smart Attendance Module</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Techineur Solutions</p>
              <p style={{ fontSize: '14px', fontWeight: '600', color: '#4f46e5', margin: '4px 0 0 0' }}>December 2025</p>
            </div>
          </div>
        </div>

        {/* Class Info */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          padding: '24px',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div>
              <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Class</p>
              <p style={{ fontWeight: '600', color: '#1f2937', margin: 0 }}>{classData.className}</p>
            </div>
            <div>
              <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Subject</p>
              <p style={{ fontWeight: '600', color: '#1f2937', margin: 0 }}>{classData.subject}</p>
            </div>
            <div>
              <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Date</p>
              <p style={{ fontWeight: '600', color: '#1f2937', margin: 0 }}>{classData.date}</p>
            </div>
            <div>
              <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Teacher</p>
              <p style={{ fontWeight: '600', color: '#1f2937', margin: 0 }}>{classData.teacher}</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
          marginBottom: '24px'
        }}>
          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb' }}>
            <button
              onClick={() => setActiveTab('generate')}
              style={{
                flex: 1,
                padding: '16px 24px',
                fontWeight: '600',
                background: activeTab === 'generate' ? '#4f46e5' : '#f9fafb',
                color: activeTab === 'generate' ? 'white' : '#6b7280',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            >
              Generate QR Code
            </button>
            <button
              onClick={() => setActiveTab('scan')}
              style={{
                flex: 1,
                padding: '16px 24px',
                fontWeight: '600',
                background: activeTab === 'scan' ? '#4f46e5' : '#f9fafb',
                color: activeTab === 'scan' ? 'white' : '#6b7280',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            >
              Scan Attendance
            </button>
            <button
              onClick={() => setActiveTab('records')}
              style={{
                flex: 1,
                padding: '16px 24px',
                fontWeight: '600',
                background: activeTab === 'records' ? '#4f46e5' : '#f9fafb',
                color: activeTab === 'records' ? 'white' : '#6b7280',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            >
              View Records
            </button>
          </div>

          {/* Tab Content */}
          <div style={{ padding: '24px' }}>
            {/* Generate Tab */}
            {activeTab === 'generate' && (
              <div style={{ textAlign: 'center' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '24px' }}>
                  Generate Attendance QR Code
                </h2>
                
                {!qrData ? (
                  <div>
                    <p style={{ color: '#6b7280', marginBottom: '24px' }}>
                      Click below to generate a unique QR code for this session
                    </p>
                    <button
                      onClick={generateQRCode}
                      style={{
                        background: '#4f46e5',
                        color: 'white',
                        padding: '12px 32px',
                        borderRadius: '8px',
                        fontWeight: '600',
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: '0 4px 6px rgba(79, 70, 229, 0.3)',
                        fontSize: '16px'
                      }}
                    >
                      Generate QR Code
                    </button>
                  </div>
                ) : (
                  <div>
                    <div style={{
                      display: 'inline-block',
                      background: 'white',
                      padding: '24px',
                      borderRadius: '12px',
                      boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)',
                      marginBottom: '24px'
                    }}>
                      <canvas id="qr-canvas" style={{ border: '4px solid #4f46e5', borderRadius: '8px' }}></canvas>
                    </div>
                    <div style={{
                      background: '#f0fdf4',
                      border: '1px solid #bbf7d0',
                      borderRadius: '8px',
                      padding: '16px',
                      marginBottom: '16px',
                      maxWidth: '500px',
                      margin: '0 auto 16px auto'
                    }}>
                      <p style={{ color: '#166534', fontWeight: '600', margin: 0 }}>QR Code Generated Successfully!</p>
                      <p style={{ color: '#16a34a', fontSize: '14px', marginTop: '4px', margin: '4px 0 0 0' }}>
                        Valid for 5 minutes • Students can scan to mark attendance
                      </p>
                    </div>
                    <button
                      onClick={generateQRCode}
                      style={{
                        background: '#6b7280',
                        color: 'white',
                        padding: '8px 24px',
                        borderRadius: '8px',
                        fontWeight: '600',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      Regenerate QR Code
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Scan Tab */}
            {activeTab === 'scan' && (
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '24px', textAlign: 'center' }}>
                  Scan QR Code
                </h2>

                {scanResult && (
                  <div style={{
                    marginBottom: '24px',
                    padding: '16px',
                    borderRadius: '8px',
                    border: '2px solid',
                    background: scanResult.success ? '#f0fdf4' : '#fef2f2',
                    borderColor: scanResult.success ? '#22c55e' : '#ef4444'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {scanResult.success ? (
                        <CheckCircle style={{ color: '#16a34a', flexShrink: 0 }} size={24} />
                      ) : (
                        <XCircle style={{ color: '#dc2626', flexShrink: 0 }} size={24} />
                      )}
                      <div>
                        <p style={{ fontWeight: '600', color: '#1f2937', margin: 0 }}>
                          {scanResult.student} ({scanResult.id})
                        </p>
                        <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0 0 0' }}>
                          Marked present at {scanResult.time}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div style={{
                  background: '#1f2937',
                  borderRadius: '8px',
                  padding: '64px 32px',
                  textAlign: 'center',
                  marginBottom: '24px'
                }}>
                  <Camera style={{ color: 'white', margin: '0 auto 16px' }} size={64} />
                  <p style={{ color: 'white', marginBottom: '16px', margin: '0 0 16px 0' }}>Camera view would appear here</p>
                  <p style={{ color: '#9ca3af', fontSize: '14px', margin: 0 }}>In production: Live camera feed for QR scanning</p>
                </div>

                <div style={{
                  background: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '24px'
                }}>
                  <p style={{ color: '#1e40af', fontWeight: '600', marginBottom: '8px' }}>Demo Mode: Quick Test</p>
                  <p style={{ color: '#2563eb', fontSize: '14px', marginBottom: '12px' }}>
                    Click on a student to simulate QR scan
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {students.filter(s => !s.status).map(student => (
                      <button
                        key={student.id}
                        onClick={() => simulateScan(student.id)}
                        style={{
                          background: '#2563eb',
                          color: 'white',
                          padding: '8px 16px',
                          borderRadius: '8px',
                          fontSize: '14px',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        Scan {student.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Records Tab */}
            {activeTab === 'records' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                  <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>Attendance Records</h2>
                  <button
                    onClick={exportAttendance}
                    style={{
                      background: '#16a34a',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontWeight: '600',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <Download size={20} />
                    Export CSV
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                  <div style={{
                    background: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    borderRadius: '8px',
                    padding: '16px',
                    textAlign: 'center'
                  }}>
                    <Users style={{ color: '#2563eb', margin: '0 auto 8px' }} size={32} />
                    <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#1e40af', margin: '8px 0' }}>
                      {attendanceStats.total}
                    </p>
                    <p style={{ fontSize: '14px', color: '#2563eb', margin: 0 }}>Total Students</p>
                  </div>
                  <div style={{
                    background: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    borderRadius: '8px',
                    padding: '16px',
                    textAlign: 'center'
                  }}>
                    <CheckCircle style={{ color: '#16a34a', margin: '0 auto 8px' }} size={32} />
                    <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#166534', margin: '8px 0' }}>
                      {attendanceStats.present}
                    </p>
                    <p style={{ fontSize: '14px', color: '#16a34a', margin: 0 }}>Present</p>
                  </div>
                  <div style={{
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: '8px',
                    padding: '16px',
                    textAlign: 'center'
                  }}>
                    <XCircle style={{ color: '#dc2626', margin: '0 auto 8px' }} size={32} />
                    <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#991b1b', margin: '8px 0' }}>
                      {attendanceStats.absent}
                    </p>
                    <p style={{ fontSize: '14px', color: '#dc2626', margin: 0 }}>Absent</p>
                  </div>
                </div>

                <div style={{
                  background: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  overflow: 'auto'
                }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: '#f9fafb' }}>
                      <tr>
                        <th style={{
                          padding: '12px 24px',
                          textAlign: 'left',
                          fontSize: '12px',
                          fontWeight: '500',
                          color: '#6b7280',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em'
                        }}>
                          Student ID
                        </th>
                        <th style={{
                          padding: '12px 24px',
                          textAlign: 'left',
                          fontSize: '12px',
                          fontWeight: '500',
                          color: '#6b7280',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em'
                        }}>
                          Name
                        </th>
                        <th style={{
                          padding: '12px 24px',
                          textAlign: 'left',
                          fontSize: '12px',
                          fontWeight: '500',
                          color: '#6b7280',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em'
                        }}>
                          Status
                        </th>
                        <th style={{
                          padding: '12px 24px',
                          textAlign: 'left',
                          fontSize: '12px',
                          fontWeight: '500',
                          color: '#6b7280',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em'
                        }}>
                          Time
                        </th>
                        <th style={{
                          padding: '12px 24px',
                          textAlign: 'left',
                          fontSize: '12px',
                          fontWeight: '500',
                          color: '#6b7280',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em'
                        }}>
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student) => (
                        <tr key={student.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                          <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                            {student.id}
                          </td>
                          <td style={{ padding: '16px 24px', fontSize: '14px' }}>
                            {student.name}
                          </td>
                          <td style={{ padding: '16px 24px' }}>
                            {student.status === 'present' && (
                              <span style={{
                                display: 'inline-block',
                                padding: '4px 12px',
                                fontSize: '12px',
                                fontWeight: '600',
                                borderRadius: '9999px',
                                background: '#dcfce7',
                                color: '#166534'
                              }}>
                                Present
                              </span>
                            )}
                            {student.status === 'absent' && (
                              <span style={{
                                display: 'inline-block',
                                padding: '4px 12px',
                                fontSize: '12px',
                                fontWeight: '600',
                                borderRadius: '9999px',
                                background: '#fee2e2',
                                color: '#991b1b'
                              }}>
                                Absent
                              </span>
                            )}
                            {!student.status && (
                              <span style={{
                                display: 'inline-block',
                                padding: '4px 12px',
                                fontSize: '12px',
                                fontWeight: '600',
                                borderRadius: '9999px',
                                background: '#f3f4f6',
                                color: '#1f2937'
                              }}>
                                Not Marked
                              </span>
                            )}
                          </td>
                          <td style={{ padding: '16px 24px', fontSize: '14px', color: '#6b7280' }}>
                            {student.time || '-'}
                          </td>
                          <td style={{ padding: '16px 24px', fontSize: '14px' }}>
                            {!student.status && (
                              <button
                                onClick={() => markAbsent(student.id)}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: '#dc2626',
                                  fontWeight: '500',
                                  cursor: 'pointer',
                                  fontSize: '14px'
                                }}
                              >
                                Mark Absent
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', color: '#6b7280', fontSize: '14px' }}>
          <p style={{ margin: 0 }}>Developed by Mansi Rajput • Techineur Solutions Pvt. Ltd. • December 2025</p>
        </div>
      </div>
    </div>
  );
};

export default QRAttendanceSystem;