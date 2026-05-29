import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiUser, FiBriefcase, FiBook, FiCode, FiFolder, 
  FiAward, FiGlobe, FiSave, FiPlus, FiTrash2, FiTrendingUp, FiX,
  FiAlertCircle
} from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';

const ResumeBuilder = ({ user, darkMode }) => {
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [showJobDescModal, setShowJobDescModal] = useState(false);
  
  const [resumeData, setResumeData] = useState({
    personalInfo: {
      fullName: user?.name || '',
      jobTitle: '',
      email: user?.email || '',
      phone: '',
      location: '',
      linkedin: '',
      github: '',
    },
    summary: '',
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    languages: [],
  });

  useEffect(() => {
    fetchResumeData();
  }, []);

  const fetchResumeData = async () => {
    setIsFetching(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/resume/my-resume', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success && response.data.data?.resumeData) {
        const savedData = response.data.data.resumeData;
        setResumeData(prev => ({
          ...prev,
          ...savedData,
          personalInfo: {
            ...prev.personalInfo,
            ...savedData.personalInfo,
          },
          experience: savedData.experience || [],
          education: savedData.education || [],
          skills: savedData.skills || [],
          projects: savedData.projects || [],
        }));
      }
    } catch (error) {
      console.error('Error fetching resume:', error);
    } finally {
      setIsFetching(false);
    }
  };

  // ========== ALL MISSING FUNCTIONS ==========
  
  const handlePersonalChange = (e) => {
    setResumeData({
      ...resumeData,
      personalInfo: {
        ...resumeData.personalInfo,
        [e.target.name]: e.target.value,
      },
    });
  };

  const handleSummaryChange = (e) => {
    setResumeData({ ...resumeData, summary: e.target.value });
  };

  const addExperience = () => {
    setResumeData({
      ...resumeData,
      experience: [
        ...resumeData.experience,
        { title: '', company: '', location: '', startDate: '', endDate: '', current: false, description: '' },
      ],
    });
  };

  const updateExperience = (index, field, value) => {
    const updated = [...resumeData.experience];
    updated[index][field] = value;
    setResumeData({ ...resumeData, experience: updated });
  };

  const removeExperience = (index) => {
    const updated = resumeData.experience.filter((_, i) => i !== index);
    setResumeData({ ...resumeData, experience: updated });
  };

  const addEducation = () => {
    setResumeData({
      ...resumeData,
      education: [
        ...resumeData.education,
        { degree: '', institution: '', location: '', startDate: '', endDate: '', current: false, description: '' },
      ],
    });
  };

  const updateEducation = (index, field, value) => {
    const updated = [...resumeData.education];
    updated[index][field] = value;
    setResumeData({ ...resumeData, education: updated });
  };

  const removeEducation = (index) => {
    const updated = resumeData.education.filter((_, i) => i !== index);
    setResumeData({ ...resumeData, education: updated });
  };

  const addSkill = () => {
    setResumeData({ ...resumeData, skills: [...resumeData.skills, ''] });
  };

  const updateSkill = (index, value) => {
    const updated = [...resumeData.skills];
    updated[index] = value;
    setResumeData({ ...resumeData, skills: updated });
  };

  const removeSkill = (index) => {
    const updated = resumeData.skills.filter((_, i) => i !== index);
    setResumeData({ ...resumeData, skills: updated });
  };

  const addProject = () => {
    setResumeData({
      ...resumeData,
      projects: [
        ...resumeData.projects,
        { name: '', description: '', technologies: [], link: '' },
      ],
    });
  };

  const updateProject = (index, field, value) => {
    const updated = [...resumeData.projects];
    updated[index][field] = value;
    setResumeData({ ...resumeData, projects: updated });
  };

  const removeProject = (index) => {
    const updated = resumeData.projects.filter((_, i) => i !== index);
    setResumeData({ ...resumeData, projects: updated });
  };

  // ========== END OF MISSING FUNCTIONS ==========

  // Check if resume has any content
  const hasResumeContent = () => {
    const { personalInfo, summary, experience, education, skills, projects } = resumeData;
    
    const hasPersonalInfo = personalInfo?.fullName?.trim() !== '' || 
                           personalInfo?.jobTitle?.trim() !== '' ||
                           personalInfo?.email?.trim() !== '';
    
    const hasSummary = summary?.trim() !== '';
    const hasExperience = experience?.length > 0 && experience.some(exp => exp.title?.trim() !== '' || exp.company?.trim() !== '');
    const hasEducation = education?.length > 0 && education.some(edu => edu.degree?.trim() !== '' || edu.institution?.trim() !== '');
    const hasSkills = skills?.length > 0 && skills.some(skill => skill?.trim() !== '');
    const hasProjects = projects?.length > 0 && projects.some(proj => proj.name?.trim() !== '');
    
    return hasPersonalInfo || hasSummary || hasExperience || hasEducation || hasSkills || hasProjects;
  };

  const saveResume = async () => {
    if (!hasResumeContent()) {
      toast.error('Please add some content to your resume before saving!', {
        icon: '⚠️',
        duration: 4000
      });
      return;
    }
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/resume/save', { resumeData }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Resume saved successfully!', {
        icon: '✅',
        duration: 3000
      });
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const analyzeResume = async () => {
    if (!hasResumeContent()) {
      toast.error('Please add some content to your resume before analyzing!', {
        icon: '⚠️',
        duration: 4000
      });
      return;
    }
    
    setLoading(true);
    setShowJobDescModal(false);
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/resume/analyze', 
        { 
          resumeData, 
          jobDescription: jobDescription || ''
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        setAnalysis(response.data.analysis);
        setShowAnalysis(true);
        toast.success(`ATS Score: ${response.data.analysis.score}%`);
      }
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Failed to analyze resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  // Show loading state while fetching
  if (isFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Loading your resume...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'personal', label: 'Personal', icon: <FiUser size={14} /> },
    { id: 'summary', label: 'Summary', icon: <FiBriefcase size={14} /> },
    { id: 'experience', label: 'Experience', icon: <FiBriefcase size={14} /> },
    { id: 'education', label: 'Education', icon: <FiBook size={14} /> },
    { id: 'skills', label: 'Skills', icon: <FiCode size={14} /> },
    { id: 'projects', label: 'Projects', icon: <FiFolder size={14} /> },
    { id: 'certifications', label: 'Certifications', icon: <FiAward size={14} /> },
    { id: 'languages', label: 'Languages', icon: <FiGlobe size={14} /> },
  ];

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <div>
            <h1 className={`text-2xl md:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Resume Builder
            </h1>
            <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Fill in your details to build a professional resume
            </p>
          </div>
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowJobDescModal(true)}
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium flex items-center space-x-2 text-sm"
            >
              <FiTrendingUp size={14} />
              <span>{loading ? 'Analyzing...' : 'ATS Analysis'}</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={saveResume}
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary-500 to-accent-500 text-white font-medium flex items-center space-x-2 text-sm"
            >
              <FiSave size={14} />
              <span>{loading ? 'Saving...' : 'Save Resume'}</span>
            </motion.button>
          </div>
        </div>

        {/* Warning if no content */}
        {!hasResumeContent() && (
          <div className={`mb-4 p-3 rounded-lg flex items-center space-x-2 ${
            darkMode ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
          }`}>
            <FiAlertCircle size={14} />
            <span className="text-sm">Please add some content to your resume before saving. Empty resumes will not be saved.</span>
          </div>
        )}

        {/* Tabs */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all duration-300 text-sm ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white'
                  : darkMode
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className={`p-5 rounded-xl ${darkMode ? 'glass-dark' : 'glass bg-white/50'}`}>
          {/* Personal Info */}
          {activeTab === 'personal' && (
            <div className="space-y-5">
              <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={resumeData.personalInfo?.fullName || ''}
                    onChange={handlePersonalChange}
                    className={`w-full px-3 py-2 rounded-lg outline-none transition-all text-sm ${
                      darkMode ? 'bg-gray-800 text-white focus:bg-gray-700' : 'bg-gray-100 text-gray-900 focus:bg-gray-200'
                    }`}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className={`block text-xs font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Job Title</label>
                  <input
                    type="text"
                    name="jobTitle"
                    value={resumeData.personalInfo?.jobTitle || ''}
                    onChange={handlePersonalChange}
                    className={`w-full px-3 py-2 rounded-lg outline-none transition-all text-sm ${
                      darkMode ? 'bg-gray-800 text-white focus:bg-gray-700' : 'bg-gray-100 text-gray-900 focus:bg-gray-200'
                    }`}
                    placeholder="Senior Software Engineer"
                  />
                </div>
                <div>
                  <label className={`block text-xs font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={resumeData.personalInfo?.email || ''}
                    onChange={handlePersonalChange}
                    className={`w-full px-3 py-2 rounded-lg outline-none transition-all text-sm ${
                      darkMode ? 'bg-gray-800 text-white focus:bg-gray-700' : 'bg-gray-100 text-gray-900 focus:bg-gray-200'
                    }`}
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className={`block text-xs font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={resumeData.personalInfo?.phone || ''}
                    onChange={handlePersonalChange}
                    className={`w-full px-3 py-2 rounded-lg outline-none transition-all text-sm ${
                      darkMode ? 'bg-gray-800 text-white focus:bg-gray-700' : 'bg-gray-100 text-gray-900 focus:bg-gray-200'
                    }`}
                    placeholder="+1 234 567 8900"
                  />
                </div>
                <div>
                  <label className={`block text-xs font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Location</label>
                  <input
                    type="text"
                    name="location"
                    value={resumeData.personalInfo?.location || ''}
                    onChange={handlePersonalChange}
                    className={`w-full px-3 py-2 rounded-lg outline-none transition-all text-sm ${
                      darkMode ? 'bg-gray-800 text-white focus:bg-gray-700' : 'bg-gray-100 text-gray-900 focus:bg-gray-200'
                    }`}
                    placeholder="San Francisco, CA"
                  />
                </div>
                <div>
                  <label className={`block text-xs font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>LinkedIn</label>
                  <input
                    type="text"
                    name="linkedin"
                    value={resumeData.personalInfo?.linkedin || ''}
                    onChange={handlePersonalChange}
                    className={`w-full px-3 py-2 rounded-lg outline-none transition-all text-sm ${
                      darkMode ? 'bg-gray-800 text-white focus:bg-gray-700' : 'bg-gray-100 text-gray-900 focus:bg-gray-200'
                    }`}
                    placeholder="linkedin.com/in/johndoe"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Summary */}
          {activeTab === 'summary' && (
            <div>
              <h2 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Professional Summary</h2>
              <textarea
                value={resumeData.summary || ''}
                onChange={handleSummaryChange}
                rows={6}
                className={`w-full px-3 py-2 rounded-lg outline-none transition-all resize-none text-sm ${
                  darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'
                }`}
                placeholder="Write a compelling professional summary highlighting your key achievements and skills..."
              />
              <p className={`text-xs mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                Tip: Include your years of experience, key skills, and career highlights
              </p>
            </div>
          )}

          {/* Experience */}
          {activeTab === 'experience' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Work Experience</h2>
                <button onClick={addExperience} className="px-3 py-1.5 rounded-lg bg-primary-500 text-white flex items-center space-x-1.5 text-sm">
                  <FiPlus size={12} /> <span>Add</span>
                </button>
              </div>
              <div className="space-y-4">
                {(resumeData.experience || []).map((exp, idx) => (
                  <div key={idx} className={`p-3 rounded-lg relative ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                    <button onClick={() => removeExperience(idx)} className="absolute top-2 right-2 p-1 rounded-lg text-red-500 hover:bg-red-500/20">
                      <FiTrash2 size={12} />
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input type="text" placeholder="Job Title" value={exp.title || ''} onChange={(e) => updateExperience(idx, 'title', e.target.value)} className={`px-3 py-1.5 rounded-lg outline-none text-sm ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}`} />
                      <input type="text" placeholder="Company" value={exp.company || ''} onChange={(e) => updateExperience(idx, 'company', e.target.value)} className={`px-3 py-1.5 rounded-lg outline-none text-sm ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}`} />
                      <input type="text" placeholder="Location" value={exp.location || ''} onChange={(e) => updateExperience(idx, 'location', e.target.value)} className={`px-3 py-1.5 rounded-lg outline-none text-sm ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}`} />
                      <div className="flex gap-2">
                        <input type="text" placeholder="Start Date" value={exp.startDate || ''} onChange={(e) => updateExperience(idx, 'startDate', e.target.value)} className={`flex-1 px-3 py-1.5 rounded-lg outline-none text-sm ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}`} />
                        <input type="text" placeholder="End Date" value={exp.endDate || ''} onChange={(e) => updateExperience(idx, 'endDate', e.target.value)} className={`flex-1 px-3 py-1.5 rounded-lg outline-none text-sm ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}`} />
                      </div>
                      <textarea placeholder="Job Description" value={exp.description || ''} onChange={(e) => updateExperience(idx, 'description', e.target.value)} rows={2} className={`col-span-2 px-3 py-1.5 rounded-lg outline-none resize-none text-sm ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}`} />
                    </div>
                  </div>
                ))}
                {(resumeData.experience || []).length === 0 && <p className="text-center text-gray-500 py-6 text-sm">No experience added. Click "Add" to start.</p>}
              </div>
            </div>
          )}

          {/* Education */}
          {activeTab === 'education' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Education</h2>
                <button onClick={addEducation} className="px-3 py-1.5 rounded-lg bg-primary-500 text-white flex items-center space-x-1.5 text-sm">
                  <FiPlus size={12} /> <span>Add</span>
                </button>
              </div>
              <div className="space-y-4">
                {(resumeData.education || []).map((edu, idx) => (
                  <div key={idx} className={`p-3 rounded-lg relative ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                    <button onClick={() => removeEducation(idx)} className="absolute top-2 right-2 p-1 rounded-lg text-red-500 hover:bg-red-500/20">
                      <FiTrash2 size={12} />
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input type="text" placeholder="Degree" value={edu.degree || ''} onChange={(e) => updateEducation(idx, 'degree', e.target.value)} className={`px-3 py-1.5 rounded-lg outline-none text-sm ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}`} />
                      <input type="text" placeholder="Institution" value={edu.institution || ''} onChange={(e) => updateEducation(idx, 'institution', e.target.value)} className={`px-3 py-1.5 rounded-lg outline-none text-sm ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}`} />
                      <input type="text" placeholder="Location" value={edu.location || ''} onChange={(e) => updateEducation(idx, 'location', e.target.value)} className={`px-3 py-1.5 rounded-lg outline-none text-sm ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}`} />
                      <div className="flex gap-2">
                        <input type="text" placeholder="Start Date" value={edu.startDate || ''} onChange={(e) => updateEducation(idx, 'startDate', e.target.value)} className={`flex-1 px-3 py-1.5 rounded-lg outline-none text-sm ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}`} />
                        <input type="text" placeholder="End Date" value={edu.endDate || ''} onChange={(e) => updateEducation(idx, 'endDate', e.target.value)} className={`flex-1 px-3 py-1.5 rounded-lg outline-none text-sm ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}`} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {activeTab === 'skills' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Skills</h2>
                <button onClick={addSkill} className="px-3 py-1.5 rounded-lg bg-primary-500 text-white flex items-center space-x-1.5 text-sm">
                  <FiPlus size={12} /> <span>Add</span>
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(resumeData.skills || []).map((skill, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-primary-500/20">
                    <input type="text" value={skill || ''} onChange={(e) => updateSkill(idx, e.target.value)} className="bg-transparent outline-none text-primary-400 text-sm w-24" placeholder="Skill" />
                    <button onClick={() => removeSkill(idx)} className="text-red-400 hover:text-red-500"><FiTrash2 size={12} /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {activeTab === 'projects' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Projects</h2>
                <button onClick={addProject} className="px-3 py-1.5 rounded-lg bg-primary-500 text-white flex items-center space-x-1.5 text-sm">
                  <FiPlus size={12} /> <span>Add</span>
                </button>
              </div>
              <div className="space-y-3">
                {(resumeData.projects || []).map((project, idx) => (
                  <div key={idx} className={`p-3 rounded-lg relative ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                    <button onClick={() => removeProject(idx)} className="absolute top-2 right-2 p-1 rounded-lg text-red-500 hover:bg-red-500/20"><FiTrash2 size={12} /></button>
                    <div className="space-y-2">
                      <input type="text" placeholder="Project Name" value={project.name || ''} onChange={(e) => updateProject(idx, 'name', e.target.value)} className={`w-full px-3 py-1.5 rounded-lg outline-none text-sm ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}`} />
                      <textarea placeholder="Project Description" value={project.description || ''} onChange={(e) => updateProject(idx, 'description', e.target.value)} rows={2} className={`w-full px-3 py-1.5 rounded-lg outline-none resize-none text-sm ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}`} />
                      <input type="text" placeholder="Project Link (optional)" value={project.link || ''} onChange={(e) => updateProject(idx, 'link', e.target.value)} className={`w-full px-3 py-1.5 rounded-lg outline-none text-sm ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications & Languages */}
          {activeTab === 'certifications' && (
            <div className="text-center py-8">
              <FiAward className="text-4xl mx-auto mb-3 text-gray-500" />
              <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Certifications feature coming soon...</p>
            </div>
          )}

          {activeTab === 'languages' && (
            <div className="text-center py-8">
              <FiGlobe className="text-4xl mx-auto mb-3 text-gray-500" />
              <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Languages feature coming soon...</p>
            </div>
          )}
        </div>
      </div>

      {/* Job Description Modal */}
      {showJobDescModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className={`max-w-md w-full rounded-xl p-5 ${darkMode ? 'glass-dark' : 'bg-white'}`}>
            <div className="flex justify-between items-center mb-3">
              <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>ATS Resume Analysis</h2>
              <button onClick={() => setShowJobDescModal(false)} className="text-gray-500 hover:text-gray-700"><FiX size={20} /></button>
            </div>
            <p className={`text-sm mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Enter the job description to analyze your resume against specific requirements:</p>
            <textarea value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} rows={5} className={`w-full px-3 py-2 rounded-lg outline-none resize-none text-sm mb-3 ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'}`} placeholder="Paste the job description here..." />
            <button onClick={analyzeResume} className="w-full py-2 rounded-lg bg-gradient-to-r from-primary-500 to-accent-500 text-white font-medium text-sm">Analyze Resume</button>
          </motion.div>
        </div>
      )}

      {/* Analysis Results Modal */}
      {showAnalysis && analysis && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className={`max-w-2xl w-full rounded-xl p-5 ${darkMode ? 'glass-dark' : 'bg-white'} max-h-[90vh] overflow-y-auto`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>ATS Analysis Results</h2>
              <button onClick={() => setShowAnalysis(false)} className="text-gray-500 hover:text-gray-700"><FiX size={20} /></button>
            </div>
            <div className="text-center mb-5">
              <div className={`text-5xl font-bold ${getScoreColor(analysis.score)}`}>{analysis.score}%</div>
              <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>ATS Compatibility Score</p>
            </div>
            {analysis.strengths?.length > 0 && (
              <div className="mb-4">
                <h3 className={`font-semibold text-sm mb-2 text-green-500`}>✅ Strengths</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">{analysis.strengths.map((strength, idx) => (<li key={idx} className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{strength}</li>))}</ul>
              </div>
            )}
            {analysis.suggestions?.length > 0 && (
              <div className="mb-4">
                <h3 className={`font-semibold text-sm mb-2 text-yellow-500`}>💡 Suggestions</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">{analysis.suggestions.map((suggestion, idx) => (<li key={idx} className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{suggestion}</li>))}</ul>
              </div>
            )}
            {analysis.missingKeywords?.length > 0 && (
              <div className="mb-4">
                <h3 className={`font-semibold text-sm mb-2 text-red-500`}>🎯 Missing Keywords</h3>
                <div className="flex flex-wrap gap-1.5">{analysis.missingKeywords.map((keyword, idx) => (<span key={idx} className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-xs">{keyword}</span>))}</div>
              </div>
            )}
            <button onClick={() => setShowAnalysis(false)} className="w-full mt-4 py-2 rounded-lg bg-gradient-to-r from-primary-500 to-accent-500 text-white font-medium text-sm">Close</button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ResumeBuilder;