"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, ExternalLink, Play, BookOpen, Users, Clock } from "lucide-react"
import { useState } from "react"

type Course = {
  id: number
  title: string
  description: string
  instructor: string
  duration: string
  level: string
  price: string
  rating: number
  students: number
  image: string
  link: string
  platform: string
  type: "course" | "book" | "video"
}

const courses: Course[] = [
  {
    id: 1,
    title: "Complete Ayurveda Course: Ancient Healing for Modern Life",
    description:
      "Comprehensive introduction to Ayurvedic principles, doshas, and practical applications for daily wellness.",
    instructor: "Dr. Vasant Lad",
    duration: "12 hours",
    level: "Beginner",
    price: "$89",
    rating: 4.8,
    students: 15420,
    image: "/placeholder.svg?height=200&width=300",
    link: "https://www.udemy.com/course/ayurveda-complete-guide/",
    platform: "Udemy",
    type: "course",
  },
  {
    id: 2,
    title: "Ayurveda and Panchakarma: The Science of Healing",
    description: "Deep dive into Panchakarma detoxification and rejuvenation therapies with practical guidance.",
    instructor: "Dr. Suhas Kshirsagar",
    duration: "8 hours",
    level: "Intermediate",
    price: "$129",
    rating: 4.9,
    students: 8750,
    image: "/placeholder.svg?height=200&width=300",
    link: "https://www.coursera.org/learn/ayurveda-panchakarma",
    platform: "Coursera",
    type: "course",
  },
  {
    id: 3,
    title: "Ayurvedic Nutrition and Cooking",
    description: "Learn to cook according to your dosha with seasonal recipes and therapeutic food combinations.",
    instructor: "Sahara Rose",
    duration: "6 hours",
    level: "Beginner",
    price: "$67",
    rating: 4.7,
    students: 12300,
    image: "/placeholder.svg?height=200&width=300",
    link: "https://www.skillshare.com/classes/Ayurvedic-Cooking/",
    platform: "Skillshare",
    type: "course",
  },
  {
    id: 4,
    title: "The Complete Guide to Ayurveda",
    description: "Comprehensive textbook covering all aspects of Ayurvedic medicine and philosophy.",
    instructor: "Dr. Gopi Warrier",
    duration: "480 pages",
    level: "All Levels",
    price: "$24.99",
    rating: 4.6,
    students: 5600,
    image: "/placeholder.svg?height=200&width=300",
    link: "https://www.amazon.com/Complete-Guide-Ayurveda-Gopi-Warrier/dp/0007145136",
    platform: "Amazon",
    type: "book",
  },
  {
    id: 5,
    title: "Ayurveda Lifestyle Wisdom",
    description: "Practical guide to incorporating Ayurvedic principles into modern daily life.",
    instructor: "Acharya Shunya",
    duration: "320 pages",
    level: "Beginner",
    price: "$18.95",
    rating: 4.8,
    students: 3200,
    image: "/placeholder.svg?height=200&width=300",
    link: "https://www.amazon.com/Ayurveda-Lifestyle-Wisdom-Complete-Prescription/dp/1622036816",
    platform: "Amazon",
    type: "book",
  },
  {
    id: 6,
    title: "Yoga and Ayurveda: Self-Healing and Self-Realization",
    description: "Explore the connection between yoga practice and Ayurvedic healing principles.",
    instructor: "Dr. David Frawley",
    duration: "45 min",
    level: "Intermediate",
    price: "Free",
    rating: 4.5,
    students: 28000,
    image: "/placeholder.svg?height=200&width=300",
    link: "https://www.youtube.com/watch?v=ayurveda-yoga-healing",
    platform: "YouTube",
    type: "video",
  },
  {
    id: 7,
    title: "Ayurvedic Herbalism Certification",
    description: "Professional certification course in Ayurvedic herbalism and plant medicine.",
    instructor: "California College of Ayurveda",
    duration: "200 hours",
    level: "Advanced",
    price: "$2,400",
    rating: 4.9,
    students: 450,
    image: "/placeholder.svg?height=200&width=300",
    link: "https://www.ayurvedacollege.com/herbalism-certification",
    platform: "CCA",
    type: "course",
  },
  {
    id: 8,
    title: "Ayurveda for Women's Health",
    description: "Specialized course focusing on women's health issues through an Ayurvedic lens.",
    instructor: "Dr. Claudia Welch",
    duration: "10 hours",
    level: "Intermediate",
    price: "$149",
    rating: 4.8,
    students: 6800,
    image: "/placeholder.svg?height=200&width=300",
    link: "https://www.udemy.com/course/ayurveda-womens-health/",
    platform: "Udemy",
    type: "course",
  },
]

const blogPosts = [
  {
    id: 1,
    title: "Understanding the Three Doshas: A Complete Guide",
    excerpt:
      "Learn about Vata, Pitta, and Kapha – the fundamental energies that govern your body and mind according to Ayurveda.",
    author: "Dr. Priya Sharma",
    readTime: "8 min read",
    category: "Fundamentals",
    tags: ["Doshas", "Basics", "Constitution"],
    image: "/placeholder.svg?height=300&width=500",
    featured: true,
  },
  {
    id: 2,
    title: "Seasonal Ayurveda: Adapting Your Routine",
    excerpt:
      "Discover how to adjust your diet, lifestyle, and practices according to the changing seasons for optimal health.",
    author: "Ravi Patel",
    readTime: "6 min read",
    category: "Lifestyle",
    tags: ["Seasons", "Routine", "Adaptation"],
    image: "/placeholder.svg?height=300&width=500",
  },
  {
    id: 3,
    title: "Ayurvedic Herbs for Modern Stress",
    excerpt:
      "Explore powerful adaptogenic herbs like Ashwagandha, Brahmi, and Jatamansi for managing contemporary stress.",
    author: "Dr. Anjali Mehta",
    readTime: "10 min read",
    category: "Herbs",
    tags: ["Stress", "Adaptogens", "Mental Health"],
    image: "/placeholder.svg?height=300&width=500",
  },
  {
    id: 4,
    title: "The Art of Ayurvedic Cooking",
    excerpt: "Learn the principles of cooking according to your dosha and how to use spices therapeutically.",
    author: "Chef Meera Krishnan",
    readTime: "12 min read",
    category: "Nutrition",
    tags: ["Cooking", "Spices", "Diet"],
    image: "/placeholder.svg?height=300&width=500",
  },
]

export default function LearnPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLevel, setSelectedLevel] = useState("all")
  const [selectedType, setSelectedType] = useState("all")

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLevel = selectedLevel === "all" || course.level.toLowerCase() === selectedLevel
    const matchesType = selectedType === "all" || course.type === selectedType

    return matchesSearch && matchesLevel && matchesType
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "course":
        return <Play className="h-4 w-4" />
      case "book":
        return <BookOpen className="h-4 w-4" />
      case "video":
        return <Play className="h-4 w-4" />
      default:
        return <BookOpen className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4">Learn Ayurveda</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Deepen your understanding with curated courses, books, and resources from leading Ayurveda experts
            worldwide.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search courses, books, and resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="course">Courses</SelectItem>
                <SelectItem value="book">Books</SelectItem>
                <SelectItem value="video">Videos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="mb-16">
          <h2 className="font-serif text-2xl font-bold mb-6">Recommended Courses & Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="shadow-lg hover:shadow-xl transition-shadow h-full flex flex-col">
                <div className="relative h-48">
                  <Image
                    src={course.image || "/placeholder.svg"}
                    alt={course.title}
                    fill
                    className="object-cover rounded-t-lg"
                  />
                  <div className="absolute top-2 left-2">
                    <Badge variant="secondary" className="bg-white/90">
                      {course.platform}
                    </Badge>
                  </div>
                  <div className="absolute top-2 right-2">
                    <Badge variant="outline" className="bg-white/90">
                      {getTypeIcon(course.type)}
                      <span className="ml-1 capitalize">{course.type}</span>
                    </Badge>
                  </div>
                </div>

                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">{course.level}</Badge>
                    <div className="flex items-center space-x-1">
                      <span className="text-yellow-400">★</span>
                      <span className="text-sm font-medium">{course.rating}</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">by {course.instructor}</p>
                </CardHeader>

                <CardContent className="flex flex-col flex-1">
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{course.description}</p>

                  <div className="mt-auto space-y-3">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{course.students.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-primary">{course.price}</span>
                      <Button size="sm" asChild>
                        <Link href={course.link} target="_blank" rel="noopener noreferrer">
                          View Course
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Blog Articles */}
        <div>
          <h2 className="font-serif text-2xl font-bold mb-6">Latest Articles</h2>

          {/* Featured Article */}
          {blogPosts
            .filter((p) => p.featured)
            .map((post) => (
              <Card
                key={post.id}
                className="mb-8 lg:flex lg:items-center lg:space-x-8 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="relative h-56 lg:h-80 lg:w-1/2">
                  <Image
                    src={post.image || "/placeholder.svg"}
                    alt={post.title}
                    fill
                    priority
                    className="object-cover rounded-t-lg lg:rounded-l-lg lg:rounded-tr-none"
                  />
                </div>
                <CardContent className="p-6 lg:w-1/2">
                  <Badge variant="secondary" className="mb-3">
                    {post.category}
                  </Badge>
                  <CardTitle className="mb-3 text-2xl">{post.title}</CardTitle>
                  <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                  <div className="text-sm text-muted-foreground mb-6">
                    By {post.author} • {post.readTime}
                  </div>
                  <Button variant="outline">
                    Read Article
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}

          {/* Grid of remaining posts */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts
              .filter((p) => !p.featured)
              .map((post) => (
                <Card key={post.id} className="shadow-lg hover:shadow-xl transition-shadow h-full flex flex-col">
                  <div className="relative h-48">
                    <Image
                      src={post.image || "/placeholder.svg"}
                      alt={post.title}
                      fill
                      className="object-cover rounded-t-lg"
                    />
                  </div>
                  <CardHeader>
                    <Badge variant="secondary" className="mb-2 w-fit">
                      {post.category}
                    </Badge>
                    <CardTitle className="text-lg">{post.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      By {post.author} • {post.readTime}
                    </p>
                  </CardHeader>
                  <CardContent className="flex flex-col flex-1">
                    <p className="text-muted-foreground text-sm mb-4 flex-1">{post.excerpt}</p>
                    <Button variant="outline" size="sm">
                      Read More
                      <ExternalLink className="ml-2 h-3 w-3" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
