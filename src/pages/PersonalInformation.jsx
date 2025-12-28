import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Save, Upload, X } from 'lucide-react';
import { api } from '../lib/api';
import ConfirmationModal from '../components/ConfirmationModal';
import { useAuth } from '../hooks/useAuth';
import LoadingGear from '../components/LoadingGear';

export default function PersonalInformation() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const fileInputRef = useRef(null);
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        avatar_url: ''
    });
    const [message, setMessage] = useState('');

    useEffect(() => {
        const loadProfile = async () => {
            if (!user) return;
            try {
                // Pre-fill email from auth user object as fallback
                setFormData(prev => ({ ...prev, email: user.email }));

                // Fetch profile data
                try {
                    const profile = await api.getProfile(user.id);
                    if (profile) {
                        setFormData({
                            full_name: profile.full_name || '',
                            email: user.email, // Keep email from auth to ensure accuracy
                            avatar_url: profile.avatar_url || ''
                        });
                    }
                } catch (err) {
                    // Profile might not exist yet, which is fine
                    console.log('Profile fetch error (likely first time user):', err);
                }
            } catch (error) {
                console.error('Error loading profile:', error);
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');

        try {
            await api.updateProfile(user.id, {
                full_name: formData.full_name,
                updated_at: new Date()
            });
            setMessage('Profile updated successfully!');
        } catch (error) {
            console.error('Error saving profile:', error);
            setMessage('Failed to update profile.');
        } finally {
            setSaving(false);
        }
    };

    const handleFileSelect = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setMessage('Please select an image file.');
            return;
        }

        // Validate file size (2MB)
        if (file.size > 2 * 1024 * 1024) {
            setMessage('Image size must be less than 2MB.');
            return;
        }

        setUploading(true);
        setMessage('');

        try {
            const publicUrl = await api.uploadAvatar(user.id, file);
            setFormData(prev => ({ ...prev, avatar_url: publicUrl }));
            setMessage('Profile picture updated successfully!');
        } catch (error) {
            console.error('Error uploading avatar:', error);
            setMessage('Failed to upload profile picture.');
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteAvatar = async () => {
        setUploading(true);
        setMessage('');

        try {
            await api.deleteAvatar(user.id);
            setFormData(prev => ({ ...prev, avatar_url: '' }));
            setMessage('Profile picture removed successfully!');
        } catch (error) {
            console.error('Error deleting avatar:', error);
            setMessage('Failed to remove profile picture.');
        } finally {
            setUploading(false);
        }
    };

    if (loading) return <LoadingGear />;

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteAvatar}
                title="Delete Profile Picture"
                message="Are you sure you want to remove your profile picture?"
            />
            <button
                onClick={() => navigate('/settings')}
                className="flex items-center gap-2"
                style={{
                    marginBottom: '2rem',
                    color: 'var(--text-secondary)',
                    fontWeight: '500'
                }}
            >
                <ArrowLeft size={20} />
                <span>Back to Settings</span>
            </button>

            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>Personal Information</h1>

            <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius)' }}>
                {message && (
                    <div style={{
                        padding: '1rem',
                        marginBottom: '1.5rem',
                        borderRadius: 'var(--radius)',
                        background: message.includes('Failed') ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                        color: message.includes('Failed') ? 'var(--danger)' : 'var(--success)',
                        textAlign: 'center'
                    }}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* Avatar Upload */}
                    <div className="flex items-center gap-4" style={{ marginBottom: '1rem' }}>
                        <div style={{ position: 'relative' }}>
                            <div style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '50%',
                                background: formData.avatar_url ? 'transparent' : 'var(--bg-secondary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '2rem',
                                fontWeight: 'bold',
                                color: 'var(--text-secondary)',
                                border: '1px solid var(--border-color)',
                                overflow: 'hidden'
                            }}>
                                {formData.avatar_url ? (
                                    <img
                                        src={formData.avatar_url}
                                        alt="Profile"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    formData.full_name ? formData.full_name.charAt(0).toUpperCase() : <User />
                                )}
                            </div>
                            {formData.avatar_url && (
                                <button
                                    type="button"
                                    onClick={() => setIsDeleteModalOpen(true)}
                                    disabled={uploading}
                                    style={{
                                        position: 'absolute',
                                        top: '-5px',
                                        right: '-5px',
                                        width: '24px',
                                        height: '24px',
                                        aspectRatio: '1',
                                        minHeight: '24px',
                                        borderRadius: '50%',
                                        background: 'var(--danger)',
                                        color: 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        border: '2px solid var(--bg-card)'
                                    }}
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Profile Picture</div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileSelect}
                                style={{ display: 'none' }}
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                                className="flex items-center gap-2"
                                style={{
                                    padding: '0.5rem 1rem',
                                    borderRadius: 'var(--radius-md)',
                                    background: 'var(--bg-secondary)',
                                    color: 'var(--text-primary)',
                                    border: '1px solid var(--border-color)',
                                    fontWeight: '500',
                                    fontSize: '0.875rem',
                                    cursor: uploading ? 'not-allowed' : 'pointer',
                                    opacity: uploading ? 0.7 : 1
                                }}
                            >
                                <Upload size={16} />
                                <span>{uploading ? 'Uploading...' : 'Upload Photo'}</span>
                            </button>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                                JPG, PNG or WebP. Max size 2MB.
                            </div>
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Full Name</label>
                        <div className="flex items-center gap-2" style={{
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-md)',
                            padding: '0.75rem'
                        }}>
                            <User size={20} style={{ color: 'var(--text-secondary)' }} />
                            <input
                                type="text"
                                value={formData.full_name}
                                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                placeholder="Enter your full name"
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'var(--text-primary)',
                                    width: '100%',
                                    outline: 'none'
                                }}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Email Address</label>
                        <div className="flex items-center gap-2" style={{
                            background: 'rgba(0,0,0,0.2)', // Visual cue for disabled
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-md)',
                            padding: '0.75rem',
                            cursor: 'not-allowed'
                        }}>
                            <Mail size={20} style={{ color: 'var(--text-secondary)' }} />
                            <input
                                type="email"
                                value={formData.email}
                                disabled
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'var(--text-secondary)',
                                    width: '100%',
                                    outline: 'none',
                                    cursor: 'not-allowed'
                                }}
                            />
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                            Email cannot be changed here.
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center justify-center gap-2"
                        style={{
                            marginTop: '1rem',
                            padding: '1rem',
                            borderRadius: 'var(--radius-md)',
                            background: 'var(--accent-primary)',
                            color: 'white',
                            fontWeight: 'bold',
                            opacity: saving ? 0.7 : 1
                        }}
                    >
                        <Save size={20} />
                        <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                </form>
            </div>
        </div>
    );
}
