export interface Achievement {
    id: string;
    achievement_code: string;
    title: string;
    description: string;
    badge_icon?: string;
    points_reward: number;
    category?: string;
}

export interface UserAchievement {
    id: string;
    achievement_id: string;
    earned_at: string;
    achievement?: Achievement;
}

export interface CapsuleProgress {
    id: string;
    slug: string;
    capsule_name: string;
    section_name: string;
    progress_percentage: number;
    completed_at?: string;
    last_accessed: string;
    time_spent_minutes: number;
}

export interface RedeemedPrize {
    id: string;
    prize_id: string;
    prize_name: string;
    prize_points: number;
    validation_code: string;
    redeemed_at: string;
    status: 'pending' | 'delivered' | 'cancelled';
}

export interface Prize {
    id: string;
    name: string;
    description: string;
    points: number;
    image: string;
    stock: number;
    category: string;
}

export interface UserProfile {
    id: string;
    user_id: string;
    email: string;
    name: string;
    role: string;
    level: number;
    created_at: string;
    phone: string;
    location: string;
    bio: string;
    avatar?: string;
}
