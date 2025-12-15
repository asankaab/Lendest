import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { api } from '../lib/api';

export default function AddTransactionModal({ isOpen, onClose, onSubmit, initialPersonName = '', initialUsername = '' }) {
    const [formData, setFormData] = useState({
        type: 'lend',
        amount: '',
        person_name: initialPersonName,
        username: initialUsername,
        description: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Autocomplete states
    const [people, setPeople] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            fetchPeople();
            // Reset form if initial props change or on reopen (though usually unmounted, but good practice)
            setFormData(prev => ({
                ...prev,
                person_name: initialPersonName,
                username: initialUsername
            }));
        }
    }, [isOpen, initialPersonName, initialUsername]);

    // Close suggestions on click outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);

    const fetchPeople = async () => {
        try {
            const data = await api.getPeople();
            setPeople(data);
        } catch (err) {
            console.error('Failed to fetch people for autocomplete', err);
        }
    };

    const handleUsernameChange = (e) => {
        const val = e.target.value;
        setFormData({ ...formData, username: val, person_name: '' }); // Clear name if typing manual username
        setShowSuggestions(true);
    };

    const selectPerson = (person) => {
        setFormData({
            ...formData,
            username: person.username,
            person_name: person.name
        });
        setShowSuggestions(false);
    };

    // Filter suggestions
    const suggestions = people.filter(p =>
        p.username.toLowerCase().includes(formData.username.toLowerCase()) ||
        p.name.toLowerCase().includes(formData.username.toLowerCase())
    );

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await onSubmit(formData);
            setFormData({
                type: 'lend',
                amount: '',
                person_name: initialPersonName || '',
                username: initialUsername || '',
                description: ''
            });
            onClose();
        } catch (error) {
            console.error(error);
            setError('Failed to create transaction. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(5px)'
        }}>
            <div className="glass" style={{
                background: 'var(--bg-card)',
                padding: '2rem',
                borderRadius: 'var(--radius)',
                width: '100%',
                maxWidth: '500px',
                position: 'relative'
            }}>
                <button
                    onClick={onClose}
                    style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', color: 'var(--text-secondary)' }}
                >
                    <X size={24} />
                </button>

                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>New Transaction</h2>

                <form onSubmit={handleSubmit} className="flex" style={{ flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Type</label>
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, type: 'lend' })}
                                style={{
                                    flex: 1,
                                    padding: '0.75rem',
                                    borderRadius: 'var(--radius)',
                                    background: formData.type === 'lend' ? 'var(--success)' : 'var(--bg-secondary)',
                                    color: formData.type === 'lend' ? 'white' : 'var(--text-secondary)',
                                    fontWeight: 'bold',
                                    border: formData.type === 'lend' ? 'none' : '1px solid var(--border-color)'
                                }}
                            >
                                I Lent
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, type: 'borrow' })}
                                style={{
                                    flex: 1,
                                    padding: '0.75rem',
                                    borderRadius: 'var(--radius)',
                                    background: formData.type === 'borrow' ? 'var(--danger)' : 'var(--bg-secondary)',
                                    color: formData.type === 'borrow' ? 'white' : 'var(--text-secondary)',
                                    fontWeight: 'bold',
                                    border: formData.type === 'borrow' ? 'none' : '1px solid var(--border-color)'
                                }}
                            >
                                I Borrowed
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, type: 'repayment' })}
                                style={{
                                    flex: 1,
                                    padding: '0.75rem',
                                    borderRadius: 'var(--radius)',
                                    background: formData.type === 'repayment' ? 'var(--warning)' : 'var(--bg-secondary)',
                                    color: formData.type === 'repayment' ? 'white' : 'var(--text-secondary)',
                                    fontWeight: 'bold',
                                    border: formData.type === 'repayment' ? 'none' : '1px solid var(--border-color)'
                                }}
                            >
                                Got Paid
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, type: 'paid_back' })}
                                style={{
                                    flex: 1,
                                    padding: '0.75rem',
                                    borderRadius: 'var(--radius)',
                                    background: formData.type === 'paid_back' ? 'var(--danger)' : 'var(--bg-secondary)',
                                    color: formData.type === 'paid_back' ? 'white' : 'var(--text-secondary)',
                                    fontWeight: 'bold',
                                    border: formData.type === 'paid_back' ? 'none' : '1px solid var(--border-color)'
                                }}
                            >
                                I Paid Back
                            </button>
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Amount</label>
                        <input
                            type="number"
                            step="0.01"
                            required
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: 'var(--radius)',
                                border: '1px solid var(--border-color)',
                                background: 'var(--bg-secondary)',
                                color: 'var(--text-primary)'
                            }}
                            placeholder="0.00"
                        />
                    </div>

                    <div style={{ position: 'relative' }} ref={wrapperRef}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Username</label>
                        <input
                            type="text"
                            required
                            value={formData.username}
                            onChange={handleUsernameChange}
                            onFocus={() => setShowSuggestions(true)}
                            disabled={!!initialUsername}
                            autoComplete="off"
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: 'var(--radius)',
                                border: '1px solid var(--border-color)',
                                background: initialUsername ? 'rgba(0,0,0,0.1)' : 'var(--bg-secondary)',
                                color: 'var(--text-primary)',
                                cursor: initialUsername ? 'not-allowed' : 'text'
                            }}
                            placeholder="Find by username or create new (@username)"
                        />

                        {/* Autocomplete Dropdown */}
                        {showSuggestions && formData.username && !initialUsername && suggestions.length > 0 && (
                            <div style={{
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                right: 0,
                                background: 'var(--bg-card)',
                                border: '1px solid var(--border-color)',
                                borderRadius: 'var(--radius)',
                                marginTop: '4px',
                                maxHeight: '200px',
                                overflowY: 'auto',
                                zIndex: 10,
                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                            }}>
                                {suggestions.map(person => (
                                    <div
                                        key={person.id}
                                        onClick={() => selectPerson(person)}
                                        style={{
                                            padding: '0.75rem',
                                            cursor: 'pointer',
                                            borderBottom: '1px solid var(--border-color)',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}
                                        className="hover:bg-gray-100 dark:hover:bg-gray-800"
                                    >
                                        <span style={{ fontWeight: 'bold' }}>{person.name}</span>
                                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>@{person.username}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Description (Optional)</label>
                        <input
                            type="text"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: 'var(--radius)',
                                border: '1px solid var(--border-color)',
                                background: 'var(--bg-secondary)',
                                color: 'var(--text-primary)'
                            }}
                            placeholder="What is this for?"
                        />
                    </div>

                    {error && (
                        <div style={{ color: 'var(--danger)', fontSize: '0.875rem', textAlign: 'center' }}>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            marginTop: '0.5rem',
                            width: '100%',
                            padding: '1rem',
                            borderRadius: 'var(--radius)',
                            background: 'var(--accent-primary)',
                            color: 'white',
                            fontWeight: 'bold'
                        }}
                    >
                        {loading ? 'Saving...' : 'Save Transaction'}
                    </button>
                </form>
            </div>
        </div>
    );
}
