-- Seed Data for Money Lending & Borrowing App
-- This script populates the 'people' and 'transactions' tables with realistic sample data
-- Replace the user_id with your actual authenticated user ID from Supabase

DO $$
DECLARE
    -- IMPORTANT: Replace this with your actual user ID from auth.users
    v_user_id UUID := '9a132e0b-1a86-47cb-8717-256d8bcd8fc3';
    
    -- Person IDs
    v_sarah_id UUID;
    v_david_id UUID;
    v_rachel_id UUID;
    v_tom_id UUID;
    v_lisa_id UUID;
    v_kevin_id UUID;
    v_maria_id UUID;
    v_alex_id UUID;

BEGIN
    -- Insert People and capture IDs (Upsert safely)
    
    -- Sarah
    INSERT INTO public.people (id, user_id, name, username)
    VALUES (uuid_generate_v4(), v_user_id, 'Sarah Johnson', 'sarah_johnson')
    ON CONFLICT (user_id, username) DO UPDATE SET name = EXCLUDED.name
    RETURNING id INTO v_sarah_id;

    -- David
    INSERT INTO public.people (id, user_id, name, username)
    VALUES (uuid_generate_v4(), v_user_id, 'David Chen', 'david_chen')
    ON CONFLICT (user_id, username) DO UPDATE SET name = EXCLUDED.name
    RETURNING id INTO v_david_id;

    -- Rachel
    INSERT INTO public.people (id, user_id, name, username)
    VALUES (uuid_generate_v4(), v_user_id, 'Rachel Green', 'rachel_green')
    ON CONFLICT (user_id, username) DO UPDATE SET name = EXCLUDED.name
    RETURNING id INTO v_rachel_id;

    -- Tom
    INSERT INTO public.people (id, user_id, name, username)
    VALUES (uuid_generate_v4(), v_user_id, 'Tom Anderson', 'tom_anderson')
    ON CONFLICT (user_id, username) DO UPDATE SET name = EXCLUDED.name
    RETURNING id INTO v_tom_id;

    -- Lisa
    INSERT INTO public.people (id, user_id, name, username)
    VALUES (uuid_generate_v4(), v_user_id, 'Lisa Martinez', 'lisa_martinez')
    ON CONFLICT (user_id, username) DO UPDATE SET name = EXCLUDED.name
    RETURNING id INTO v_lisa_id;

    -- Kevin
    INSERT INTO public.people (id, user_id, name, username)
    VALUES (uuid_generate_v4(), v_user_id, 'Kevin Park', 'kevin_park')
    ON CONFLICT (user_id, username) DO UPDATE SET name = EXCLUDED.name
    RETURNING id INTO v_kevin_id;

    -- Maria
    INSERT INTO public.people (id, user_id, name, username)
    VALUES (uuid_generate_v4(), v_user_id, 'Maria Rodriguez', 'maria_rodriguez')
    ON CONFLICT (user_id, username) DO UPDATE SET name = EXCLUDED.name
    RETURNING id INTO v_maria_id;

    -- Alex
    INSERT INTO public.people (id, user_id, name, username)
    VALUES (uuid_generate_v4(), v_user_id, 'Alex Thompson', 'alex_thompson')
    ON CONFLICT (user_id, username) DO UPDATE SET name = EXCLUDED.name
    RETURNING id INTO v_alex_id;
    
    -- Insert Transactions with realistic scenarios
    INSERT INTO public.transactions (user_id, person_id, person_username, type, amount, description, created_at) VALUES
        -- Sarah Johnson - Roommate, frequent small transactions
        (v_user_id, v_sarah_id, 'sarah_johnson', 'lend', 850.00, 'Half of rent payment', NOW() - INTERVAL '5 days'),
        (v_user_id, v_sarah_id, 'sarah_johnson', 'borrow', 45.00, 'Groceries from Whole Foods', NOW() - INTERVAL '3 days'),
        (v_user_id, v_sarah_id, 'sarah_johnson', 'lend', 32.50, 'Electricity bill split', NOW() - INTERVAL '2 days'),
        (v_user_id, v_sarah_id, 'sarah_johnson', 'repayment', 45.00, 'Paid back grocery money', NOW() - INTERVAL '1 day'),
        (v_user_id, v_sarah_id, 'sarah_johnson', 'lend', 18.00, 'Netflix subscription share', NOW() - INTERVAL '12 hours'),

        -- David Chen - College friend, larger amounts
        (v_user_id, v_david_id, 'david_chen', 'lend', 1500.00, 'Emergency car repair', NOW() - INTERVAL '3 weeks'),
        (v_user_id, v_david_id, 'david_chen', 'repayment', 500.00, 'First installment for car repair', NOW() - INTERVAL '2 weeks'),
        (v_user_id, v_david_id, 'david_chen', 'lend', 75.00, 'Birthday dinner at Nobu', NOW() - INTERVAL '10 days'),
        (v_user_id, v_david_id, 'david_chen', 'repayment', 75.00, 'Paid back dinner money', NOW() - INTERVAL '8 days'),

        -- Rachel Green - Coworker, lunch and coffee
        (v_user_id, v_rachel_id, 'rachel_green', 'borrow', 12.50, 'Coffee at Starbucks', NOW() - INTERVAL '4 hours'),
        (v_user_id, v_rachel_id, 'rachel_green', 'lend', 28.00, 'Lunch at Chipotle', NOW() - INTERVAL '2 days'),
        (v_user_id, v_rachel_id, 'rachel_green', 'borrow', 15.00, 'Uber to office', NOW() - INTERVAL '5 days'),
        (v_user_id, v_rachel_id, 'rachel_green', 'lend', 42.00, 'Team lunch contribution', NOW() - INTERVAL '1 week'),
        (v_user_id, v_rachel_id, 'rachel_green', 'repayment', 12.50, 'Coffee money returned', NOW() - INTERVAL '3 hours'),

        -- Tom Anderson - Gym buddy, fitness related
        (v_user_id, v_tom_id, 'tom_anderson', 'lend', 120.00, 'Gym membership renewal', NOW() - INTERVAL '1 month'),
        (v_user_id, v_tom_id, 'tom_anderson', 'borrow', 35.00, 'Protein powder', NOW() - INTERVAL '2 weeks'),
        (v_user_id, v_tom_id, 'tom_anderson', 'lend', 60.00, 'Personal training session', NOW() - INTERVAL '10 days'),
        (v_user_id, v_tom_id, 'tom_anderson', 'repayment', 120.00, 'Gym membership paid back', NOW() - INTERVAL '5 days'),

        -- Lisa Martinez - Sister, family occasions
        (v_user_id, v_lisa_id, 'lisa_martinez', 'lend', 250.00, 'Mom birthday gift contribution', NOW() - INTERVAL '3 weeks'),
        (v_user_id, v_lisa_id, 'lisa_martinez', 'lend', 180.00, 'Concert tickets for The Weeknd', NOW() - INTERVAL '2 weeks'),
        (v_user_id, v_lisa_id, 'lisa_martinez', 'repayment', 250.00, 'Birthday gift money returned', NOW() - INTERVAL '1 week'),
        (v_user_id, v_lisa_id, 'lisa_martinez', 'borrow', 50.00, 'Gas money for road trip', NOW() - INTERVAL '3 days'),

        -- Kevin Park - Neighbor, occasional help
        (v_user_id, v_kevin_id, 'kevin_park', 'borrow', 25.00, 'Pizza delivery tip', NOW() - INTERVAL '6 days'),
        (v_user_id, v_kevin_id, 'kevin_park', 'lend', 95.00, 'Internet bill split', NOW() - INTERVAL '4 days'),
        (v_user_id, v_kevin_id, 'kevin_park', 'repayment', 25.00, 'Pizza tip returned', NOW() - INTERVAL '2 days'),

        -- Maria Rodriguez - Business partner, professional
        (v_user_id, v_maria_id, 'maria_rodriguez', 'lend', 2000.00, 'Conference registration fee', NOW() - INTERVAL '2 months'),
        (v_user_id, v_maria_id, 'maria_rodriguez', 'repayment', 1000.00, 'First half of conference fee', NOW() - INTERVAL '1 month'),
        (v_user_id, v_maria_id, 'maria_rodriguez', 'lend', 450.00, 'Flight tickets for business trip', NOW() - INTERVAL '3 weeks'),
        (v_user_id, v_maria_id, 'maria_rodriguez', 'repayment', 1000.00, 'Second half of conference fee', NOW() - INTERVAL '2 weeks'),

        -- Alex Thompson - Friend from book club, entertainment
        (v_user_id, v_alex_id, 'alex_thompson', 'lend', 65.00, 'Broadway show tickets', NOW() - INTERVAL '1 week'),
        (v_user_id, v_alex_id, 'alex_thompson', 'borrow', 22.00, 'Book club dinner', NOW() - INTERVAL '5 days'),
        (v_user_id, v_alex_id, 'alex_thompson', 'lend', 38.00, 'Museum membership', NOW() - INTERVAL '3 days'),
        (v_user_id, v_alex_id, 'alex_thompson', 'repayment', 65.00, 'Broadway tickets paid back', NOW() - INTERVAL '2 days');
        
END $$;
