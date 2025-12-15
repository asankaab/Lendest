
import { supabase } from './supabase';

export const api = {
    // Transactions
    getTransactions: async () => {
        const { data, error } = await supabase
            .from('transactions')
            .select(`
                *,
                people (
                    name,
                    username
                )
            `)
            .order('created_at', { ascending: false });
        if (error) throw error;
        // Map old person_name if person_id is null (fallback)
        return data.map(tx => ({
            ...tx,
            person_name: tx.people ? tx.people.name : tx.person_name,
            person_username: tx.people ? tx.people.username : null
        }));
    },

    getTransactionsByPerson: async (username) => {
        const { data, error } = await supabase
            .from('transactions')
            .select(`
                *,
                people!inner(name, username)
            `)
            .eq('people.username', username)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data.map(tx => ({
            ...tx,
            person_name: tx.people ? tx.people.name : tx.person_name,
            person_username: tx.people ? tx.people.username : null
        }));
    },

    createTransaction: async (userId, transaction) => {
        let username = transaction.username;
        let name = transaction.person_name;

        // 1. Data Sanitization & Derivation
        if (!username && name) {
            // Legacy/Name-first: Generate username from name
            username = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
        } else if (username && !name) {
            // Username-first: Derive name from username
            name = username.split('_')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
        }

        // Final normalization
        username = username ? username.toLowerCase().trim().replace(/[^a-z0-9_]+/g, '_') : 'unknown_user';
        name = name ? name.trim() : username; // Fallback ensure name is not empty

        // 2. Upsert Person to ensure existence and get ID
        // unique key is (user_id, username)
        const { data: personData, error: personError } = await supabase
            .from('people')
            .upsert({
                user_id: userId,
                username: username,
                name: name
            }, {
                onConflict: 'user_id, username'
            })
            .select('id')
            .single();

        if (personError) throw personError;
        const personId = personData.id;

        // 3. Create Transaction
        // Remove username from transaction object as it's not in the transactions table
        const { username: _, ...transactionData } = transaction;

        const { data, error } = await supabase
            .from('transactions')
            .insert([{
                ...transactionData,
                user_id: userId,
                person_id: personId,
                person_name: name
            }])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // People
    getPeople: async () => {
        const { data, error } = await supabase
            .from('people')
            .select('*')
            .order('name', { ascending: true });
        if (error) throw error;
        return data;
    },

    createPerson: async (userId, { name, username }) => {
        // Use provided username or generate from name
        const finalUsername = username && username.trim() ? username.trim() : name.toLowerCase().trim().replace(/\s+/g, '_');

        const { data, error } = await supabase
            .from('people')
            .insert([{ user_id: userId, name, username: finalUsername }])
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    // Profiles/People
    getProfile: async (userId) => {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
        if (error) throw error;
        return data;
    },

    updateProfile: async (userId, updates) => {
        const { data, error } = await supabase
            .from('profiles')
            .upsert({ id: userId, ...updates })
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    uploadAvatar: async (userId, file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}/avatar.${fileExt}`;

        // Delete old avatar if exists
        const { data: existingFiles } = await supabase
            .storage
            .from('avatars')
            .list(userId);

        if (existingFiles && existingFiles.length > 0) {
            const filesToDelete = existingFiles.map(f => `${userId}/${f.name}`);
            await supabase.storage.from('avatars').remove(filesToDelete);
        }

        // Upload new avatar
        const { data, error } = await supabase
            .storage
            .from('avatars')
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: true
            });

        if (error) throw error;

        // Get public URL with cache-busting timestamp
        const { data: { publicUrl } } = supabase
            .storage
            .from('avatars')
            .getPublicUrl(fileName);

        // Add timestamp to prevent browser caching
        const urlWithTimestamp = `${publicUrl}?t=${Date.now()}`;

        // Update profile with avatar URL
        await api.updateProfile(userId, { avatar_url: urlWithTimestamp });

        return urlWithTimestamp;
    },

    deleteAvatar: async (userId) => {
        // List and delete all files in user's folder
        const { data: files } = await supabase
            .storage
            .from('avatars')
            .list(userId);

        if (files && files.length > 0) {
            const filesToDelete = files.map(f => `${userId}/${f.name}`);
            const { error } = await supabase
                .storage
                .from('avatars')
                .remove(filesToDelete);

            if (error) throw error;
        }

        // Update profile to remove avatar URL
        await api.updateProfile(userId, { avatar_url: null });
    },

    // Dashboard Aggregates (calculated on client for simplicity)
    getDashboardStats: async () => {
        const { data: transactions, error } = await supabase
            .from('transactions')
            .select('amount, type');

        if (error) throw error;

        const stats = transactions.reduce((acc, curr) => {
            const amount = parseFloat(curr.amount) || 0; // Handle potential nulls/invalid numbers
            if (curr.type === 'lend') {
                acc.owedToYou += amount;
            } else if (curr.type === 'borrow') {
                acc.youOwe += amount;
            } else if (curr.type === 'repayment') {
                // Repayment means "I got paid back", reducing the amount owed to me.
                acc.owedToYou -= amount;
            } else if (curr.type === 'paid_back') {
                // Paid back means "I paid them back", reducing the amount I owe.
                acc.youOwe -= amount;
            }
            return acc;
        }, { youOwe: 0, owedToYou: 0 });

        return {
            net: stats.owedToYou - stats.youOwe,
            ...stats
        };
    },

    getChartData: async () => {
        const { data: transactions, error } = await supabase
            .from('transactions')
            .select('amount, type, created_at')
            .order('created_at', { ascending: true });

        if (error) throw error;

        // Group by Year-Month to ensure correct sorting
        const monthlyData = transactions.reduce((acc, curr) => {
            const date = new Date(curr.created_at);
            const key = date.toISOString().slice(0, 7); // YYYY-MM

            if (!acc[key]) {
                acc[key] = {
                    date: key,
                    name: date.toLocaleString('default', { month: 'short' }),
                    amount: 0
                };
            }

            const amount = parseFloat(curr.amount) || 0;

            if (curr.type === 'lend') {
                acc[key].amount += amount;
            } else if (curr.type === 'borrow') {
                acc[key].amount -= amount;
            } else if (curr.type === 'repayment') {
                acc[key].amount -= amount;
            } else if (curr.type === 'paid_back') {
                acc[key].amount += amount; // Paid back increases net (reduces debt)
            }

            return acc;
        }, {});

        // Convert to array and sort by date key
        return Object.values(monthlyData).sort((a, b) => a.date.localeCompare(b.date));
    },

    deleteTransaction: async (transactionId) => {
        const { error } = await supabase
            .from('transactions')
            .delete()
            .eq('id', transactionId);
        if (error) throw error;
    },

    deletePerson: async (username) => {
        // First get the person ID
        const { data: person, error: fetchError } = await supabase
            .from('people')
            .select('id')
            .eq('username', username)
            .single();

        if (fetchError) throw fetchError;
        if (!person) throw new Error('Person not found');

        // Delete all transactions for this person first (manual cascade)
        const { error: txError } = await supabase
            .from('transactions')
            .delete()
            .eq('person_id', person.id);

        if (txError) throw txError;

        // Then delete the person
        const { error: personError } = await supabase
            .from('people')
            .delete()
            .eq('id', person.id);

        if (personError) throw personError;
    },

    updatePersonName: async (username, newName) => {
        const { error } = await supabase
            .from('people')
            .update({ name: newName })
            .eq('username', username);
        if (error) throw error;
    }
};
