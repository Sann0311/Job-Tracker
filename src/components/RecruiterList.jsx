import React, { useState } from 'react';
import './RecruiterList.css';

const RecruiterList = ({ jobs, manualRecruiters, onAddManualRecruiter }) => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [newRec, setNewRec] = useState({ name: '', company: '', email: '', linkedin: '' });
    const [searchTerm, setSearchTerm] = useState('');

    // Merge recruiters from jobs and manual list
    const recruitersFromJobs = jobs.flatMap(job =>
        (job.recruiters || []).map(rec => ({
            ...rec,
            company: job.company,
            id: `job-${job.id}-${rec.id}`,
            source: 'application'
        }))
    );

    const rawRecruiters = [...manualRecruiters.map(r => ({ ...r, source: 'manual' })), ...recruitersFromJobs];

    // Duplicate Detection logic
    const checkDuplicates = (list) => {
        return list.map((rec, index) => {
            const isDuplicate = list.some((other, otherIdx) => {
                if (index === otherIdx) return false;
                // Match by email if available
                if (rec.email && other.email && rec.email.toLowerCase() === other.email.toLowerCase()) return true;
                // Match by name if available
                if (rec.name && other.name && rec.name.toLowerCase() === other.name.toLowerCase()) return true;
                return false;
            });
            return { ...rec, isDuplicate };
        });
    };

    const duplicateCheckedRecruiters = checkDuplicates(rawRecruiters);

    // Filter by company name
    const allRecruiters = duplicateCheckedRecruiters.filter(rec =>
        rec.company?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const [copyStatus, setCopyStatus] = useState('');

    const copyToClipboard = (text, type) => {
        navigator.clipboard.writeText(text);
        setCopyStatus(`Copied ${type}!`);
        setTimeout(() => setCopyStatus(''), 2000);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newRec.name && !newRec.company) return;
        onAddManualRecruiter({ ...newRec, id: `manual-${Date.now()}` });
        setNewRec({ name: '', company: '', email: '', linkedin: '' });
        setShowAddForm(false);
    };

    return (
        <div className="recruiter-page">
            <header className="page-header">
                <div className="header-with-action">
                    <h1>Recruiter <span className="highlight">Directory</span></h1>
                    <div className="header-actions">
                        <div className="recruiter-search-container">
                            <span className="search-icon">🔍</span>
                            <input
                                type="text"
                                placeholder="Search by company..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="recruiter-search-input"
                            />
                        </div>
                        <button className="add-rec-btn" onClick={() => setShowAddForm(!showAddForm)}>
                            {showAddForm ? 'Close Form' : '+ Add Recruiter'}
                        </button>
                    </div>
                </div>
            </header>

            {showAddForm && (
                <form className="quick-add-form glass-panel" onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="input-field">
                            <label>Name</label>
                            <input
                                placeholder="Full Name"
                                value={newRec.name}
                                onChange={e => setNewRec({ ...newRec, name: e.target.value })}
                            />
                        </div>
                        <div className="input-field">
                            <label>Company</label>
                            <input
                                placeholder="Company Name"
                                value={newRec.company}
                                onChange={e => setNewRec({ ...newRec, company: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="input-field">
                            <label>Email</label>
                            <input
                                placeholder="Email Address"
                                value={newRec.email}
                                onChange={e => setNewRec({ ...newRec, email: e.target.value })}
                            />
                        </div>
                        <div className="input-field">
                            <label>LinkedIn Profile URL</label>
                            <input
                                placeholder="https://linkedin.com/in/..."
                                value={newRec.linkedin}
                                onChange={e => setNewRec({ ...newRec, linkedin: e.target.value })}
                            />
                        </div>
                    </div>
                    <button type="submit" className="submit-rec-btn">Save Recruiter</button>
                </form>
            )}

            {copyStatus && <div className="toast">{copyStatus}</div>}

            <div className="recruiters-grid">
                {allRecruiters.length > 0 ? (
                    allRecruiters.map((rec, index) => (
                        <div key={`${rec.id}-${index}`} className={`recruiter-card glass-panel ${rec.isDuplicate ? 'duplicate-flag' : ''}`}>
                            {rec.isDuplicate && (
                                <div className="warning-badge">⚠️ Duplicate Entry</div>
                            )}

                            <div className="rec-info">
                                <div className="name-row">
                                    <h3>{rec.name || 'Anonymous'}</h3>
                                    <span className="source-tag">{rec.source}</span>
                                </div>
                                <p className="company-tag">{rec.company || 'Unknown Company'}</p>
                            </div>

                            <div className="rec-actions">
                                {rec.email && (
                                    <div className="action-row">
                                        <span className="email-text">{rec.email}</span>
                                        <button className="copy-icon-btn" onClick={() => copyToClipboard(rec.email, 'email')}>📋</button>
                                    </div>
                                )}
                                <div className="action-row">
                                    <span className="linkedin-text">{rec.linkedin ? 'LinkedIn Profile' : 'No LinkedIn Profile'}</span>
                                    <div className="rec-link-group">
                                        {rec.linkedin && (
                                            <a href={rec.linkedin} target="_blank" rel="noopener noreferrer" className="nav-link-btn">🔗 View</a>
                                        )}
                                        {rec.linkedin && (
                                            <button className="copy-icon-btn" onClick={() => copyToClipboard(rec.linkedin, 'LinkedIn')}>📋</button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty-state glass-panel">
                        <p>{searchTerm ? `No recruiters found for "${searchTerm}"` : 'No recruiters found. Add one manually or track them via job applications.'}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecruiterList;
