export type DashboardUser = {
  firstName?: string | null;
  lastName?: string | null;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  city?: string | null;
  country?: string | null;
  additionalInfo?: string | null;
  image?: string | null;
  createdAt?: Date | null;
};

export type Traveler = {
  name: string;
  avatar: string;
};

export type Trip = {
  id: string;
  title: string;
  status: "upcoming" | "completed" | "draft";
  startDate: string;
  endDate: string;
  destinations: string[];
  travelers: Traveler[];
  budget: number;
  spent: number;
  progress: number;
  coverImage: string;
};

export type RecommendedDestination = {
  id: string;
  city: string;
  country: string;
  image: string;
  rating: number;
  costIndex: string;
};

export const mockUser: DashboardUser = {
  firstName: "John",
  lastName: "Traveler",
  name: "John Traveler",
  email: "john@example.com",
  city: "Pune",
  country: "India",
  image:
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80",
  createdAt: new Date("2026-01-12T00:00:00.000Z"),
};

export const mockTrips: Trip[] = [
  {
    id: "kyoto-spring",
    title: "Kyoto Spring Escape",
    status: "upcoming",
    startDate: "May 24",
    endDate: "Jun 1",
    destinations: ["Kyoto", "Osaka", "Nara"],
    travelers: [
      {
        name: "John",
        avatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
      },
      {
        name: "Maya",
        avatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
      },
      {
        name: "Arjun",
        avatar:
          "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80",
      },
    ],
    budget: 4800,
    spent: 2780,
    progress: 72,
    coverImage:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "barcelona-summer",
    title: "Barcelona Summer Week",
    status: "upcoming",
    startDate: "Jul 12",
    endDate: "Jul 19",
    destinations: ["Barcelona", "Girona"],
    travelers: [
      {
        name: "John",
        avatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
      },
      {
        name: "Priya",
        avatar:
          "https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?auto=format&fit=crop&w=120&q=80",
      },
    ],
    budget: 3600,
    spent: 1420,
    progress: 45,
    coverImage:
      "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "iceland-aurora",
    title: "Iceland Aurora Drive",
    status: "upcoming",
    startDate: "Sep 3",
    endDate: "Sep 10",
    destinations: ["Reykjavik", "Vik", "Akureyri"],
    travelers: [
      {
        name: "John",
        avatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
      },
      {
        name: "Sam",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
      },
      {
        name: "Leah",
        avatar:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80",
      },
      {
        name: "Noah",
        avatar:
          "https://images.unsplash.com/photo-1504257432389-52343af06ae3?auto=format&fit=crop&w=120&q=80",
      },
    ],
    budget: 6200,
    spent: 1900,
    progress: 33,
    coverImage:
      "https://images.unsplash.com/photo-1504829857797-ddff29c27927?auto=format&fit=crop&w=900&q=80",
  },
];

export const recommendedDestinations: RecommendedDestination[] = [
  {
    id: "lisbon",
    city: "Lisbon",
    country: "Portugal",
    image:
      "https://images.unsplash.com/photo-1585208798174-6cedd86e019a?auto=format&fit=crop&w=700&q=80",
    rating: 4.8,
    costIndex: "$$",
  },
  {
    id: "bali",
    city: "Bali",
    country: "Indonesia",
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=700&q=80",
    rating: 4.9,
    costIndex: "$",
  },
  {
    id: "queenstown",
    city: "Queenstown",
    country: "New Zealand",
    image:
      "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?auto=format&fit=crop&w=700&q=80",
    rating: 4.7,
    costIndex: "$$$",
  },
  {
    id: "marrakesh",
    city: "Marrakesh",
    country: "Morocco",
    image:
      "https://images.unsplash.com/photo-1548018560-c7196548e84d?auto=format&fit=crop&w=700&q=80",
    rating: 4.6,
    costIndex: "$$",
  },
];
