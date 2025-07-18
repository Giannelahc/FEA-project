export const users = [
        {
            id: 'u1',
            name: 'Alice Johnson',
            username: 'alicej',
            email: 'alice@example.com',
            bio: 'Coffee lover ☕ | Tech enthusiast 💻',
            followers: ['u2', 'u3'],
            following: ['u2'],
            profileImage: 'https://i.pravatar.cc/150?img=1',
        },
        {
            id: 'u2',
            name: 'Bob Smith',
            username: 'bobsmith',
            email: 'bob@example.com',
            bio: 'Traveler 🌍 | Photographer 📸',
            followers: ['u1'],
            following: ['u1', 'u3'],
            profileImage: 'https://i.pravatar.cc/150?img=2',
        },
        {
            id: 'u3',
            name: 'Clara Lee',
            username: 'claralee',
            email: 'clara@example.com',
            bio: 'Writer ✍️ | Bookworm 📚',
            followers: ['u1', 'u2'],
            following: [],
            profileImage: 'https://i.pravatar.cc/150?img=3',
        }
    ]

export const tweets = [
        {
            id: 't1',
            userId: 'u1',
            content: 'Excited to share my new blog post! 📝',
            image: null,
            video: null,
            poll: null,
            createdAt: '2024-06-01T10:00:00Z',
            likes: 5,
        },
        {
            id: 't2',
            userId: 'u2',
            content: 'Where should I travel next? ✈️',
            image: null,
            video: null,
            poll: {
            question: 'Next destination?',
            options: [
                { option: 'Japan', votes: 5 },
                { option: 'Iceland', votes: 3 },
            ],
            },
            createdAt: '2024-06-02T12:00:00Z',
            likes: 8,
        },
        {
            id: 't3',
            userId: 'u3',
            content: 'Sunset vibes 🌅',
            image: 'https://source.unsplash.com/random/300x200',
            video: null,
            poll: null,
            createdAt: '2024-06-03T14:00:00Z',
            likes: 12,
        }
    ]

export const liveFeed = [...tweets].sort((a, b) =>
  new Date(b.createdAt) - new Date(a.createdAt)
);

export const mockData = {
  users,
  tweets,
  liveFeed,
};