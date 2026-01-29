import React, { useState } from 'react';
import './JobForm.css';

const JobForm = ({ onAddJob }) => {
    const [formData, setFormData] = useState({
        role: '',
        company: '',
        jobLink: '',
        status: 'Applied',
        appliedDate: new Date().toISOString().split('T')[0],
        recruiters: [{ name: '', email: '', linkedin: '', id: Date.now().toString() }]
    });

    const handleAddRecruiter = () => {
        setFormData({
            ...formData,
            recruiters: [...formData.recruiters, { name: '', email: '', linkedin: '', id: Date.now().toString() }]
        });
    };

    const handleRemoveRecruiter = (id) => {
        if (formData.recruiters.length <= 1) return;
        setFormData({
            ...formData,
            recruiters: formData.recruiters.filter(r => r.id !== id)
        });
    };

    const handleRecruiterChange = (id, field, value) => {
        setFormData({
            ...formData,
            recruiters: formData.recruiters.map(r => r.id === id ? { ...r, [field]: value } : r)
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.role || !formData.company) return;

        onAddJob({
            ...formData,
            id: Date.now().toString(),
            dateAdded: new Date().toISOString(),
            statusLastUpdated: new Date().toISOString(),
            lastContactedDate: null,
            receivedResponse: false
        });

        setFormData({
            role: '',
            company: '',
            jobLink: '',
            status: 'Applied',
            appliedDate: new Date().toISOString().split('T')[0],
            recruiters: [{ name: '', email: '', linkedin: '', id: Date.now().toString() }]
        });
    };

    return (
        <form className="job-form glass-panel" onSubmit={handleSubmit}>
            <h2 className="form-title">Add New Application</h2>
            <div className="form-grid">
                <div className="input-group">
                    <label>Job Role *</label>
                    <input
                        type="text"
                        placeholder="e.g. Frontend Engineer"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        required
                    />
                </div>
                <div className="input-group">
                    <label>Company *</label>
                    <input
                        type="text"
                        placeholder="e.g. Google"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        required
                    />
                </div>
                <div className="input-group">
                    <label>Job Link</label>
                    <input
                        type="url"
                        placeholder="https://..."
                        value={formData.jobLink}
                        onChange={(e) => setFormData({ ...formData, jobLink: e.target.value })}
                    />
                </div>
                <div className="input-group">
                    <label>Status</label>
                    <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                        <option value="Applied">Applied</option>
                        <option value="Interviewing">Interviewing</option>
                        <option value="Offered">Offered</option>
                        <option value="Pending">Pending</option>
                    </select>
                </div>
                <div className="input-group">
                    <label>Applied Date</label>
                    <input
                        type="date"
                        value={formData.appliedDate}
                        onChange={(e) => setFormData({ ...formData, appliedDate: e.target.value })}
                    />
                </div>
            </div>

            <div className="recruiters-section">
                <div className="section-header">
                    <label>Recruiters</label>
                    <button type="button" className="add-rec-btn-small" onClick={handleAddRecruiter}>
                        + Add Another
                    </button>
                </div>

                {formData.recruiters.map((rec, index) => (
                    <div key={rec.id} className="recruiter-input-row glass-panel">
                        <div className="rec-fields">
                            <input
                                type="text"
                                placeholder="Name"
                                value={rec.name}
                                onChange={(e) => handleRecruiterChange(rec.id, 'name', e.target.value)}
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={rec.email}
                                onChange={(e) => handleRecruiterChange(rec.id, 'email', e.target.value)}
                            />
                            <input
                                type="url"
                                placeholder="LinkedIn"
                                value={rec.linkedin}
                                onChange={(e) => handleRecruiterChange(rec.id, 'linkedin', e.target.value)}
                            />
                        </div>
                        {formData.recruiters.length > 1 && (
                            <button
                                type="button"
                                className="remove-rec-btn"
                                onClick={() => handleRemoveRecruiter(rec.id)}
                            >
                                ✕
                            </button>
                        )}
                    </div>
                ))}
            </div>

            <button type="submit" className="submit-btn">Add Application</button>
        </form>
    );
};

export default JobForm;
