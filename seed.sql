-- Seed Data for Money Lending & Borrowing App
-- This script populates the 'people' and 'transactions' tables with realistic sample data
-- Replace the user_id with your actual authenticated user ID from Supabase

DO $$
DECLARE
    -- IMPORTANT: Replace this with your actual user ID from auth.users
    v_user_id UUID := '0474baa6-9675-408a-940c-00e7632e3667';
    
    -- Person IDs
    v_sarah_id UUID := uuid_generate_v4();
    v_david_id UUID := uuid_generate_v4();
    v_rachel_id UUID := uuid_generate_v4();
    v_tom_id UUID := uuid_generate_v4();
    v_lisa_id UUID := uuid_generate_v4();
    v_kevin_id UUID := uuid_generate_v4();
    v_maria_id UUID := uuid_generate_v4();
    v_alex_id UUID := uuid_generate_v4();

BEGIN
    -- Insert People
    INSERT INTO public.people (id, user_id, name, username) VALUES
        (v_sarah_id, v_user_id, 'Sarah Johnson', 'sarah_johnson'),
        (v_david_id, v_user_id, 'David Chen', 'david_chen'),
        (v_rachel_id, v_user_id, 'Rachel Green', 'rachel_green'),
        (v_tom_id, v_user_id, 'Tom Anderson', 'tom_anderson'),
        (v_lisa_id, v_user_id, 'Lisa Martinez', 'lisa_martinez'),
        (v_kevin_id, v_user_id, 'Kevin Park', 'kevin_park'),
        (v_maria_id, v_user_id, 'Maria Rodriguez', 'maria_rodriguez'),
        (v_alex_id, v_user_id, 'Alex Thompson', 'alex_thompson')
    ON CONFLICT (user_id, username) DO NOTHING;
    
    -- Insert Transactions with realistic scenarios
    INSERT INTO public.transactions (user_id, person_id, person_name, type, amount, description, created_at) VALUES
        -- Sarah Johnson - Roommate, frequent small transactions
        (v_user_id, v_sarah_id, 'Sarah Johnson', 'lend', 850.00, 'Half of rent payment', NOW() - INTERVAL '5 days'),
        (v_user_id, v_sarah_id, 'Sarah Johnson', 'borrow', 45.00, 'Groceries from Whole Foods', NOW() - INTERVAL '3 days'),
        (v_user_id, v_sarah_id, 'Sarah Johnson', 'lend', 32.50, 'Electricity bill split', NOW() - INTERVAL '2 days'),
        (v_user_id, v_sarah_id, 'Sarah Johnson', 'repayment', 45.00, 'Paid back grocery money', NOW() - INTERVAL '1 day'),
        (v_user_id, v_sarah_id, 'Sarah Johnson', 'lend', 18.00, 'Netflix subscription share', NOW() - INTERVAL '12 hours'),

        -- David Chen - College friend, larger amounts
        (v_user_id, v_david_id, 'David Chen', 'lend', 1500.00, 'Emergency car repair', NOW() - INTERVAL '3 weeks'),
        (v_user_id, v_david_id, 'David Chen', 'repayment', 500.00, 'First installment for car repair', NOW() - INTERVAL '2 weeks'),
        (v_user_id, v_david_id, 'David Chen', 'lend', 75.00, 'Birthday dinner at Nobu', NOW() - INTERVAL '10 days'),
        (v_user_id, v_david_id, 'David Chen', 'repayment', 75.00, 'Paid back dinner money', NOW() - INTERVAL '8 days'),

        -- Rachel Green - Coworker, lunch and coffee
        (v_user_id, v_rachel_id, 'Rachel Green', 'borrow', 12.50, 'Coffee at Starbucks', NOW() - INTERVAL '4 hours'),
        (v_user_id, v_rachel_id, 'Rachel Green', 'lend', 28.00, 'Lunch at Chipotle', NOW() - INTERVAL '2 days'),
        (v_user_id, v_rachel_id, 'Rachel Green', 'borrow', 15.00, 'Uber to office', NOW() - INTERVAL '5 days'),
        (v_user_id, v_rachel_id, 'Rachel Green', 'lend', 42.00, 'Team lunch contribution', NOW() - INTERVAL '1 week'),
        (v_user_id, v_rachel_id, 'Rachel Green', 'repayment', 12.50, 'Coffee money returned', NOW() - INTERVAL '3 hours'),

        -- Tom Anderson - Gym buddy, fitness related
        (v_user_id, v_tom_id, 'Tom Anderson', 'lend', 120.00, 'Gym membership renewal', NOW() - INTERVAL '1 month'),
        (v_user_id, v_tom_id, 'Tom Anderson', 'borrow', 35.00, 'Protein powder', NOW() - INTERVAL '2 weeks'),
        (v_user_id, v_tom_id, 'Tom Anderson', 'lend', 60.00, 'Personal training session', NOW() - INTERVAL '10 days'),
        (v_user_id, v_tom_id, 'Tom Anderson', 'repayment', 120.00, 'Gym membership paid back', NOW() - INTERVAL '5 days'),

        -- Lisa Martinez - Sister, family occasions
        (v_user_id, v_lisa_id, 'Lisa Martinez', 'lend', 250.00, 'Mom birthday gift contribution', NOW() - INTERVAL '3 weeks'),
        (v_user_id, v_lisa_id, 'Lisa Martinez', 'lend', 180.00, 'Concert tickets for The Weeknd', NOW() - INTERVAL '2 weeks'),
        (v_user_id, v_lisa_id, 'Lisa Martinez', 'repayment', 250.00, 'Birthday gift money returned', NOW() - INTERVAL '1 week'),
        (v_user_id, v_lisa_id, 'Lisa Martinez', 'borrow', 50.00, 'Gas money for road trip', NOW() - INTERVAL '3 days'),

        -- Kevin Park - Neighbor, occasional help
        (v_user_id, v_kevin_id, 'Kevin Park', 'borrow', 25.00, 'Pizza delivery tip', NOW() - INTERVAL '6 days'),
        (v_user_id, v_kevin_id, 'Kevin Park', 'lend', 95.00, 'Internet bill split', NOW() - INTERVAL '4 days'),
        (v_user_id, v_kevin_id, 'Kevin Park', 'repayment', 25.00, 'Pizza tip returned', NOW() - INTERVAL '2 days'),

        -- Maria Rodriguez - Business partner, professional
        (v_user_id, v_maria_id, 'Maria Rodriguez', 'lend', 2000.00, 'Conference registration fee', NOW() - INTERVAL '2 months'),
        (v_user_id, v_maria_id, 'Maria Rodriguez', 'repayment', 1000.00, 'First half of conference fee', NOW() - INTERVAL '1 month'),
        (v_user_id, v_maria_id, 'Maria Rodriguez', 'lend', 450.00, 'Flight tickets for business trip', NOW() - INTERVAL '3 weeks'),
        (v_user_id, v_maria_id, 'Maria Rodriguez', 'repayment', 1000.00, 'Second half of conference fee', NOW() - INTERVAL '2 weeks'),

        -- Alex Thompson - Friend from book club, entertainment
        (v_user_id, v_alex_id, 'Alex Thompson', 'lend', 65.00, 'Broadway show tickets', NOW() - INTERVAL '1 week'),
        (v_user_id, v_alex_id, 'Alex Thompson', 'borrow', 22.00, 'Book club dinner', NOW() - INTERVAL '5 days'),
        (v_user_id, v_alex_id, 'Alex Thompson', 'lend', 38.00, 'Museum membership', NOW() - INTERVAL '3 days'),
        (v_user_id, v_alex_id, 'Alex Thompson', 'repayment', 65.00, 'Broadway tickets paid back', NOW() - INTERVAL '2 days');
        
END $$;
